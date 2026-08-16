import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Settings, Trash2, Download, Upload, Check, X, Flame } from 'lucide-react';
import { useAppState } from '../AppState';
import { toISODate } from '../utils';
import { t } from '../i18n';
import type { Locale } from '../types';

export default function Profile() {
  const {
    settings,
    updateSettings,
    goals,
    habits,
    events,
    priorities,
    resetData,
    importData,
  } = useAppState();

  const [section, setSection] = useState<'stats' | 'settings'>('stats');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cleared, setCleared] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const today = toISODate();

  const stats = useMemo(() => {
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = toISODate(d);
      const label = new Intl.DateTimeFormat(settings.locale, { weekday: 'narrow' }).format(d);
      const count = habits.filter((h) => {
        if (date === today) return h.done;
        return h.history.includes(date);
      }).length;
      days.push({ date, label, count });
    }

    const totalCompletions = habits.reduce((acc, h) => acc + h.history.length, 0);
    const bestStreak = habits.reduce((acc, h) => Math.max(acc, h.streak), 0);
    const avgStreak = habits.length ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length) : 0;
    const goalProgress = goals.length
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
      : 0;
    const eventsToday = events.filter((e) => e.date === today).length;
    const donePriorities = priorities.filter((p) => p.done).length;
    const totalPriorities = priorities.length;
    const doneHabits = habits.filter((h) => h.done).length;
    const totalHabits = habits.length;
    const completionRate = totalPriorities + totalHabits
      ? Math.round(((donePriorities + doneHabits) / (totalPriorities + totalHabits)) * 100)
      : 0;

    return { days, totalCompletions, bestStreak, avgStreak, goalProgress, eventsToday, completionRate };
  }, [habits, goals, events, priorities, settings.locale, today]);

  const exportJson = () => {
    const data = {
      version: 3,
      settings,
      goals,
      habits,
      events,
      focus: '', // from state, but not in context directly
      priorities,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const ok = importData(importText);
    setImportStatus(ok ? 'success' : 'error');
    if (ok) setImportText('');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const ok = importData(text);
      setImportStatus(ok ? 'success' : 'error');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    resetData();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  const maxCount = Math.max(1, ...stats.days.map((d) => d.count));

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold tracking-tight">{t('profile.title')}</h1>
      </header>

      <div className="flex rounded-[20px] bg-[#151515] p-1 gap-1">
        {(['stats', 'settings'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-[16px] text-sm font-medium transition-colors ${
              section === s ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'text-[#a6a6a6]'
            }`}
          >
            {s === 'stats' ? <BarChart3 size={16} /> : <Settings size={16} />}
            {t(`profile.${s}`)}
          </button>
        ))}
      </div>

      {section === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t('stats.totalCompletions')} value={stats.totalCompletions} />
            <StatCard label={t('stats.bestStreak')} value={stats.bestStreak} suffix={<Flame size={16} className="text-[#FF9F9F]" />} />
            <StatCard label={t('stats.averageStreak')} value={stats.avgStreak} />
            <StatCard label={t('stats.goalProgress')} value={`${stats.goalProgress}%`} />
          </div>

          <div className="rounded-[28px] bg-[#151515] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-semibold mb-4">{t('stats.weekly')}</h3>
            {stats.days.length > 0 && stats.days.some((d) => d.count > 0) ? (
              <div className="flex items-end justify-between gap-2 h-40">
                {stats.days.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full rounded-[12px] bg-[#9B8AFB] transition-all" style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }} />
                    <span className="text-xs text-[#a6a6a6]">{d.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#666666] text-center py-8">{t('stats.noData')}</p>
            )}
          </div>

          <div className="rounded-[28px] bg-[#151515] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-semibold mb-3">{t('today.title')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#a6a6a6]">{t('today.progress')}</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a6a6a6]">{t('stats.eventsToday')}</span>
                <span className="font-medium">{stats.eventsToday}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {section === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="rounded-[28px] bg-[#151515] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5">
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('settings.language')}</h3>
              <div className="flex rounded-[16px] bg-[#0f0f0f] p-1 gap-1">
                {(['en', 'ru'] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => updateSettings({ locale: l })}
                    className={`flex-1 py-2 rounded-[12px] text-sm font-medium transition-colors ${
                      settings.locale === l ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'text-white'
                    }`}
                  >
                    {l === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">{t('settings.weekStartsOn')}</h3>
              <div className="flex rounded-[16px] bg-[#0f0f0f] p-1 gap-1">
                {[1, 0].map((day) => (
                  <button
                    key={day}
                    onClick={() => updateSettings({ weekStartsOn: day as 0 | 1 })}
                    className={`flex-1 py-2 rounded-[12px] text-sm font-medium transition-colors ${
                      settings.weekStartsOn === day ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'text-white'
                    }`}
                  >
                    {day === 1 ? t('settings.monday') : t('settings.sunday')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#151515] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4">
            <h3 className="text-lg font-semibold">{t('settings.export')}</h3>
            <button
              onClick={exportJson}
              className="w-full flex items-center justify-center gap-2 rounded-[20px] bg-[#0f0f0f] py-3 text-sm font-medium active:scale-[0.98] transition-transform"
            >
              <Download size={18} />
              {t('settings.export')}
            </button>
          </div>

          <div className="rounded-[28px] bg-[#151515] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4">
            <h3 className="text-lg font-semibold">{t('settings.import')}</h3>
            <input ref={fileRef} type="file" accept="application/json" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-[20px] bg-[#0f0f0f] py-3 text-sm font-medium active:scale-[0.98] transition-transform"
            >
              <Upload size={18} />
              {t('settings.import')}
            </button>
            <textarea
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportStatus('idle'); }}
              placeholder="{ ... }"
              className="w-full h-24 rounded-[20px] bg-[#0f0f0f] p-3 text-xs font-mono text-white placeholder-[#666] resize-none outline-none focus:ring-2 focus:ring-[#9B8AFB]"
            />
            <button
              onClick={handleImport}
              className="w-full rounded-[20px] bg-[#9B8AFB] text-[#0a0a0a] py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              {t('common.open')}
            </button>
            {importStatus === 'success' && (
              <p className="flex items-center gap-2 text-sm text-[#86D99C]"><Check size={16} /> {t('settings.importSuccess')}</p>
            )}
            {importStatus === 'error' && (
              <p className="flex items-center gap-2 text-sm text-[#FF9F9F]"><X size={16} /> {t('settings.importError')}</p>
            )}
          </div>

          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 rounded-[28px] bg-[#2a1a1a] text-[#FF9F9F] py-4 text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            <Trash2 size={18} />
            {cleared ? t('common.done') : t('settings.clearData')}
          </button>
          {cleared && <p className="text-xs text-center text-[#666666]">{t('settings.clearConfirm')}</p>}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string | number; suffix?: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-[#151515] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <p className="text-xs text-[#a6a6a6] mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {suffix}
      </div>
    </div>
  );
}
