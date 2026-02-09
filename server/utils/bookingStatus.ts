import type { ItemStatus } from '~/server/utils/supabase';

const SESSION_DURATION_MIN = 90;
const TIMEZONE = 'Europe/Paris';

type DisplayStatus = ItemStatus | 'in_progress' | 'expired';

function getNowInTimezone(): Date {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const get = (type: string) =>
    parseInt(parts.find(p => p.type === type)?.value || '0', 10);

  return new Date(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
}

/**
 * Compute real-time status based on scheduled date/time.
 * Example: scheduled -> in_progress -> completed
 */
export function computeRealtimeStatus(
  dbStatus: string,
  scheduledDate?: string,
  scheduledTime?: string,
): DisplayStatus {
  if (dbStatus !== 'active' && dbStatus !== 'in_progress') {
    return dbStatus as DisplayStatus;
  }

  if (!scheduledDate) {
    return dbStatus as DisplayStatus;
  }

  const now = getNowInTimezone();

  let hours = 0;
  let minutes = 0;
  if (scheduledTime) {
    const match = scheduledTime.match(/^(\d{1,2})h(\d{2})$/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
    }
  }

  const dateOnly = scheduledDate.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  const sessionStart = new Date(year, month - 1, day, hours, minutes);
  const sessionEnd = new Date(
    sessionStart.getTime() + SESSION_DURATION_MIN * 60 * 1000,
  );

  if (now >= sessionEnd) return 'completed';
  if (now >= sessionStart) return 'in_progress';
  return 'active';
}
