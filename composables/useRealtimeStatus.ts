import { ref, onMounted, onUnmounted } from 'vue';

const SESSION_DURATION_MIN = 90;

export function computeClientStatus(
  dbStatus: string,
  scheduledDate?: string,
  scheduledTime?: string,
): string {
  if (dbStatus !== 'scheduled' && dbStatus !== 'in_progress') {
    return dbStatus;
  }

  if (!scheduledDate) return dbStatus;

  const now = new Date();

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

  if (now >= sessionEnd) return 'processing';
  if (now >= sessionStart) return 'in_progress';
  return 'scheduled';
}

export function useRealtimeStatus(
  reservations: Ref<Array<{
    status: string;
    scheduledDate?: string;
    scheduledTime?: string;
  }>>,
) {
  let interval: ReturnType<typeof setInterval> | null = null;

  const updateStatuses = () => {
    for (const r of reservations.value) {
      const newStatus = computeClientStatus(
        r.status,
        r.scheduledDate,
        r.scheduledTime,
      );
      if (newStatus !== r.status) {
        r.status = newStatus;
      }
    }
  };

  onMounted(() => {
    interval = setInterval(updateStatuses, 60_000);
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  return { updateStatuses };
}
