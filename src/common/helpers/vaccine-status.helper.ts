export function translateStatus(status?: number | null): string {
  switch (status) {
    case 0:
      return 'Tidak Diperbolehkan'; // FORBIDDEN
    case 1:
      return 'Tepat Waktu'; // ON_TIME
    case 2:
      return 'Terlambat'; // LATE
    case 3:
      return 'Sangat Terlambat'; // URGENT
    default:
      return '-';
  }
}
