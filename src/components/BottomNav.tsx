import { Home, Target, CheckCircle2, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../i18n';
import type { Tab } from '../types';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ElementType; labelKey: 'tab.today' | 'tab.goals' | 'tab.habits' | 'tab.schedule' | 'tab.profile' }[] = [
  { id: 'today', icon: Home, labelKey: 'tab.today' },
  { id: 'goals', icon: Target, labelKey: 'tab.goals' },
  { id: 'habits', icon: CheckCircle2, labelKey: 'tab.habits' },
  { id: 'schedule', icon: Calendar, labelKey: 'tab.schedule' },
  { id: 'profile', icon: User, labelKey: 'tab.profile' },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center px-3 pb-[max(0.75rem,var(--tg-safe-area-inset-bottom))] pt-2 bg-transparent pointer-events-none"
      role="tablist"
      aria-label={t('app.title')}
    >
      <div className="pointer-events-auto flex items-end justify-center gap-1 rounded-[32px] bg-[#0f0f0f]/90 backdrop-blur-xl px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center min-w-[56px] px-1.5 py-2 rounded-[24px] transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-[24px] bg-[#9B8AFB]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 flex flex-col items-center gap-1 ${isActive ? 'text-[#0a0a0a]' : 'text-[#a6a6a6]'}`}>
                <Icon size={20} strokeWidth={2} />
                <span className="text-[9px] font-medium leading-none">{t(tab.labelKey)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
