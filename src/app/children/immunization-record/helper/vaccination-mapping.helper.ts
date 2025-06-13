export const VaccineNameMapping = {
  'Hepatitis B (<24 Jam)': 'hepatitisB',
  BCG: 'BCG',
  'Polio Tetes 1': 'polioTetes1',
  'Polio Tetes 2': 'polioTetes2',
  'Polio Tetes 3': 'polioTetes3',
  'Polio Tetes 4': 'polioTetes4',
  'DPT-HB-Hib 1': 'DPT_HB_Hib1',
  'DPT-HB-Hib 2': 'DPT_HB_Hib2',
  'DPT-HB-Hib 3': 'DPT_HB_Hib3',
  'DPT-HB-Hib Lanjutan': 'DPT_HB_Hib_Lanjutan',
  'Rota Virus (RV) 1': 'RV_1',
  'Rota Virus (RV) 2': 'RV_2',
  'Rota Virus (RV) 3': 'RV_3',
  'PCV 1': 'PCV_1',
  'PCV 2': 'PCV_2',
  'PCV 3': 'PCV_3',
  'Polio Suntik (IPV) 1': 'IPV_1',
  'Polio Suntik (IPV) 2': 'IPV_2',
  'Campak -Rubella (MR)': 'MR',
  'Campak -Rubella (MR) Lanjutan': 'MR_Lanjutan',
  'Japanese Encephalitis (JE)': 'JE',
} as const;

// Helper function untuk mengkonversi string bulan ke angka
export function parseAgeToMonths(suggestedAge: string): number {
  if (suggestedAge.includes('Jam')) return 0;

  const match = suggestedAge.match(/(\d+)/);
  if (!match) return 0;

  return parseInt(match[1]);
}
