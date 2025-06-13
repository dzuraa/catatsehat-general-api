import { ChildVaccineStage } from '@prisma/client';
// Update the enums to use integers
enum ImmunizationStatus {
  NOT_DONE = 0,
  ONGOING = 1,
  DONE = 2,
}

enum VaccineStatus {
  FORBIDDEN = 0, // Cannot be given at this age
  ON_TIME = 1, // Given at the right time
  LATE = 2, // Given later than recommended
  URGENT = 3, // Critically late
}

interface AgeValidationResult {
  isValid: boolean;
  monthValue: number;
  isRange?: boolean;
  rangeStart?: number;
  rangeEnd?: number;
  errorMessage?: string;
}

export class AgeValidator {
  public static validateAndParseAge(
    dateGiven: string | number,
  ): AgeValidationResult {
    // Handle number input
    if (typeof dateGiven === 'number') {
      if (!Number.isInteger(dateGiven) || dateGiven < 0) {
        return {
          isValid: false,
          monthValue: -1,
          errorMessage: 'Usia harus berupa angka bulat positif',
        };
      }
      return {
        isValid: true,
        monthValue: dateGiven,
      };
    }

    const normalizedAge = dateGiven.trim().toLowerCase();

    // Case 1: "Dibawah 24 Jam"
    if (normalizedAge.includes('24 jam')) {
      return {
        isValid: true,
        monthValue: 0,
      };
    }

    // Case 2: "0 - 1 Bulan"
    if (normalizedAge.match(/^[0-9]\s*-\s*[0-9]+\s*bulan$/)) {
      const numbers = normalizedAge.match(/\d+/g);
      if (numbers && numbers.length === 2) {
        const start = parseInt(numbers[0]);
        const end = parseInt(numbers[1]);
        return {
          isValid: true,
          monthValue: -1, // This will be determined by actual dateGiven
          isRange: true,
          rangeStart: start,
          rangeEnd: end,
        };
      }
    }

    // Case 3: "X Bulan" (where X is any number)
    const singleMonthMatch = normalizedAge.match(/^(\d+)\s*bulan$/);
    if (singleMonthMatch) {
      const months = parseInt(singleMonthMatch[1]);
      return {
        isValid: true,
        monthValue: months,
      };
    }

    return {
      isValid: false,
      monthValue: -1,
      errorMessage:
        'Format usia tidak valid. Format yang diterima: "Dibawah 24 Jam", "0 - 1 Bulan", atau "X Bulan"',
    };
  }
}

export class VaccinationStatusHelper {
  // Convert to static class for easier access
  public static readonly vaccineAgeRules = {
    hepatitisB: (dateGiven: number): number =>
      dateGiven === 0 ? VaccineStatus.ON_TIME : VaccineStatus.FORBIDDEN,

    BCG: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 1) return VaccineStatus.ON_TIME;
      if (dateGiven >= 2 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.FORBIDDEN;
    },

    // ... other existing rules remain the same but return numbers instead of enum values
    polioTetes1: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 1) return VaccineStatus.ON_TIME;
      if (dateGiven >= 2 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    polioTetes2: (dateGiven: number): number => {
      if (dateGiven === 0 || dateGiven === 1) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 2) return VaccineStatus.ON_TIME;
      if (dateGiven >= 3 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    polioTetes3: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 2) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 3) return VaccineStatus.ON_TIME;
      if (dateGiven >= 4 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    polioTetes4: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 3) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 4) return VaccineStatus.ON_TIME;
      if (dateGiven >= 5 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    DPT_HB_Hib1: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 1) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 2) return VaccineStatus.ON_TIME;
      if (dateGiven >= 3 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    DPT_HB_Hib2: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 2) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 3) return VaccineStatus.ON_TIME;
      if (dateGiven >= 4 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    DPT_HB_Hib3: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 3) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 4) return VaccineStatus.ON_TIME;
      if (dateGiven >= 5 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    DPT_HB_Hib_Lanjutan: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 12) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 2) return VaccineStatus.ON_TIME;
      if (dateGiven === 23) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    RV_1: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 1) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 2) return VaccineStatus.ON_TIME;
      if (dateGiven >= 3 && dateGiven <= 6) return VaccineStatus.LATE;
      return VaccineStatus.FORBIDDEN;
    },

    RV_2: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 2) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 3) return VaccineStatus.ON_TIME;
      if (dateGiven >= 4 && dateGiven <= 6) return VaccineStatus.LATE;
      return VaccineStatus.FORBIDDEN;
    },

    RV_3: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 3) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 4) return VaccineStatus.ON_TIME;
      if (dateGiven >= 5 && dateGiven <= 6) return VaccineStatus.LATE;
      return VaccineStatus.FORBIDDEN;
    },

    PCV_1: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 1) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 2) return VaccineStatus.ON_TIME;
      if (dateGiven >= 3 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    PCV_2: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 2) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 3) return VaccineStatus.ON_TIME;
      if (dateGiven >= 4 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    PCV_3: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 11) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 12) return VaccineStatus.ON_TIME;
      if (dateGiven === 18 || dateGiven === 23) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    IPV_1: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 3) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 4) return VaccineStatus.ON_TIME;
      if (dateGiven >= 5 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    IPV_2: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 8) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 9) return VaccineStatus.ON_TIME;
      if (dateGiven >= 10 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    MR: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 8) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 9) return VaccineStatus.ON_TIME;
      if (dateGiven >= 10 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    MR_Lanjutan: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 12) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 9) return VaccineStatus.ON_TIME;
      if (dateGiven >= 10 && dateGiven <= 11) return VaccineStatus.LATE;
      return VaccineStatus.URGENT;
    },

    JE: (dateGiven: number): number => {
      if (dateGiven >= 0 && dateGiven <= 9) return VaccineStatus.FORBIDDEN;
      if (dateGiven === 10) return VaccineStatus.ON_TIME;
      return VaccineStatus.URGENT;
    },
  };

  public static calculateVaccineStatus(
    dateGiven: number,
    vaccineName: string,
  ): number {
    const validationResult = AgeValidator.validateAndParseAge(dateGiven);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    const ruleFunction = this.vaccineAgeRules[vaccineName];
    if (!ruleFunction) {
      throw new Error(`No rule found for vaccine: ${vaccineName}`);
    }

    return ruleFunction(validationResult.monthValue);
  }

  public static determineVaccine(stages: ChildVaccineStage[]) {
    let lastVaccineGiven: string | null = null;
    let upcomingVaccine: string | null = null;

    // Urutkan berdasarkan tanggal pemberian vaksin (dateGiven)
    const sortedStages = stages.sort((a, b) => {
      if (a.dateGiven && b.dateGiven) {
        return (
          new Date(a.dateGiven).getTime() - new Date(b.dateGiven).getTime()
        );
      }
      return 0;
    });

    // Cari vaksin terakhir yang sudah diberikan
    for (const stage of sortedStages) {
      if (
        stage.vaccineStatus === VaccineStatus.ON_TIME ||
        stage.vaccineStatus === VaccineStatus.LATE
      ) {
        lastVaccineGiven = stage.name; // Simpan nama vaksin
      }
    }

    // Cari vaksin berikutnya yang belum diberikan
    for (const stage of sortedStages) {
      if (
        stage.vaccineStatus === VaccineStatus.FORBIDDEN ||
        stage.vaccineStatus === null
      ) {
        upcomingVaccine = stage.name; // Simpan nama vaksin
        break; // Ambil hanya satu vaksin berikutnya
      }
    }

    return { lastVaccineGiven, upcomingVaccine };
  }

  public static determineImmunizationStatus(
    stages: ChildVaccineStage[],
  ): number {
    const hasAllStatus = stages.every(
      (stage) =>
        stage.vaccineStatus !== null && stage.vaccineStatus !== undefined,
    );
    const hasNoStatus = stages.every(
      (stage) =>
        stage.vaccineStatus === null || stage.vaccineStatus === undefined,
    );

    if (hasAllStatus) {
      return ImmunizationStatus.DONE; // 2
    }
    if (hasNoStatus) {
      return ImmunizationStatus.NOT_DONE; // 0
    }

    return ImmunizationStatus.ONGOING; // 1
  }

  public static getVaccineStatusText(status: number): string {
    const statusMap = {
      [VaccineStatus.FORBIDDEN]: 'Tidak Boleh',
      [VaccineStatus.ON_TIME]: 'Tepat Waktu',
      [VaccineStatus.LATE]: 'Terlambat',
      [VaccineStatus.URGENT]: 'Mendesak',
    };
    return statusMap[status] || 'Unknown';
  }

  public static getImmunizationStatusText(status: number): string {
    const statusMap = {
      [ImmunizationStatus.NOT_DONE]: 'Belum Dilakukan',
      [ImmunizationStatus.ONGOING]: 'Sedang Berlangsung',
      [ImmunizationStatus.DONE]: 'Selesai',
    };
    return statusMap[status] || 'Unknown';
  }
}
