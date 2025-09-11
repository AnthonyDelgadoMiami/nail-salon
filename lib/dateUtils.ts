// lib/dateUtils.ts
export function toUTCDate(date: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ));
}

export function isSameUTCDate(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // Start of today
  
  const end = new Date();
  end.setDate(start.getDate() + days);
  end.setHours(23, 59, 59, 999); // End of the target day
  
  return { start, end };
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}