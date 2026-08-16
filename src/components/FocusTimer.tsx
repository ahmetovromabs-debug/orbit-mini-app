import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { t } from '../i18n';

const PRESETS = [15, 25, 45];

function haptic(type: 'light' | 'medium' = 'light') {
  const tg = (window as any).Telegram?.WebApp?.HapticFeedback;
  tg?.impactOccurred?.(type);
}

interface FocusTimerProps {
  taskTitle?: string;
  onClose: () => void;
}

export default function FocusTimer({ taskTitle, onClose }: FocusTimerProps) {
  const [duration, setDuration] = useState(25 * 60);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!running || left <= 0) return;
    const timer = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setCompleted(true);
          haptic('medium');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, left]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const progress = useMemo(() => (duration > 0 ? ((duration - left) / duration) * 100 : 0), [duration, left]);
  const minutes = String(Math.floor(left / 60)).padStart(2, '0');
  const seconds = String(left % 60).padStart(2, '0');

  const setPreset = (min: number) => {
    setDuration(min * 60);
    setLeft(min * 60);
    setRunning(false);
    setCompleted(false);
  };

  const toggle = () => setRunning((r) => !r);
  const stop = () => {
    setRunning(false);
    setLeft(duration);
    setCompleted(false);
  };
  const restart = () => {
    setLeft(duration);
    setCompleted(false);
    setRunning(true);
  };

  const circumference = 2 * Math.PI * 110;
  const dashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#0a0a0a]/95 p-6 backdrop-blur-xl"
    >
      <button
        onClick={onClose}
        aria-label={t('common.close')}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#151515] flex items-center justify-center text-white active:scale-90 transition-transform"
      >
        <X size={22} />
      </button>

      <div className="w-full max-w-sm flex flex-col items-center">
        <p className="text-[#a6a6a6] text-sm uppercase tracking-wide mb-2">{t('focus.title')}</p>
        <h2 className="text-2xl font-semibold text-center mb-8 px-4">
          {taskTitle || t('today.focus')}
        </h2>

        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="110" stroke="#1c1c1c" strokeWidth="12" fill="none" />
            <motion.circle
              cx="120" cy="120" r="110"
              stroke="#9B8AFB"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: circumference, strokeDashoffset: dashoffset }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashoffset }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-3xl font-semibold text-[#86D99C]">{t('focus.complete')}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <span className="text-6xl font-bold tracking-tighter tabular-nums">{minutes}:{seconds}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!completed && (
          <div className="flex items-center gap-3 mb-8">
            {PRESETS.map((min) => (
              <button
                key={min}
                onClick={() => setPreset(min)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  duration === min * 60 ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'bg-[#151515] text-white'
                }`}
              >
                {t('focus.minutes', { count: min })}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {completed ? (
            <button
              onClick={restart}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#86D99C] text-[#0a0a0a] font-semibold active:scale-95 transition-transform"
            >
              <RotateCcw size={20} />
              {t('focus.start')}
            </button>
          ) : (
            <>
              <button
                onClick={toggle}
                className="w-16 h-16 rounded-full bg-[#9B8AFB] text-[#0a0a0a] flex items-center justify-center active:scale-95 transition-transform"
              >
                {running ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>
              <button
                onClick={stop}
                className="w-16 h-16 rounded-full bg-[#151515] text-[#FF9F9F] flex items-center justify-center active:scale-95 transition-transform"
              >
                <Square size={24} />
              </button>
            </>
          )}
        </div>

        {!completed && (
          <p className="mt-6 text-sm text-[#666666]">
            {running ? t('focus.pause') : t('focus.start')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
