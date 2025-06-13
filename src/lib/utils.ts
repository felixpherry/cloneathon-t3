import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(start: number, end?: number, step: number = 1) {
  if (!end) {
    end = start;
    start = 0;
  }

  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}
