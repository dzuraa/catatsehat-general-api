export function formatMonthAge(month?: number | null): string {
  if (month === null || month === undefined) return '-';
  return `${month} Bulan`;
}
