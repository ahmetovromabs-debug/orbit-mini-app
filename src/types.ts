export type Locale = 'ru' | 'en';

export type Tab = 'today' | 'goals' | 'habits' | 'schedule' | 'profile';

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Priority {
  id: string;
  title: string;
  done: boolean;
  subTasks: SubTask[];
}

export interface Goal {
  id: string;
  title: string;
  category: Category;
  target: string;
  progress: number;
  deadline: string;
  color: string;
  icon: string;
}

export type Category = 'Personal' | 'Health' | 'Career' | 'Finance' | 'Learning' | 'Relationships' | 'Creative';
export type EventType = 'focus' | 'meeting' | 'routine' | 'rest';

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

export interface Settings {
  locale: Locale;
  weekStartsOn: 0 | 1;
}

export interface AppState {
  version: number;
  goals: Goal[];
  habits: Habit[];
  events: EventItem[];
  focus: string;
  priorities: Priority[];
  settings: Settings;
}

export type ModalType = 'goal' | 'habit' | 'event' | 'priority' | null;

export interface ModalState {
  type: ModalType;
  id?: string | null;
  defaults?: Partial<Goal> | Partial<Habit> | Partial<EventItem> | Partial<Priority>;
}
