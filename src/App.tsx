import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Tab, ModalType, ModalState } from './types';
import { useAppState } from './AppState';
import { t } from './i18n';
import BottomNav from './components/BottomNav';
import ActionSheet from './components/ActionSheet';
import ItemForm from './components/ItemForm';
import FocusTimer from './components/FocusTimer';
import Confetti from './components/Confetti';
import Today from './screens/Today';
import Goals from './screens/Goals';
import Habits from './screens/Habits';
import Schedule from './screens/Schedule';
import Profile from './screens/Profile';

type SheetState = { type: NonNullable<ModalType>; id: string } | null;

const TAB_ORDER: Tab[] = ['today', 'goals', 'habits', 'schedule', 'profile'];

function haptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  const tg = (window as any).Telegram?.WebApp?.HapticFeedback;
  tg?.impactOccurred?.(type);
}

function initTelegram() {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    tg.BottomBar?.setParams?.({ color: '#0a0a0a' });
    tg.disableVerticalSwipes?.();
  } catch {
    // ignore
  }
  return tg;
}

export default function App() {
  const { priorities, habits, deleteGoal, deleteHabit, deleteEvent, deletePriority } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const doneCount = priorities.filter((p) => p.done).length + habits.filter((h) => h.done).length;
  const totalCount = priorities.length + habits.length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (progress === 100 && totalCount > 0) {
      setConfetti(true);
      haptic('heavy');
    } else {
      setConfetti(false);
    }
  }, [progress, totalCount]);

  useEffect(() => {
    const tg = initTelegram();
    if (!tg) return;

    const applyInsets = () => {
      const root = document.documentElement;
      const safe = tg.safeAreaInset || {};
      const content = tg.contentSafeAreaInset || {};

      const safeTop = safe.top || 0;
      const safeRight = safe.right || 0;
      const safeBottom = safe.bottom || 0;
      const safeLeft = safe.left || 0;

      const contentTop = content.top || 0;
      const contentRight = content.right || 0;
      const contentBottom = content.bottom || 0;
      const contentLeft = content.left || 0;

      const set = (name: string, value: number) => root.style.setProperty(name, `${value}px`);

      set('--tg-safe-area-inset-top', safeTop);
      set('--tg-safe-area-inset-right', safeRight);
      set('--tg-safe-area-inset-bottom', safeBottom);
      set('--tg-safe-area-inset-left', safeLeft);

      set('--tg-inset-top', safeTop + contentTop);
      set('--tg-inset-right', safeRight + contentRight);
      set('--tg-inset-bottom', safeBottom + contentBottom);
      set('--tg-inset-left', safeLeft + contentLeft);

      root.style.setProperty('--tg-viewport-height', `${tg.viewportHeight || window.innerHeight}px`);
      root.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight || window.innerHeight}px`);
    };
    applyInsets();
    tg.onEvent?.('safeAreaChanged', applyInsets);
    tg.onEvent?.('contentSafeAreaChanged', applyInsets);
    tg.onEvent?.('viewportChanged', applyInsets);

    try {
      if (tg.requestFullscreen && !tg.isFullscreen) {
        tg.requestFullscreen?.();
      }
    } catch {
      // ignore
    }

    return () => {
      tg.offEvent?.('safeAreaChanged', applyInsets);
      tg.offEvent?.('contentSafeAreaChanged', applyInsets);
      tg.offEvent?.('viewportChanged', applyInsets);
    };
  }, []);

  const closeModal = () => setModal(null);
  const closeSheet = () => setSheet(null);
  const openMenu = (type: NonNullable<ModalType>, id: string) => setSheet({ type, id });
  const openForm = (type: NonNullable<ModalType>, defaults?: ModalState['defaults']) =>
    setModal({ type, id: null, defaults });

  const handleDelete = (type: NonNullable<ModalType>, id: string) => {
    if (type === 'goal') deleteGoal(id);
    if (type === 'habit') deleteHabit(id);
    if (type === 'event') deleteEvent(id);
    if (type === 'priority') deletePriority(id);
    closeSheet();
  };

  const direction = useMemo(() => {
    const current = TAB_ORDER.indexOf(activeTab);
    return current >= 0 ? current * 1 : 0;
  }, [activeTab]);

  const renderScreen = () => {
    const props = { onMenu: openMenu, onAdd: openForm };
    switch (activeTab) {
      case 'today':
        return <Today {...props} onStartFocus={() => setFocusOpen(true)} />;
      case 'goals':
        return <Goals {...props} />;
      case 'habits':
        return <Habits {...props} />;
      case 'schedule':
        return <Schedule {...props} />;
      case 'profile':
        return <Profile />;
      default:
        return <Today {...props} onStartFocus={() => setFocusOpen(true)} />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-[var(--tg-viewport-stable-height,100dvh)] h-full overflow-hidden bg-[#0a0a0a]">
      <main
        className="flex-1 overflow-y-auto px-3 pt-[max(1.5rem,var(--tg-inset-top,0px))] pb-[calc(7.5rem+var(--tg-inset-bottom,0px))]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />

      {sheet && (
        <ActionSheet
          title={t('actionSheet.title')}
          options={[
            {
              label: t('common.edit'),
              onClick: () => {
                setModal({ type: sheet.type, id: sheet.id });
                closeSheet();
              },
            },
            {
              label: t('common.delete'),
              danger: true,
              onClick: () => handleDelete(sheet.type, sheet.id),
            },
          ]}
          onClose={closeSheet}
        />
      )}

      {modal && <ItemForm type={modal.type} id={modal.id} defaults={modal.defaults} onClose={closeModal} />}
      {focusOpen && <FocusTimer onClose={() => setFocusOpen(false)} />}
      <Confetti active={confetti} onDone={() => setConfetti(false)} />
    </div>
  );
}
