export type Tab = 'today' | 'goals' | 'habits' | 'schedule';

export interface Priority {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  target: string;
  progress: number;
  deadline: string;
  color: string;
  icon: string;
  count: number;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  streak: number;
  done: boolean;
  history: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  allDay: boolean;
  type: 'focus' | 'meeting' | 'routine' | 'rest';
  color: string;
}

export interface AppState {
  version: number;
  goals: Goal[];
  habits: Habit[];
  events: EventItem[];
  focus: string;
  priorities: Priority[];
}

export type ModalType = 'goal' | 'habit' | 'event' | 'priority' | null;

export interface ModalState {
  type: ModalType;
  id?: string | null;
  defaults?: Partial<Goal> | Partial<Habit> | Partial<EventItem> | Partial<Priority>;
}
