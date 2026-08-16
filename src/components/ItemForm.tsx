import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useAppState } from '../AppState';
import { PALETTE, ICONS, toISODate } from '../utils';
import { t } from '../i18n';
import type { Category, EventType, Goal, Habit, EventItem, Priority, ModalState, SubTask } from '../types';

interface ItemFormProps {
  type: 'goal' | 'habit' | 'event' | 'priority';
  id: string | null;
  defaults?: ModalState['defaults'];
  onClose: () => void;
}

const EVENT_TYPES: EventType[] = ['focus', 'meeting', 'routine', 'rest'];
const CATEGORIES: Category[] = ['Personal', 'Health', 'Career', 'Finance', 'Learning', 'Relationships', 'Creative'];

export default function ItemForm({ type, id, defaults, onClose }: ItemFormProps) {
  const { goals, habits, events, priorities, addGoal, updateGoal, addHabit, updateHabit, addEvent, updateEvent, addPriority, updatePriority } = useAppState();

  const existing = useMemo(() => {
    if (!id) return null;
    if (type === 'goal') return goals.find((g) => g.id === id) || null;
    if (type === 'habit') return habits.find((h) => h.id === id) || null;
    if (type === 'event') return events.find((e) => e.id === id) || null;
    if (type === 'priority') return priorities.find((p) => p.id === id) || null;
    return null;
  }, [type, id, goals, habits, events, priorities]);

  const isEdit = Boolean(existing);

  const defaultGoal = { title: '', category: 'Personal' as Category, target: '', progress: 0, deadline: '', color: PALETTE[0], icon: 'target' };
  const defaultHabit = { title: '', icon: 'zap', color: PALETTE[0] };
  const defaultEvent = { title: '', date: toISODate(), start: '09:00', end: '10:00', allDay: false, type: 'focus' as EventItem['type'], color: PALETTE[0] };
  const defaultPriority = { title: '', done: false, subTasks: [] as SubTask[] };

  const [goal, setGoal] = useState<Partial<Goal>>(defaultGoal);
  const [habit, setHabit] = useState<Partial<Habit>>(defaultHabit);
  const [event, setEvent] = useState<Partial<EventItem>>(defaultEvent);
  const [priority, setPriority] = useState<Partial<Priority>>(defaultPriority);
  const [subTaskInput, setSubTaskInput] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (existing) {
      if (type === 'goal') setGoal(existing as Goal);
      if (type === 'habit') setHabit(existing as Habit);
      if (type === 'event') setEvent(existing as EventItem);
      if (type === 'priority') setPriority(existing as Priority);
      return;
    }
    const d = (defaults as any) || {};
    if (type === 'goal') setGoal({ ...defaultGoal, ...d });
    if (type === 'habit') setHabit({ ...defaultHabit, ...d });
    if (type === 'event') setEvent({ ...defaultEvent, ...d });
    if (type === 'priority') setPriority({ ...defaultPriority, ...d });
  }, [existing, type, defaults]);

  const addSubTask = () => {
    const text = subTaskInput.trim();
    if (!text) return;
    const newTask: SubTask = { id: Math.random().toString(36).slice(2, 9), title: text, done: false };
    setPriority((p) => ({ ...p, subTasks: [...(p.subTasks || []), newTask] }));
    setSubTaskInput('');
  };

  const removeSubTask = (subId: string) => {
    setPriority((p) => ({ ...p, subTasks: (p.subTasks || []).filter((s) => s.id !== subId) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'goal') {
      const payload = goal as Goal;
      if (!payload.title?.trim()) return;
      if (isEdit && id) updateGoal(id, payload);
      else addGoal(payload);
    }
    if (type === 'habit') {
      const payload = habit as Habit;
      if (!payload.title?.trim()) return;
      if (isEdit && id) updateHabit(id, payload);
      else addHabit({ ...payload, streak: 0, done: false, history: [] } as Habit);
    }
    if (type === 'event') {
      let payload = event as EventItem;
      if (payload.allDay) {
        payload = { ...payload, start: '00:00', end: '23:59' };
      } else if (payload.start && payload.end && payload.start >= payload.end) {
        const [h, m] = payload.start.split(':').map(Number);
        const endMin = h * 60 + m + 30;
        const endH = String(Math.floor(endMin / 60)).padStart(2, '0');
        const endM = String(endMin % 60).padStart(2, '0');
        payload = { ...payload, end: `${endH}:${endM}` };
      }
      if (!payload.title?.trim()) return;
      if (isEdit && id) updateEvent(id, payload);
      else addEvent(payload);
    }
    if (type === 'priority') {
      const payload = priority as Priority;
      if (!payload.title?.trim()) return;
      const done = (payload.subTasks || []).length > 0 ? payload.subTasks.every((s) => s.done) : payload.done;
      const final = { ...payload, done };
      if (isEdit && id) updatePriority(id, final);
      else addPriority(final);
    }
    onClose();
  };

  const formTitle = () => {
    if (type === 'goal') return isEdit ? t('form.editGoal') : t('form.newGoal');
    if (type === 'habit') return isEdit ? t('form.editHabit') : t('form.newHabit');
    if (type === 'event') return isEdit ? t('form.editEvent') : t('form.newEvent');
    return isEdit ? t('form.editPriority') : t('form.newPriority');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.form
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex max-h-[85vh] flex-col rounded-t-[32px] bg-[#0f0f0f] p-4 pb-[max(1rem,var(--tg-safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#333]" />
        <h2 className="mb-4 text-2xl font-semibold">{formTitle()}</h2>

        <div className="overflow-y-auto pr-1">
          {type === 'priority' && (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('form.title')}</span>
                <input
                  autoFocus
                  value={priority.title}
                  onChange={(e) => setPriority((p) => ({ ...p, title: e.target.value }))}
                  placeholder={t('form.titlePlaceholder')}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm text-[#a6a6a6]">{t('subtask.add')}</span>
                <div className="flex gap-2">
                  <input
                    value={subTaskInput}
                    onChange={(e) => setSubTaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubTask(); } }}
                    placeholder={t('subtask.placeholder')}
                    className="flex-1 rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                  />
                  <button
                    type="button"
                    onClick={addSubTask}
                    className="w-12 h-12 rounded-[20px] bg-[#9B8AFB] text-[#0a0a0a] flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <AnimatePresence>
                  {(priority.subTasks || []).map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={sub.title}
                        onChange={(e) => {
                          const next = [...(priority.subTasks || [])];
                          next[idx] = { ...sub, title: e.target.value };
                          setPriority((p) => ({ ...p, subTasks: next }));
                        }}
                        className="flex-1 rounded-[16px] bg-[#151515] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubTask(sub.id)}
                        className="w-9 h-9 rounded-[14px] bg-[#2a1a1a] text-[#FF9F9F] flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {type === 'goal' && (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('goal.title')}</span>
                <input
                  autoFocus
                  value={goal.title}
                  onChange={(e) => setGoal((g) => ({ ...g, title: e.target.value }))}
                  placeholder={t('form.titlePlaceholder')}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('goal.category')}</span>
                <select
                  value={goal.category}
                  onChange={(e) => setGoal((g) => ({ ...g, category: e.target.value as Category }))}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                >
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{t(`category.${c}`)}</option>))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-sm text-[#a6a6a6]">{t('goal.target')}</span>
                  <input
                    value={goal.target}
                    onChange={(e) => setGoal((g) => ({ ...g, target: e.target.value }))}
                    placeholder={t('goal.targetPlaceholder')}
                    className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm text-[#a6a6a6]">{t('goal.deadline')}</span>
                  <input
                    type="date"
                    value={goal.deadline}
                    onChange={(e) => setGoal((g) => ({ ...g, deadline: e.target.value }))}
                    className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                  />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('goal.progress', { progress: goal.progress ?? 0 })}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(e) => setGoal((g) => ({ ...g, progress: Number(e.target.value) }))}
                  className="w-full accent-[#9B8AFB]"
                />
              </label>
            </div>
          )}

          {type === 'habit' && (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('habit.title')}</span>
                <input
                  autoFocus
                  value={habit.title}
                  onChange={(e) => setHabit((h) => ({ ...h, title: e.target.value }))}
                  placeholder={t('form.titlePlaceholder')}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                />
              </label>
            </div>
          )}

          {type === 'event' && (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('event.title')}</span>
                <input
                  autoFocus
                  value={event.title}
                  onChange={(e) => setEvent((ev) => ({ ...ev, title: e.target.value }))}
                  placeholder={t('form.titlePlaceholder')}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white placeholder-[#666] outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-[#a6a6a6]">{t('event.date')}</span>
                <input
                  type="date"
                  value={event.date}
                  onChange={(e) => setEvent((ev) => ({ ...ev, date: e.target.value }))}
                  className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                />
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={event.allDay}
                  onChange={(e) => setEvent((ev) => ({ ...ev, allDay: e.target.checked }))}
                  className="w-5 h-5 rounded accent-[#9B8AFB]"
                />
                <span className="text-sm text-white">{t('event.allDay')}</span>
              </label>

              {!event.allDay && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1.5">
                      <span className="text-sm text-[#a6a6a6]">{t('event.start')}</span>
                      <input
                        type="time"
                        value={event.start}
                        onChange={(e) => setEvent((ev) => ({ ...ev, start: e.target.value }))}
                        className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm text-[#a6a6a6]">{t('event.end')}</span>
                      <input
                        type="time"
                        value={event.end}
                        onChange={(e) => setEvent((ev) => ({ ...ev, end: e.target.value }))}
                        className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                      />
                    </label>
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-sm text-[#a6a6a6]">{t('event.type')}</span>
                    <select
                      value={event.type}
                      onChange={(e) => setEvent((ev) => ({ ...ev, type: e.target.value as EventItem['type'] }))}
                      className="w-full rounded-[20px] bg-[#151515] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#9B8AFB]"
                    >
                      {EVENT_TYPES.map((tType) => (<option key={tType} value={tType}>{t(`eventType.${tType}`)}</option>))}
                    </select>
                  </label>
                </>
              )}
            </div>
          )}

          {(type === 'goal' || type === 'habit' || type === 'event') && (
            <>
              <div className="mt-4 space-y-2">
                <span className="text-sm text-[#a6a6a6]">{t('color.label')}</span>
                <div className="flex flex-wrap gap-2.5">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        if (type === 'goal') setGoal((g) => ({ ...g, color: c }));
                        if (type === 'habit') setHabit((h) => ({ ...h, color: c }));
                        if (type === 'event') setEvent((ev) => ({ ...ev, color: c }));
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-90 ${
                        (type === 'goal' && goal.color === c) ||
                        (type === 'habit' && habit.color === c) ||
                        (type === 'event' && event.color === c)
                          ? 'border-white scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              {(type === 'goal' || type === 'habit') && (
                <div className="mt-4 space-y-2">
                  <span className="text-sm text-[#a6a6a6]">{t('icon.label')}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(ICONS).map(([name, icon]) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          if (type === 'goal') setGoal((g) => ({ ...g, icon: name }));
                          if (type === 'habit') setHabit((h) => ({ ...h, icon: name }));
                        }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform active:scale-90 ${
                          (type === 'goal' && goal.icon === name) ||
                          (type === 'habit' && habit.icon === name)
                            ? 'bg-[#9B8AFB] text-[#0a0a0a]'
                            : 'bg-[#151515] text-[#a6a6a6]'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 rounded-[24px] bg-[#151515] text-white font-medium transition-transform active:scale-95"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="h-14 flex-1 rounded-[24px] bg-[#9B8AFB] text-[#0a0a0a] font-semibold transition-transform active:scale-95"
          >
            {isEdit ? t('common.save') : t('common.create')}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
