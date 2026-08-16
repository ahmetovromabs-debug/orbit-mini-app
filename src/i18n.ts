export type Locale = 'ru' | 'en';

const STORAGE_KEY = 'orbit:locale';

const translations = {
  en: {
    'app.title': 'Orbit',

    'tab.today': 'Today',
    'tab.goals': 'Goals',
    'tab.habits': 'Habits',
    'tab.schedule': 'Schedule',
    'tab.profile': 'Profile',

    'today.title': 'Today',
    'today.focus': 'Focus',
    'today.priorities': 'Priorities',
    'today.habits': 'Habits',
    'today.schedule': 'Schedule',
    'today.progress': 'progress',
    'today.done': '{{done}}/{{total}} done',
    'today.noEvents': 'No events scheduled',
    'today.noPriorities': 'No priorities yet',
    'today.noHabits': 'No habits yet',
    'today.emptyFocus': 'Set your focus in Goals',
    'today.startFocus': 'Start focus',

    'goals.title': 'Goals',
    'goals.subtitle': 'Big moves, small steps.',
    'goals.empty': 'No goals yet',

    'habits.title': 'Habits',
    'habits.subtitle': 'Daily small steps.',
    'habits.empty': 'No habits yet',
    'habits.streak': '{{count}} day streak|{{count}} day streak|{{count}} day streak',

    'schedule.title': 'Schedule',
    'schedule.month': 'Month',
    'schedule.week': 'Week',
    'schedule.day': 'Day',
    'schedule.today': 'Today',
    'schedule.noEvents': 'No events',
    'schedule.noEventsHint': 'Tap + or a time slot to add one',
    'schedule.dayHint': 'Tap a time slot to add an event',
    'schedule.allDay': 'All day',

    'profile.title': 'Profile',
    'profile.stats': 'Stats',
    'profile.settings': 'Settings',

    'stats.title': 'Stats',
    'stats.weekly': 'Weekly completion',
    'stats.totalCompletions': 'Total completions',
    'stats.bestStreak': 'Best streak',
    'stats.averageStreak': 'Average streak',
    'stats.goalProgress': 'Goal progress',
    'stats.eventsToday': 'Events today',
    'stats.noData': 'No data yet',

    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.weekStartsOn': 'Week starts on',
    'settings.monday': 'Monday',
    'settings.sunday': 'Sunday',
    'settings.clearData': 'Clear all data',
    'settings.clearConfirm': 'Are you sure? This cannot be undone.',
    'settings.export': 'Export data',
    'settings.import': 'Import data',
    'settings.importSuccess': 'Data imported successfully',
    'settings.importError': 'Invalid data format',

    'focus.title': 'Focus',
    'focus.start': 'Start focus',
    'focus.minutes': '{{count}} min',
    'focus.pause': 'Pause',
    'focus.resume': 'Resume',
    'focus.stop': 'Stop',
    'focus.complete': 'Focus complete!',

    'subtask.add': 'Add subtask',
    'subtask.placeholder': 'Subtask',

    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.create': 'Create',
    'common.close': 'Close',
    'common.empty': 'Nothing here yet',
    'common.markDone': 'Mark done',
    'common.markUndone': 'Mark not done',
    'common.done': 'Done',
    'common.open': 'Open',

    'actionSheet.title': 'Actions',

    'form.newGoal': 'New goal',
    'form.editGoal': 'Edit goal',
    'form.newHabit': 'New habit',
    'form.editHabit': 'Edit habit',
    'form.newEvent': 'New event',
    'form.editEvent': 'Edit event',
    'form.newPriority': 'New priority',
    'form.editPriority': 'Edit priority',
    'form.title': 'Title',
    'form.titlePlaceholder': 'What needs to be done?',

    'goal.title': 'Goal title',
    'goal.target': 'Target',
    'goal.targetPlaceholder': 'e.g. 100 hours',
    'goal.deadline': 'Deadline',
    'goal.progress': 'Progress {{progress}}%',
    'goal.category': 'Category',

    'habit.title': 'Habit title',

    'event.title': 'Event title',
    'event.date': 'Date',
    'event.start': 'Start',
    'event.end': 'End',
    'event.type': 'Type',
    'event.allDay': 'All day',

    'color.label': 'Color',
    'icon.label': 'Icon',

    'category.Personal': 'Personal',
    'category.Health': 'Health',
    'category.Career': 'Career',
    'category.Finance': 'Finance',
    'category.Learning': 'Learning',
    'category.Relationships': 'Relationships',
    'category.Creative': 'Creative',

    'eventType.focus': 'Focus',
    'eventType.meeting': 'Meeting',
    'eventType.routine': 'Routine',
    'eventType.rest': 'Rest',
  },
  ru: {
    'app.title': 'Orbit',

    'tab.today': 'Сегодня',
    'tab.goals': 'Цели',
    'tab.habits': 'Привычки',
    'tab.schedule': 'Календарь',
    'tab.profile': 'Профиль',

    'today.title': 'Сегодня',
    'today.focus': 'Фокус',
    'today.priorities': 'Приоритеты',
    'today.habits': 'Привычки',
    'today.schedule': 'Расписание',
    'today.progress': 'прогресс',
    'today.done': '{{done}}/{{total}} выполнено',
    'today.noEvents': 'Нет событий',
    'today.noPriorities': 'Пока нет приоритетов',
    'today.noHabits': 'Пока нет привычек',
    'today.emptyFocus': 'Выберите фокус в Целях',
    'today.startFocus': 'Начать фокус',

    'goals.title': 'Цели',
    'goals.subtitle': 'Большие цели, маленькие шаги.',
    'goals.empty': 'Пока нет целей',

    'habits.title': 'Привычки',
    'habits.subtitle': 'Ежедневные маленькие шаги.',
    'habits.empty': 'Пока нет привычек',
    'habits.streak': '{{count}} день подряд|{{count}} дня подряд|{{count}} дней подряд',

    'schedule.title': 'Календарь',
    'schedule.month': 'Месяц',
    'schedule.week': 'Неделя',
    'schedule.day': 'День',
    'schedule.today': 'Сегодня',
    'schedule.noEvents': 'Нет событий',
    'schedule.noEventsHint': 'Нажмите + или слот, чтобы добавить',
    'schedule.dayHint': 'Нажмите на слот, чтобы добавить событие',
    'schedule.allDay': 'Весь день',

    'profile.title': 'Профиль',
    'profile.stats': 'Статистика',
    'profile.settings': 'Настройки',

    'stats.title': 'Статистика',
    'stats.weekly': 'Выполнение за неделю',
    'stats.totalCompletions': 'Всего выполнено',
    'stats.bestStreak': 'Лучшая серия',
    'stats.averageStreak': 'Средняя серия',
    'stats.goalProgress': 'Прогресс целей',
    'stats.eventsToday': 'Событий сегодня',
    'stats.noData': 'Пока нет данных',

    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.weekStartsOn': 'Начало недели',
    'settings.monday': 'Понедельник',
    'settings.sunday': 'Воскресенье',
    'settings.clearData': 'Очистить все данные',
    'settings.clearConfirm': 'Вы уверены? Действие нельзя отменить.',
    'settings.export': 'Экспорт данных',
    'settings.import': 'Импорт данных',
    'settings.importSuccess': 'Данные успешно импортированы',
    'settings.importError': 'Некорректный формат данных',

    'focus.title': 'Фокус',
    'focus.start': 'Начать фокус',
    'focus.minutes': '{{count}} мин',
    'focus.pause': 'Пауза',
    'focus.resume': 'Продолжить',
    'focus.stop': 'Стоп',
    'focus.complete': 'Фокус завершён!',

    'subtask.add': 'Добавить подзадачу',
    'subtask.placeholder': 'Подзадача',

    'common.add': 'Добавить',
    'common.edit': 'Изменить',
    'common.delete': 'Удалить',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.create': 'Создать',
    'common.close': 'Закрыть',
    'common.empty': 'Пока пусто',
    'common.markDone': 'Отметить выполненным',
    'common.markUndone': 'Отметить невыполненным',
    'common.done': 'Готово',
    'common.open': 'Открыть',

    'actionSheet.title': 'Действия',

    'form.newGoal': 'Новая цель',
    'form.editGoal': 'Изменить цель',
    'form.newHabit': 'Новая привычка',
    'form.editHabit': 'Изменить привычку',
    'form.newEvent': 'Новое событие',
    'form.editEvent': 'Изменить событие',
    'form.newPriority': 'Новый приоритет',
    'form.editPriority': 'Изменить приоритет',
    'form.title': 'Название',
    'form.titlePlaceholder': 'Что нужно сделать?',

    'goal.title': 'Название цели',
    'goal.target': 'Цель',
    'goal.targetPlaceholder': 'например, 100 часов',
    'goal.deadline': 'Дедлайн',
    'goal.progress': 'Прогресс {{progress}}%',
    'goal.category': 'Категория',

    'habit.title': 'Название привычки',

    'event.title': 'Название события',
    'event.date': 'Дата',
    'event.start': 'Начало',
    'event.end': 'Конец',
    'event.type': 'Тип',
    'event.allDay': 'Весь день',

    'color.label': 'Цвет',
    'icon.label': 'Иконка',

    'category.Personal': 'Личное',
    'category.Health': 'Здоровье',
    'category.Career': 'Карьера',
    'category.Finance': 'Финансы',
    'category.Learning': 'Обучение',
    'category.Relationships': 'Отношения',
    'category.Creative': 'Творчество',

    'eventType.focus': 'Фокус',
    'eventType.meeting': 'Встреча',
    'eventType.routine': 'Рутина',
    'eventType.rest': 'Отдых',
  },
} as const;

type TransKey = keyof (typeof translations)['en'];

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && (saved === 'en' || saved === 'ru')) return saved;

  const tg = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tg) {
    const code = String(tg).toLowerCase();
    if (code.startsWith('ru') || code.startsWith('uk') || code.startsWith('be')) return 'ru';
    return 'en';
  }
  const nav = navigator.language || 'en';
  if (nav.toLowerCase().startsWith('ru') || nav.toLowerCase().startsWith('uk') || nav.toLowerCase().startsWith('be')) return 'ru';
  return 'en';
}

let currentLocale: Locale = detectLocale();

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

function pickPluralForm(value: number, forms: string[]): string {
  const n = Math.abs(value) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2] ?? forms[1] ?? forms[0];
  if (n1 > 1 && n1 < 5) return forms[1] ?? forms[0];
  if (n1 === 1) return forms[0];
  return forms[2] ?? forms[1] ?? forms[0];
}

export function t(key: TransKey, vars?: Record<string, string | number>): string {
  const dict = translations[currentLocale] || translations.en;
  let text = (dict[key as keyof typeof dict] as string | undefined) ?? translations.en[key as keyof (typeof translations)['en']] ?? key;

  if (typeof text === 'string' && vars) {
    for (const [k, v] of Object.entries(vars)) {
      const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
      text = text.replace(regex, String(v));
    }

    if (typeof vars.count === 'number' && text.includes('|')) {
      const forms = text.split('|');
      text = pickPluralForm(vars.count, forms);
    }
  }

  return text;
}

export function formatDateLong(d = new Date()) {
  return new Intl.DateTimeFormat(currentLocale, { weekday: 'long', month: 'short', day: 'numeric' }).format(d);
}

export function formatMonthYear(d: Date) {
  return new Intl.DateTimeFormat(currentLocale, { month: 'long', year: 'numeric' }).format(d);
}

export function formatWeekdayShort(d: Date) {
  return new Intl.DateTimeFormat(currentLocale, { weekday: 'narrow' }).format(d);
}

export function formatDayMonth(d: Date) {
  return new Intl.DateTimeFormat(currentLocale, { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
}

export function weekStartsOn(): 0 | 1 {
  return currentLocale === 'ru' ? 1 : 0;
}

export function getWeekdayLabels(startOn: 0 | 1 = 1): string[] {
  const base = new Date(2024, 0, 1); // known Monday
  if (startOn === 0) base.setDate(base.getDate() + 6); // Sunday
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    labels.push(formatWeekdayShort(d));
  }
  return labels;
}
