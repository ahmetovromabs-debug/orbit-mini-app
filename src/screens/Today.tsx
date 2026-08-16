import { Check, MoreVertical, Plus, Target } from 'lucide-react';
import { useAppState } from '../AppState';
import { getContrastText, toISODate } from '../utils';
import { t, formatDateLong } from '../i18n';

interface TodayProps {
  onAdd: (type: 'priority' | 'habit' | 'goal' | 'event', defaults?: any) => void;
  onMenu: (type: 'priority' | 'habit' | 'goal', id: string) => void;
}

export default function Today({ onAdd, onMenu }: TodayProps) {
  const { priorities, habits, focus, events, togglePriority, toggleHabit } = useAppState();

  const donePriorities = priorities.filter((p) => p.done).length;
  const doneHabits = habits.filter((h) => h.done).length;
  const doneCount = donePriorities + doneHabits;
  const totalCount = priorities.length + habits.length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const today = toISODate();
  const todayEvents = events.filter((e) => e.date === today).sort((a, b) => a.start.localeCompare(b.start));

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

      <div className="rounded-[28px] bg-[#151515] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-[20px] bg-[#9B8AFB] flex items-center justify-center shrink-0 text-[#0a0a0a]">
            <Target size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[#a6a6a6] uppercase tracking-wide">{t('today.focus')}</p>
            <p className="text-base font-medium leading-snug mt-0.5 break-words">{focus || t('today.emptyFocus')}</p>
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
          <div className="rounded-[22px] bg-[#151515] p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#666666]">{t('today.noPriorities')}</p>
            <button
              onClick={() => onAdd('priority')}
              className="mt-2 text-sm font-medium text-[#9B8AFB]"
            >
              {t('common.add')}
            </button>
          </div>
        )}
        {priorities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-[22px] bg-[#151515] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <button onClick={() => togglePriority(item.id)} className="min-w-0 flex-1 text-left">
              <span className={`block text-base font-medium truncate ${item.done ? 'text-[#666666] line-through' : 'text-white'}`}>
                {item.title}
              </span>
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePriority(item.id)}
                aria-label={item.done ? t('common.markUndone') : t('common.markDone')}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90 ${
                  item.done ? 'bg-[#9B8AFB] border-[#9B8AFB]' : 'border-[#3a3a3a]'
                }`}
              >
                {item.done && <Check size={14} className="text-[#0a0a0a]" />}
              </button>
              <button
                onClick={() => onMenu('priority', item.id)}
                aria-label={t('common.edit')}
                className="p-2 text-[#666666] rounded-full transition-colors active:bg-white/5"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
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
          <div className="rounded-[22px] bg-[#151515] p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <p className="text-sm text-[#666666]">{t('today.noHabits')}</p>
            <button
              onClick={() => onAdd('habit')}
              className="mt-2 text-sm font-medium text-[#9B8AFB]"
            >
              {t('common.add')}
            </button>
          </div>
        )}
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-[22px] bg-[#151515] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <button onClick={() => toggleHabit(habit.id)} className="min-w-0 flex items-center gap-3 flex-1 text-left">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
              <span className={`block text-base font-medium truncate ${habit.done ? 'text-[#666666] line-through' : 'text-white'}`}>
                {habit.title}
              </span>
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-[#a6a6a6]">{t('habits.streak', { count: habit.streak })}</span>
              <button
                onClick={() => toggleHabit(habit.id)}
                aria-label={habit.done ? t('common.markUndone') : t('common.markDone')}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90 ${
                  habit.done ? 'bg-[#9B8AFB] border-[#9B8AFB]' : 'border-[#3a3a3a]'
                }`}
              >
                {habit.done && <Check size={14} className="text-[#0a0a0a]" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {todayEvents.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs text-[#a6a6a6] uppercase tracking-wide">{t('today.schedule')}</p>
          {todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-[22px] bg-[#151515] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
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
