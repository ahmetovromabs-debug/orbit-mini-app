import type { AppState, Goal, Habit, EventItem, Priority } from './types';

const STORAGE_KEY = 'orbit_state';
const CURRENT_VERSION = 2;

function toISODate(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function lastDays(n: number) {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) arr.push(offsetDate(-i));
  return arr;
}

const COLORS = {
  lavender: '#9B8AFB',
  mint: '#86D99C',
  yellow: '#F2C94C',
  blue: '#8CC8FF',
  coral: '#FF9F9F',
  sand: '#BFA886',
  graphite: '#666666',
  violet: '#5B21B6',
};

function defaultState(): AppState {
  const today = toISODate();
  return {
    version: CURRENT_VERSION,
    goals: [
      { id: '1', title: 'Make me', category: 'Personal', target: '1', progress: 0, deadline: '', color: COLORS.graphite, icon: 'spark', count: 0 },
      { id: '2', title: '2 liters of water', category: 'Health', target: '2L', progress: 20, deadline: '', color: COLORS.violet, icon: 'water', count: 1 },
      { id: '3', title: 'Future me. Be him, not now', category: 'Personal', target: '1', progress: 0, deadline: '', color: COLORS.graphite, icon: 'spark', count: 0 },
    ],
    habits: [
      { id: '1', title: 'Read 10 pages', icon: 'book', color: COLORS.lavender, streak: 12, done: false, history: lastDays(12) },
      { id: '2', title: 'Meditate 10 min', icon: 'brain', color: COLORS.mint, streak: 5, done: true, history: [...lastDays(5)] },
      { id: '3', title: 'No sugar', icon: 'zap', color: COLORS.yellow, streak: 3, done: false, history: lastDays(3) },
    ],
    events: [
      { id: '1', title: 'Morning focus', date: today, start: '09:00', end: '10:30', allDay: false, type: 'focus', color: COLORS.lavender },
      { id: '2', title: 'Lunch break', date: today, start: '12:30', end: '13:30', allDay: false, type: 'rest', color: COLORS.mint },
      { id: '3', title: 'Team sync', date: today, start: '15:00', end: '15:45', allDay: false, type: 'meeting', color: COLORS.blue },
    ],
    focus: 'Move closer to the life I want, one small step at a time',
    priorities: [
      { id: '1', title: 'Define 3 priorities for today', done: true },
      { id: '2', title: 'Spend 1 hour on the main goal', done: false },
      { id: '3', title: 'Review the day before sleep', done: false },
    ],
  };
}

function normalizeGoal(g: any): Goal {
  return {
    id: typeof g.id === 'string' ? g.id : Math.random().toString(36).slice(2, 9),
    title: String(g.title ?? ''),
    category: String(g.category ?? 'Personal'),
    target: String(g.target ?? ''),
    progress: Number(g.progress ?? 0),
    deadline: String(g.deadline ?? ''),
    color: String(g.color ?? COLORS.graphite),
    icon: String(g.icon ?? 'spark'),
    count: Number(g.count ?? 0),
  };
}

function normalizeHabit(h: any): Habit {
  const history = Array.isArray(h.history) ? h.history.filter((d: any) => typeof d === 'string') : [];
  return {
    id: typeof h.id === 'string' ? h.id : Math.random().toString(36).slice(2, 9),
    title: String(h.title ?? ''),
    icon: String(h.icon ?? 'zap'),
    color: String(h.color ?? COLORS.lavender),
    streak: Number(h.streak ?? 0),
    done: Boolean(h.done),
    history,
  };
}

function normalizeEvent(e: any): EventItem {
  return {
    id: typeof e.id === 'string' ? e.id : Math.random().toString(36).slice(2, 9),
    title: String(e.title ?? ''),
    date: String(e.date ?? toISODate()),
    start: String(e.start ?? '09:00'),
    end: String(e.end ?? '10:00'),
    allDay: Boolean(e.allDay),
    type: ['focus', 'meeting', 'routine', 'rest'].includes(e.type) ? e.type : 'focus',
    color: String(e.color ?? COLORS.lavender),
  };
}

function normalizePriority(p: any): Priority {
  return {
    id: typeof p.id === 'string' ? p.id : Math.random().toString(36).slice(2, 9),
    title: String(p.title ?? ''),
    done: Boolean(p.done),
  };
}

export function migrateState(parsed: any): AppState {
  const def = defaultState();
  if (!parsed || typeof parsed !== 'object') return def;
  return {
    version: CURRENT_VERSION,
    goals: Array.isArray(parsed.goals) ? parsed.goals.map(normalizeGoal) : def.goals,
    habits: Array.isArray(parsed.habits) ? parsed.habits.map(normalizeHabit) : def.habits,
    events: Array.isArray(parsed.events) ? parsed.events.map(normalizeEvent) : def.events,
    focus: typeof parsed.focus === 'string' ? parsed.focus : def.focus,
    priorities: Array.isArray(parsed.priorities) ? parsed.priorities.map(normalizePriority) : def.priorities,
  };
}

function getTelegram() {
  const tg = (window as any).Telegram?.WebApp;
  return tg || null;
}

function isInsideTelegram(tg: any) {
  return Boolean(tg?.initData);
}

function loadLocal(): AppState | null {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return migrateState(JSON.parse(local));
    } catch {}
  }
  return null;
}

export async function loadState(): Promise<AppState> {
  const tg = getTelegram();
  if (tg?.CloudStorage && isInsideTelegram(tg)) {
    return new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve(loadLocal() ?? defaultState());
        }
      }, 1500);
      tg.CloudStorage.getItem(STORAGE_KEY, (error: any, value: any) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (!error && value) {
          try {
            resolve(migrateState(JSON.parse(value)));
            return;
          } catch {}
        }
        resolve(loadLocal() ?? defaultState());
      });
    });
  }
  return loadLocal() ?? defaultState();
}

export function saveState(state: AppState) {
  const tg = getTelegram();
  const value = JSON.stringify(state);
  if (tg?.CloudStorage && isInsideTelegram(tg)) {
    tg.CloudStorage.setItem(STORAGE_KEY, value, () => {});
  }
  localStorage.setItem(STORAGE_KEY, value);
}
