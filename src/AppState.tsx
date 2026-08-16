import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadState, saveState, computeStreak } from './storage';
import { toISODate } from './utils';
import { setLocale } from './i18n';
import type { AppState, Goal, Habit, EventItem, Priority, Settings, Locale } from './types';

interface ContextType extends AppState {
  loaded: boolean;
  togglePriority: (id: string) => void;
  addPriority: (priority: Omit<Priority, 'id'>) => void;
  updatePriority: (id: string, patch: Partial<Priority>) => void;
  deletePriority: (id: string) => void;
  toggleSubTask: (priorityId: string, subTaskId: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleHabit: (id: string) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  setFocus: (focus: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
  importData: (json: string) => boolean;
}

const AppStateContext = createContext<ContextType | null>(null);

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function normalizePriorityDone(p: Priority): Priority {
  if (p.subTasks.length === 0) return p;
  const allDone = p.subTasks.every((s) => s.done);
  return { ...p, done: allDone };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    loadState().then((loaded) => {
      setLocale(loaded.settings.locale);
      setState(loaded);
    });
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center text-[#a6a6a6]">
        Loading...
      </div>
    );
  }

  const update = (fn: (s: AppState) => AppState) => setState((prev) => (prev ? fn(prev) : prev));

  const value: ContextType = {
    ...state,
    loaded: true,
    togglePriority: (id) => update((s) => ({
      ...s,
      priorities: s.priorities.map((p) => {
        if (p.id !== id) return p;
        const done = !p.done;
        return { ...p, done, subTasks: p.subTasks.map((st) => ({ ...st, done })) };
      }),
    })),
    addPriority: (priority) => update((s) => ({ ...s, priorities: [...s.priorities, { id: createId(), ...priority }] })),
    updatePriority: (id, patch) => update((s) => ({
      ...s,
      priorities: s.priorities.map((p) => p.id === id ? normalizePriorityDone({ ...p, ...patch, subTasks: patch.subTasks ?? p.subTasks }) : p),
    })),
    deletePriority: (id) => update((s) => ({ ...s, priorities: s.priorities.filter((p) => p.id !== id) })),
    toggleSubTask: (priorityId, subTaskId) => update((s) => ({
      ...s,
      priorities: s.priorities.map((p) => {
        if (p.id !== priorityId) return p;
        const subTasks = p.subTasks.map((st) => st.id === subTaskId ? { ...st, done: !st.done } : st);
        const done = subTasks.length > 0 ? subTasks.every((st) => st.done) : p.done;
        return { ...p, subTasks, done };
      }),
    })),
    addGoal: (goal) => update((s) => ({ ...s, goals: [...s.goals, { ...goal, id: createId() }] })),
    updateGoal: (id, patch) => update((s) => ({
      ...s,
      goals: s.goals.map((g) => g.id === id ? { ...g, ...patch } : g),
    })),
    deleteGoal: (id) => update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) })),
    toggleHabit: (id) => update((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const today = toISODate();
        const history = new Set(h.history);
        const done = !h.done;
        if (done) history.add(today);
        else history.delete(today);
        const arr = Array.from(history).sort();
        return { ...h, done, history: arr, streak: computeStreak(arr, done) };
      }),
    })),
    addHabit: (habit) => update((s) => ({ ...s, habits: [...s.habits, { ...habit, id: createId() }] })),
    updateHabit: (id, patch) => update((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const merged = { ...h, ...patch };
        return { ...merged, streak: computeStreak(merged.history, merged.done) };
      }),
    })),
    deleteHabit: (id) => update((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) })),
    addEvent: (event) => update((s) => ({ ...s, events: [...s.events, { ...event, id: createId() }] })),
    updateEvent: (id, patch) => update((s) => ({
      ...s,
      events: s.events.map((e) => e.id === id ? { ...e, ...patch } : e).sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)),
    })),
    deleteEvent: (id) => update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
    setFocus: (focus) => update((s) => ({ ...s, focus })),
    updateSettings: (patch) => update((s) => {
      const next: Settings = { ...s.settings, ...patch };
      if (next.locale) setLocale(next.locale);
      return { ...s, settings: next };
    }),
    resetData: () => update(() => {
      const fresh = {
        version: 3,
        settings: { locale: 'en' as Locale, weekStartsOn: 0 as 0 | 1 },
        goals: [],
        habits: [],
        events: [],
        focus: '',
        priorities: [],
      } as AppState;
      setLocale('en');
      return fresh;
    }),
    importData: (json) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') return false;
        // minimal validation
        if (!Array.isArray(parsed.goals) || !Array.isArray(parsed.habits) || !Array.isArray(parsed.events) || !Array.isArray(parsed.priorities)) return false;
        const imported: AppState = {
          version: parsed.version ?? 3,
          settings: {
            locale: parsed.settings?.locale === 'ru' ? 'ru' : 'en',
            weekStartsOn: parsed.settings?.weekStartsOn === 1 ? 1 : 0,
          },
          goals: parsed.goals,
          habits: parsed.habits,
          events: parsed.events,
          focus: typeof parsed.focus === 'string' ? parsed.focus : '',
          priorities: parsed.priorities,
        };
        setLocale(imported.settings.locale);
        setState(imported);
        return true;
      } catch {
        return false;
      }
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
