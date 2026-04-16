import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conflict-free Tailwind class merging.
 *
 * Usage:
 *   cn('px-2 py-1 bg-red-500', condition && 'bg-blue-500')
 *   // → 'px-2 py-1 bg-blue-500'  (bg-red-500 is correctly overridden)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
