import { useState, useEffect } from 'react';

export interface LiveTime {
  now: Date;
  todayStr: string;           // "YYYY-MM-DD" in LOCAL timezone
  hour: number;
  minute: number;
  second: number;
  greeting: string;
  formattedTime: string;      // "HH:MM"
  formattedTimeFull: string;  // "HH:MM:SS"
  formattedDate: string;      // "Tuesday, March 24, 2026"
}

/** Zero-pad a number to 2 digits */
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Returns local YYYY-MM-DD string (NOT UTC — avoids timezone-off-by-one bugs) */
export function localDateStr(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Returns a live Date that re-renders every `intervalMs` ms.
 * Default: 1000ms (1 second). Use 60000 for minute-level updates.
 * todayStr uses LOCAL timezone so overdue/today comparisons are always correct.
 */
export function useLiveTime(intervalMs = 1000): LiveTime {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const hour   = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const formattedTime     = `${pad(hour)}:${pad(minute)}`;
  const formattedTimeFull = `${pad(hour)}:${pad(minute)}:${pad(second)}`;

  const todayStr = localDateStr(now);

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  });

  return { now, todayStr, hour, minute, second, greeting, formattedTime, formattedTimeFull, formattedDate };
}
