import {
  Target,
  Flame,
  Droplets,
  BookOpen,
  Brain,
  Zap,
  Moon,
  Leaf,
  Dumbbell,
  Briefcase,
  Plane,
  Home,
  Music,
  PenTool,
  Heart,
  Star,
  Sun,
  Coffee,
  Trophy,
  Compass,
} from 'lucide-react';
import type { ReactNode } from 'react';

export function toISODate(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export const PALETTE = [
  '#9B8AFB',
  '#86D99C',
  '#F2C94C',
  '#8CC8FF',
  '#FF9F9F',
  '#BFA886',
  '#E2A8FF',
  '#666666',
  '#5B21B6',
  '#0BCE83',
];

export const ICONS: Record<string, ReactNode> = {
  spark: <Flame size={22} />,
  target: <Target size={22} />,
  water: <Droplets size={22} />,
  book: <BookOpen size={22} />,
  brain: <Brain size={22} />,
  zap: <Zap size={22} />,
  moon: <Moon size={22} />,
  leaf: <Leaf size={22} />,
  dumbbell: <Dumbbell size={22} />,
  work: <Briefcase size={22} />,
  travel: <Plane size={22} />,
  home: <Home size={22} />,
  music: <Music size={22} />,
  pen: <PenTool size={22} />,
  heart: <Heart size={22} />,
  star: <Star size={22} />,
  sun: <Sun size={22} />,
  coffee: <Coffee size={22} />,
  trophy: <Trophy size={22} />,
  compass: <Compass size={22} />,
};

export function renderIcon(name: string): ReactNode {
  return ICONS[name] || <Target size={22} />;
}

export function getContrastText(color: string): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0a0a0a' : '#ffffff';
}
