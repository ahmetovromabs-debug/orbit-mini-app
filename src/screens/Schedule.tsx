import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAppState } from '../AppState';
import { toISODate, daysInMonth, getContrastText } from '../utils';
import {
  t,
  formatMonthYear,
  formatDayMonth,
  formatWeekdayShort,
  getWeekdayLabels,
  weekStartsOn,
} from '../i18n';
import type { EventItem, ModalType } from '../types';

type CalendarView = 'month' | 'week' | 'day';

interface ScheduleProps {
  onAdd: (type: NonNullable<ModalType>, defaults?: { date?: string; start?: string; end?: string }) => void;
  onMenu: (type: 'event', id: string) => void;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(d: Date, startOn: 0 | 1) {
  const day = d.getDay();
  const diff = (day - startOn + 7) % 7;
  const res = new Date(d);
  res.setDate(d.getDate() - diff);
  return res;
}

function monthOffset(year: number, month: number, startOn: 0 | 1) {
  const first = new Date(year, month, 1).getDay();
  return (first - startOn + 7) % 7;
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

const HOUR_HEIGHT = 56;

function layoutTimedEvents(events: EventItem[]) {
  const timed = events
    .filter((e) => !e.allDay)
    .map((e) => {
      const startMin = toMinutes(e.start);
      let endMin = toMinutes(e.end);
      if (endMin <= startMin) endMin = startMin + 30;
      return { ...e, startMin, endMin };
    })
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  let active: (typeof timed)[number][] = [];
  for (const ev of timed) {
    active = active.filter((a) => a.endMin > ev.startMin);
    const used = new Set(active.map((a) => (a as any).column ?? 0));
    let col = 0;
    while (used.has(col)) col++;
    (ev as any).column = col;
    active.push(ev);
  }

  const totalCols = Math.max(1, ...timed.map((e) => ((e as any).column ?? 0) + 1));

  return timed.map((e) => {
    const col = (e as any).column ?? 0;
    const top = (e.startMin / 60) * HOUR_HEIGHT;
    const height = Math.max(24, ((e.endMin - e.startMin) / 60) * HOUR_HEIGHT);
    const width = 100 / totalCols;
    const left = col * width;
    return { event: e, top, height, left, width };
  });
}

export default function Schedule({ onAdd, onMenu }: ScheduleProps) {
  const { events } = useAppState();
  const startOn = weekStartsOn();
  const weekdayLabels = getWeekdayLabels(startOn);

  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState(new Date());

  const isoCursor = useMemo(() => toISODate(cursor), [cursor]);

  const goPrev = () => {
    const d = new Date(cursor);
    if (view === 'month') {
      d.setDate(1);
      d.setMonth(d.getMonth() - 1);
    } else if (view === 'week') d.setDate(d.getDate() - 7);
    else if (view === 'day') d.setDate(d.getDate() - 1);
    setCursor(d);
  };

  const goNext = () => {
    const d = new Date(cursor);
    if (view === 'month') {
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
    } else if (view === 'week') d.setDate(d.getDate() + 7);
    else if (view === 'day') d.setDate(d.getDate() + 1);
    setCursor(d);
  };

  const goToday = () => setCursor(new Date());

  const openDay = (d: Date) => {
    setCursor(d);
    setView('day');
  };

  const addEvent = (date = isoCursor, start = '09:00', end = '10:00') => {
    onAdd('event', { date, start, end });
  };

  const getEventsForDate = (date: string) =>
    events
      .filter((e) => e.date === date)
      .sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        return a.start.localeCompare(b.start);
      });

  const today = toISODate();

  const headerTitle = () => {
    if (view === 'month') return formatMonthYear(cursor);
    if (view === 'week') {
      const start = startOfWeek(cursor, startOn);
      const end = addDays(start, 6);
      return `${formatDayMonth(start)} – ${formatDayMonth(end)}`;
    }
    return formatDayMonth(cursor);
  };

  const MonthView = () => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const offset = monthOffset(year, month, startOn);
    const total = daysInMonth(year, month);
    const cells: (Date | null)[] = Array(offset)
      .fill(null)
      .concat(Array.from({ length: total }, (_, i) => new Date(year, month, i + 1)));
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
      <div className="rounded-[28px] bg-[#151515] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {weekdayLabels.map((label, i) => (
            <div key={i} className="text-xs text-[#666666] font-medium uppercase">
              {label}
            </div>
          ))}
          {weeks.flat().map((cell, i) => {
            const dateStr = cell ? toISODate(cell) : '';
            const isToday = dateStr === today;
            const isSelected = dateStr === isoCursor;
            const dayEvents = cell ? getEventsForDate(dateStr) : [];
            return (
              <button
                key={i}
                disabled={!cell}
                onClick={() => cell && openDay(cell)}
                className={`flex flex-col items-center justify-center h-14 rounded-[16px] text-base font-medium transition-colors ${
                  cell === null
                    ? 'text-[#333333]'
                    : isSelected
                      ? 'bg-[#9B8AFB] text-[#0a0a0a]'
                      : isToday
                        ? 'bg-[#1c1c1c] text-[#9B8AFB]'
                        : 'text-white hover:bg-[#1c1c1c]'
                }`}
              >
                {cell && (
                  <>
                    <span>{cell.getDate()}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span key={e.id} className="w-1 h-1 rounded-full" style={{ backgroundColor: e.color }} />
                      ))}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const start = startOfWeek(cursor, startOn);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="space-y-3">
        {weekDays.map((d) => {
          const dateStr = toISODate(d);
          const isToday = dateStr === today;
          const list = getEventsForDate(dateStr);
          return (
            <button
              key={dateStr}
              onClick={() => openDay(d)}
              className="w-full text-left rounded-[22px] bg-[#151515] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-base font-semibold ${isToday ? 'text-[#9B8AFB]' : 'text-white'}`}>
                  {formatWeekdayShort(d)}, {d.getDate()}
                </span>
                {isToday && <span className="text-xs bg-[#9B8AFB] text-[#0a0a0a] px-2 py-0.5 rounded-full">{t('schedule.today')}</span>}
              </div>
              <div className="space-y-2">
                {list.length === 0 && <p className="text-sm text-[#666666]">{t('schedule.noEvents')}</p>}
                {list.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <span className="text-[#a6a6a6] w-12 shrink-0">{event.allDay ? t('schedule.allDay') : formatTime(event.start)}</span>
                    <span className="truncate text-white">{event.title}</span>
                  </div>
                ))}
                {list.length > 4 && <p className="text-xs text-[#666666]">+{list.length - 4}</p>}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const DayView = () => {
    const date = isoCursor;
    const list = getEventsForDate(date);
    const allDay = list.filter((e) => e.allDay);
    const timed = list.filter((e) => !e.allDay);
    const layout = useMemo(() => layoutTimedEvents(timed), [timed]);
    const isToday = date === today;

    const [now, setNow] = useState(new Date());
    useEffect(() => {
      if (!isToday) return;
      const timer = setInterval(() => setNow(new Date()), 60_000);
      return () => clearInterval(timer);
    }, [isToday]);
    const nowMin = isToday ? now.getHours() * 60 + now.getMinutes() : -1;

    const addAtHour = (hour: number) => {
      const start = `${String(hour).padStart(2, '0')}:00`;
      const end = hour === 23 ? '23:59' : `${String(hour + 1).padStart(2, '0')}:00`;
      addEvent(date, start, end);
    };

    return (
      <div className="space-y-3">
        {allDay.length > 0 && (
          <div className="rounded-[22px] bg-[#151515] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <p className="text-xs text-[#a6a6a6] uppercase tracking-wide mb-2">{t('schedule.allDay')}</p>
            <div className="flex flex-wrap gap-2">
              {allDay.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onMenu('event', event.id)}
                  className="rounded-full px-3.5 py-2 text-sm font-medium"
                  style={{ backgroundColor: event.color, color: getContrastText(event.color) }}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[28px] bg-[#151515] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {list.length === 0 && allDay.length === 0 && (
            <p className="text-sm text-[#666666] text-center py-4">{t('schedule.dayHint')}</p>
          )}
          <div className="relative" style={{ height: 24 * HOUR_HEIGHT }}>
            {Array.from({ length: 24 }, (_, h) => (
              <button
                key={h}
                onClick={() => addAtHour(h)}
                className="absolute left-0 right-0 text-left hover:bg-white/5 transition-colors"
                style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              >
                <span className="absolute left-1 -top-2 text-[10px] text-[#666666]">
                  {String(h).padStart(2, '0')}:00
                </span>
                <div className="absolute top-0 left-10 right-0 border-b border-[#242424]" />
              </button>
            ))}

            <div className="absolute inset-y-0 left-10 right-0 pointer-events-none">
              {nowMin >= 0 && (
                <div
                  className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                  style={{ top: (nowMin / 60) * HOUR_HEIGHT }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#FF9F9F] -ml-1" />
                  <div className="flex-1 h-px bg-[#FF9F9F]" />
                </div>
              )}

              {layout.map(({ event, top, height, left, width }) => (
                <button
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenu('event', event.id);
                  }}
                  className="absolute z-10 rounded-[14px] px-2.5 py-1.5 text-left text-xs font-semibold shadow-sm overflow-hidden pointer-events-auto"
                  style={{
                    top,
                    height,
                    left: `${left}%`,
                    width: `calc(${width}% - 8px)`,
                    backgroundColor: event.color,
                    color: getContrastText(event.color),
                  }}
                >
                  <span className="block truncate">{event.title}</span>
                  <span className="block opacity-80 text-[10px]">{formatTime(event.start)} – {formatTime(event.end)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight truncate">{t('schedule.title')}</h1>
          <p className="text-[#a6a6a6] text-sm truncate">{headerTitle()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={goToday} className="text-xs text-[#9B8AFB] font-medium px-2 py-1 rounded-full bg-[#151515]">
            {t('schedule.today')}
          </button>
          <button
            onClick={() => addEvent(isoCursor)}
            aria-label={t('common.add')}
            className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-white transition-transform active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center text-white">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex rounded-[20px] bg-[#151515] p-1 gap-1">
          {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-[16px] text-sm font-medium transition-colors ${
                view === v ? 'bg-[#9B8AFB] text-[#0a0a0a]' : 'text-[#a6a6a6]'
              }`}
            >
              {t(`schedule.${v}`)}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' && <MonthView />}
      {view === 'week' && <WeekView />}
      {view === 'day' && <DayView />}
    </div>
  );
}
