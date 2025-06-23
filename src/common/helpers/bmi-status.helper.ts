import { BMIStatus } from '@prisma/client';

export const bmiStatusMap: Record<BMIStatus, string> = {
  MALNUTRITION: 'Malnutrisi',
  UNDERNUTRITION: 'Gizi Kurang',
  NORMAL: 'Normal',
  OVERWEIGHT: 'Kelebihan Berat Badan',
  OBESITY: 'Obesitas',
};

export function translateBMI(status?: BMIStatus): string {
  if (!status) return '-';
  return bmiStatusMap[status] || '-';
}
