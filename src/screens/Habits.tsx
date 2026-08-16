import { Check, MoreVertical, Plus } from 'lucide-react';
import { useAppState } from '../AppState';
import { renderIcon, toISODate } from '../utils';
import { t, formatWeekdayShort } from '../i18n';
import type { ModalType } from '../types';

interface HabitsProps {
  onAdd: (type: NonNullable<ModalType>, defaults?: any) => void;
  onMenu: (type: NonNullable<ModalType>, id: string) => void;
}

function last7Days() {
  const days: { label: string; date: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: formatWeekdayShort(d),
      date: toISODate(d),
    });
  }
  return days;
}

export default function Habits({ onAdd, onMenu }: HabitsProps) {
  const { habits, toggleHabit } = useAppState();
  const week = last7Days();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{t('habits.title')}</h1>
          <p className="text-[#a6a6a6] mt-0.5 text-base">{t('habits.subtitle')}</p>
        </div>
        <button
          onClick={() => onAdd('habit')}
          className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-white"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="rounded-[22px] bg-[#151515] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                  {renderIcon(habit.icon)}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-medium truncate">{habit.title}</p>
                  <p className="text-sm text-[#666666]">{t('habits.streak', { count: habit.streak })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    habit.done ? 'text-[#0a0a0a]' : 'text-[#666666]'
                  }`}
                  style={{ backgroundColor: habit.done ? habit.color : '#242424' }}
                >
                  <Check size={20} />
                </button>
                <button onClick={() => onMenu('habit', habit.id)} className="p-2 text-[#666666]">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-1.5">
              {(() => {
                const today = toISODate();
                return week.map((day) => {
                  const done = day.date === today ? habit.done : habit.history.includes(day.date);
                  return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] text-[#666666]">{day.label}</span>
                    <div
                      className="w-full aspect-square max-w-[36px] rounded-[12px] flex items-center justify-center"
                      style={{ backgroundColor: done ? habit.color : '#242424', color: done ? '#0a0a0a' : '#666666' }}
                    >
                      {done && <Check size={14} />}
                    </div>
                  </div>
                );
              });
            })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
