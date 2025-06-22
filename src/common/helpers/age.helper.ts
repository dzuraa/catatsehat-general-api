import { DateTime } from 'luxon';

export function calculateAge(
  birthDate: string,
  currentDate: string = DateTime.now().toISO(),
): number {
  if (!birthDate) return 0;
  const birthDateTime = DateTime.fromISO(birthDate);
  const currentDateTime = DateTime.fromISO(currentDate);
  const diffInYears = currentDateTime.diff(birthDateTime, 'years').years;
  return Math.floor(diffInYears);
}
