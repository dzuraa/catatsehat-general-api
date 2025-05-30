import { Gender } from '@prisma/client';
import { BMIStatus } from '@prisma/client';

export interface BMIRange {
  min: number;
  max: number;
  status: BMIStatus;
}

export interface AgeGroup {
  min: number;
  max: number;
  ranges: BMIRange[];
}

export const BMI_RANGES = {
  [Gender.FEMALE]: [
    {
      // 0-2 years
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 11.9, status: BMIStatus.MALNUTRITION },
        { min: 12, max: 13.1, status: BMIStatus.UNDERNUTRITION },
        { min: 13.2, max: 18.4, status: BMIStatus.NORMAL },
        { min: 18.5, max: 20.4, status: BMIStatus.OVERWEIGHT },
        { min: 20.5, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
    {
      // 2-5 years
      min: 2,
      max: 5,
      ranges: [
        { min: 0, max: 11.6, status: BMIStatus.MALNUTRITION },
        { min: 11.7, max: 12.6, status: BMIStatus.UNDERNUTRITION },
        { min: 12.7, max: 18.7, status: BMIStatus.NORMAL },
        { min: 18.8, max: 20.9, status: BMIStatus.OVERWEIGHT },
        { min: 21, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
    {
      // 5-6 years
      min: 5,
      max: 6.1,
      ranges: [
        { min: 0, max: 11.7, status: BMIStatus.MALNUTRITION },
        { min: 11.8, max: 12.7, status: BMIStatus.UNDERNUTRITION },
        { min: 12.8, max: 17.1, status: BMIStatus.NORMAL },
        { min: 17.2, max: 19.7, status: BMIStatus.OVERWEIGHT },
        { min: 19.8, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
  ],

  [Gender.MALE]: [
    {
      // 0-2 years
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 12.5, status: BMIStatus.MALNUTRITION },
        { min: 12.6, max: 13.5, status: BMIStatus.UNDERNUTRITION },
        { min: 13.6, max: 18.5, status: BMIStatus.NORMAL },
        { min: 18.6, max: 20.1, status: BMIStatus.OVERWEIGHT },
        { min: 20.2, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
    {
      // 2-5 years
      min: 2,
      max: 5,
      ranges: [
        { min: 0, max: 11.9, status: BMIStatus.MALNUTRITION },
        { min: 12, max: 12.8, status: BMIStatus.UNDERNUTRITION },
        { min: 12.9, max: 18.1, status: BMIStatus.NORMAL },
        { min: 18.2, max: 20.1, status: BMIStatus.OVERWEIGHT },
        { min: 20.2, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
    {
      // 5-6 years
      min: 5,
      max: 6.1,
      ranges: [
        { min: 0, max: 12.1, status: BMIStatus.MALNUTRITION },
        { min: 12.2, max: 13.1, status: BMIStatus.UNDERNUTRITION },
        { min: 13.2, max: 16.9, status: BMIStatus.NORMAL },
        { min: 17, max: 18.9, status: BMIStatus.OVERWEIGHT },
        { min: 19, max: Infinity, status: BMIStatus.OBESITY },
      ],
    },
  ],
};

export const BMI_RANGES_MOTHER = [
  { min: 0, max: 18.4, status: BMIStatus.UNDERNUTRITION },
  { min: 18.5, max: 24.9, status: BMIStatus.NORMAL },
  { min: 25, max: 29.9, status: BMIStatus.OVERWEIGHT },
  { min: 30, max: Infinity, status: BMIStatus.OBESITY },
];

export const BMI_RANGES_ELDERLY = [
  { min: 0, max: 18.4, status: BMIStatus.UNDERNUTRITION },
  { min: 18.5, max: 24.9, status: BMIStatus.NORMAL },
  { min: 25, max: 29.9, status: BMIStatus.OVERWEIGHT },
  { min: 30, max: Infinity, status: BMIStatus.OBESITY },
];
