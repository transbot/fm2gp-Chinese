import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ensure large numbers are formatted beautifully
export function formatBigInt(num: bigint | number): string {
  if (typeof num === 'number') {
    return new Intl.NumberFormat('en-US').format(num);
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
