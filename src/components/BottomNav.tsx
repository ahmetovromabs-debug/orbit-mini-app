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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 pb-[max(1.5rem,var(--tg-safe-area-inset-bottom))] pt-3 bg-transparent pointer-events-none"
      role="tablist"
      aria-label={t('app.title')}
    >
      <div className="pointer-events-auto flex items-center gap-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={t(tab.labelKey)}
              onClick={() => onChange(tab.id)}
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform active:scale-95 ${
                isActive ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'bg-[#151515] text-[#a6a6a6]'
              }`}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
