import { useEffect, useState } from 'react';
import type { Tab, ModalType, ModalState } from './types';
import { useAppState } from './AppState';
import { t } from './i18n';
import BottomNav from './components/BottomNav';
import ActionSheet from './components/ActionSheet';
import ItemForm from './components/ItemForm';
import Today from './screens/Today';
import Goals from './screens/Goals';
import Habits from './screens/Habits';
import Schedule from './screens/Schedule';

type SheetState = { type: NonNullable<ModalType>; id: string } | null;

function initTelegram() {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    tg.BottomBar?.setParams?.({ color: '#0a0a0a' });
  } catch {
    // ignore
  }
  return tg;
}

export default function App() {
  const { deleteGoal, deleteHabit, deleteEvent, deletePriority } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);

  useEffect(() => {
    const tg = initTelegram();
    if (!tg) return;

    const applyInsets = () => {
      const root = document.documentElement;
      const ins = tg.safeAreaInset || {};
      root.style.setProperty('--tg-safe-area-inset-top', `${ins.top || 0}px`);
      root.style.setProperty('--tg-safe-area-inset-right', `${ins.right || 0}px`);
      root.style.setProperty('--tg-safe-area-inset-bottom', `${ins.bottom || 0}px`);
      root.style.setProperty('--tg-safe-area-inset-left', `${ins.left || 0}px`);
    };
    applyInsets();
    tg.onEvent?.('safeAreaChanged', applyInsets);

    const goFullscreen = async () => {
      try {
        if (tg.requestFullscreen && !tg.isFullscreen) {
          await tg.requestFullscreen();
        }
      } catch (e) {
        // older clients or denied
        console.warn('requestFullscreen failed', e);
      }
    };
    goFullscreen();

    const onFsFailed = (e: any) => console.warn('fullscreen failed', e);
    tg.onEvent?.('fullscreenFailed', onFsFailed);

    return () => {
      tg.offEvent?.('safeAreaChanged', applyInsets);
      tg.offEvent?.('fullscreenFailed', onFsFailed);
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

  const renderScreen = () => {
    const props = { onMenu: openMenu, onAdd: openForm };
    switch (activeTab) {
      case 'today':
        return <Today {...props} />;
      case 'goals':
        return <Goals {...props} />;
      case 'habits':
        return <Habits {...props} />;
      case 'schedule':
        return <Schedule {...props} />;
      default:
        return <Today {...props} />;
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
      <main
        className="flex-1 overflow-y-auto px-3 pt-[max(1.25rem,var(--tg-safe-area-inset-top))] pb-28"
        style={{ paddingBottom: 'calc(7rem + var(--tg-safe-area-inset-bottom, 0px))' }}
      >
        {renderScreen()}
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
    </div>
  );
}
