import { MoreVertical, Plus } from 'lucide-react';
import { useAppState } from '../AppState';
import { renderIcon } from '../utils';
import { t } from '../i18n';
import type { ModalType } from '../types';

interface GoalsProps {
  onAdd: (type: NonNullable<ModalType>, defaults?: any) => void;
  onMenu: (type: NonNullable<ModalType>, id: string) => void;
}

export default function Goals({ onAdd, onMenu }: GoalsProps) {
  const { goals } = useAppState();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{t('goals.title')}</h1>
          <p className="text-[#a6a6a6] mt-0.5 text-base">{t('goals.subtitle')}</p>
        </div>
        <button
          onClick={() => onAdd('goal')}
          className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-white"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="space-y-2.5">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-[22px] bg-[#151515] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                >
                  {renderIcon(goal.icon)}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-medium truncate">{goal.title}</p>
                  <p className="text-sm text-[#666666]">{t(`category.${goal.category}`)} · {goal.progress}%</p>
                </div>
              </div>
              <button onClick={() => onMenu('goal', goal.id)} className="p-2 text-[#666666]">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#242424] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
