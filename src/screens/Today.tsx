import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MoreVertical, Plus, Target, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppState } from '../AppState';
import { getContrastText, toISODate } from '../utils';
import { t, formatDateLong } from '../i18n';

interface TodayProps {
  onAdd: (type: 'priority' | 'habit' | 'goal' | 'event', defaults?: any) => void;
  onMenu: (type: 'priority' | 'habit' | 'goal', id: string) => void;
  onStartFocus: () => void;
}

export default function Today({ onAdd, onMenu, onStartFocus }: TodayProps) {
  const { priorities, habits, focus, events, togglePriority, toggleHabit, toggleSubTask } = useAppState();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const donePriorities = priorities.filter((p) => p.done).length;
  const doneHabits = habits.filter((h) => h.done).length;
  const doneCount = donePriorities + doneHabits;
  const totalCount = priorities.length + habits.length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const today = toISODate();
  const todayEvents = events.filter((e) => e.date === today).sort((a, b) => a.start.localeCompare(b.start));

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[#a6a6a6] text-sm">{formatDateLong()}</p>
          <h1 className="text-4xl font-semibold tracking-tight mt-0.5">{t('today.title')}</h1>
        </div>
        <div className="text-right">
          <span className="text-4xl font-semibold tracking-tighter">{progress}%</span>
          <p className="text-xs text-[#a6a6a6]">{t('today.progress')}</p>
        </div>
      </header>

      <div className="rounded-[28px] p-[1px] bg-gradient-to-r from-[#9B8AFB] to-[#86D99C] shadow-[0_8px_32px_rgba(155,138,251,0.15)]">
        <div className="rounded-[28px] bg-[#0f0f0f] p-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-[20px] bg-[#9B8AFB]/20 flex items-center justify-center shrink-0 text-[#9B8AFB]">
                <Target size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#a6a6a6] uppercase tracking-wide">{t('today.focus')}</p>
                <p className="text-base font-medium leading-snug mt-0.5 break-words">{focus || t('today.emptyFocus')}</p>
              </div>
            </div>
            <button
              onClick={onStartFocus}
              className="shrink-0 w-11 h-11 rounded-full bg-[#9B8AFB] text-[#0a0a0a] flex items-center justify-center active:scale-90 transition-transform"
              aria-label={t('today.startFocus')}
            >
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#a6a6a6] uppercase tracking-wide">{t('today.priorities')}</p>
          <button
            onClick={() => onAdd('priority')}
            aria-label={t('common.add')}
            className="w-8 h-8 rounded-full bg-[#151515] flex items-center justify-center text-white transition-transform active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>
        {priorities.length === 0 && (
          <EmptyCard onAdd={() => onAdd('priority')} text={t('today.noPriorities')} />
        )}
        {priorities.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] bg-[#151515]/80 backdrop-blur border border-white/5 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-start justify-between gap-2">
              <button onClick={() => togglePriority(item.id)} className="min-w-0 flex-1 text-left">
                <span className={`block text-base font-medium truncate ${item.done ? 'text-[#666666] line-through' : 'text-white'}`}>
                  {item.title}
                </span>
              </button>
              <div className="flex items-center gap-2 shrink-0">
                {item.subTasks.length > 0 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1.5 text-[#666666] rounded-full transition-colors active:bg-white/5"
                    aria-label={expanded.has(item.id) ? t('common.close') : t('common.open')}
                  >
                    {expanded.has(item.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => togglePriority(item.id)}
                  aria-label={item.done ? t('common.markUndone') : t('common.markDone')}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    item.done ? 'bg-[#9B8AFB] border-[#9B8AFB]' : 'border-[#3a3a3a]'
                  }`}
                >
                  {item.done && <Check size={14} className="text-[#0a0a0a]" />}
                </motion.button>
                <button
                  onClick={() => onMenu('priority', item.id)}
                  aria-label={t('common.edit')}
                  className="p-2 text-[#666666] rounded-full transition-colors active:bg-white/5"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {expanded.has(item.id) && item.subTasks.length > 0 && (
              <div className="mt-3 space-y-2 pl-2 border-l-2 border-[#242424]">
                {item.subTasks.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubTask(item.id, sub.id)}
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                      sub.done ? 'bg-[#9B8AFB] border-[#9B8AFB]' : 'border-[#3a3a3a]'
                    }`}>
                      {sub.done && <Check size={12} className="text-[#0a0a0a]" />}
                    </span>
                    <span className={`text-sm ${sub.done ? 'text-[#666666] line-through' : 'text-white'}`}>{sub.title}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        <p className="text-xs text-[#666666]">{t('today.done', { done: doneCount, total: totalCount })}</p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#a6a6a6] uppercase tracking-wide">{t('today.habits')}</p>
          <button
            onClick={() => onAdd('habit')}
            aria-label={t('common.add')}
            className="w-8 h-8 rounded-full bg-[#151515] flex items-center justify-center text-white transition-transform active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>
        {habits.length === 0 && (
          <EmptyCard onAdd={() => onAdd('habit')} text={t('today.noHabits')} />
        )}
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-[22px] bg-[#151515]/80 backdrop-blur border border-white/5 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <button onClick={() => toggleHabit(habit.id)} className="min-w-0 flex items-center gap-3 flex-1 text-left">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
              <span className={`block text-base font-medium truncate ${habit.done ? 'text-[#666666] line-through' : 'text-white'}`}>
                {habit.title}
              </span>
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-[#a6a6a6]">{t('habits.streak', { count: habit.streak })}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleHabit(habit.id)}
                aria-label={habit.done ? t('common.markUndone') : t('common.markDone')}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                  habit.done ? 'bg-[#9B8AFB] border-[#9B8AFB]' : 'border-[#3a3a3a]'
                }`}
              >
                {habit.done && <Check size={14} className="text-[#0a0a0a]" />}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {todayEvents.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs text-[#a6a6a6] uppercase tracking-wide">{t('today.schedule')}</p>
          {todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-[22px] bg-[#151515]/80 backdrop-blur border border-white/5 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              <span className="text-sm text-[#a6a6a6] w-12 shrink-0">{event.allDay ? t('schedule.allDay') : event.start}</span>
              <div className="flex-1 rounded-[16px] px-3.5 py-2.5 font-medium text-sm truncate" style={{ backgroundColor: event.color, color: getContrastText(event.color) }}>
                {event.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyCard({ text, onAdd }: { text: string; onAdd: () => void }) {
  return (
    <div className="rounded-[22px] bg-[#151515]/80 backdrop-blur border border-white/5 p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <p className="text-sm text-[#666666]">{text}</p>
      <button
        onClick={onAdd}
        className="mt-2 text-sm font-medium text-[#9B8AFB] active:scale-95 transition-transform"
      >
        {t('common.add')}
      </button>
    </div>
  );
}
