/**
 * Utility functions for progress meters/bars with dynamic colors
 * Based on percentage thresholds (similar to Google Drive storage meter)
 */

export interface MeterThreshold {
  min: number;
  barColor: string;
  textColor: string;
  label?: string;
}

// Default thresholds configuration
const DEFAULT_THRESHOLDS: MeterThreshold[] = [
  { min: 90, barColor: "bg-gradient-to-r from-red-500 to-red-600", textColor: "text-red-600", label: "Quasi pieno" },
  { min: 75, barColor: "bg-gradient-to-r from-primary-400 to-primary-500", textColor: "text-primary-500", label: "Attenzione" },
  { min: 50, barColor: "bg-gradient-to-r from-yellow-400 to-amber-500", textColor: "text-amber-500" },
  { min: 0, barColor: "bg-gradient-to-r from-emerald-400 to-emerald-500", textColor: "text-emerald-500" },
];

/**
 * Get the appropriate bar color class based on percentage
 */
export const getMeterBarColor = (percentage: number, thresholds: MeterThreshold[] = DEFAULT_THRESHOLDS): string => {
  for (const threshold of thresholds) {
    if (percentage >= threshold.min) {
      return threshold.barColor;
    }
  }
  return thresholds[thresholds.length - 1].barColor;
};

/**
 * Get the appropriate text color class based on percentage
 */
export const getMeterTextColor = (percentage: number, thresholds: MeterThreshold[] = DEFAULT_THRESHOLDS): string => {
  for (const threshold of thresholds) {
    if (percentage >= threshold.min) {
      return threshold.textColor;
    }
  }
  return thresholds[thresholds.length - 1].textColor;
};

/**
 * Get the status label based on percentage (returns null if no label for current threshold)
 */
export const getMeterStatusLabel = (percentage: number, thresholds: MeterThreshold[] = DEFAULT_THRESHOLDS): string | null => {
  for (const threshold of thresholds) {
    if (percentage >= threshold.min) {
      return threshold.label ?? null;
    }
  }
  return null;
};

/**
 * Get badge styling based on percentage
 */
export const getMeterBadgeStyle = (percentage: number): string => {
  if (percentage >= 90) return "bg-red-100 text-red-600";
  if (percentage >= 75) return "bg-primary-100 text-primary-600";
  if (percentage >= 50) return "bg-amber-100 text-amber-600";
  return "bg-emerald-100 text-emerald-600";
};

/**
 * Calculate percentage from value, min, and max
 */
export const calculateMeterPercentage = (value: number, min: number = 0, max: number = 100): number => {
  return Math.min(100, Math.max(0, 100 * ((value - min) / (max - min))));
};