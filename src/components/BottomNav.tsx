import { Home, Target, CheckCircle2, Calendar } from 'lucide-react';
import { t } from '../i18n';
import type { Tab } from '../types';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ElementType; labelKey: 'tab.today' | 'tab.goals' | 'tab.habits' | 'tab.schedule' }[] = [
  { id: 'today', icon: Home, labelKey: 'tab.today' },
  { id: 'goals', icon: Target, labelKey: 'tab.goals' },
  { id: 'habits', icon: CheckCircle2, labelKey: 'tab.habits' },
  { id: 'schedule', icon: Calendar, labelKey: 'tab.schedule' },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center px-4 pb-[max(1rem,var(--tg-safe-area-inset-bottom))] pt-2 bg-transparent pointer-events-none"
      role="tablist"
      aria-label={t('app.title')}
    >
      <div className="pointer-events-auto flex items-end justify-center gap-1.5 rounded-[32px] bg-[#0f0f0f]/80 backdrop-blur-md px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] px-2 py-2 rounded-[24px] transition-transform active:scale-90 ${
                isActive ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'text-[#a6a6a6] hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="mt-1 text-[10px] font-medium leading-none">{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
