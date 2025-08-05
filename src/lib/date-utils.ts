/**
 * Utility functions for handling URL expiration dates
 */

export const DATE_PRESETS = {
  ONE_HOUR: { label: "1 Hour", hours: 1 },
  ONE_DAY: { label: "1 Day", days: 1 },
  ONE_WEEK: { label: "1 Week", days: 7 },
  ONE_MONTH: { label: "1 Month", days: 30 },
  THREE_MONTHS: { label: "3 Months", days: 90 },
  SIX_MONTHS: { label: "6 Months", days: 180 },
  ONE_YEAR: { label: "1 Year", days: 365 },
  NEVER: { label: "Never", days: null },
} as const;

export const createExpirationDate = (
  preset: keyof typeof DATE_PRESETS
): Date | null => {
  const presetData = DATE_PRESETS[preset];

  if ("days" in presetData && presetData.days === null) {
    return null; // Never expires
  }

  const date = new Date();

  if ("hours" in presetData) {
    date.setHours(date.getHours() + presetData.hours);
  } else if ("days" in presetData && presetData.days !== null) {
    date.setDate(date.getDate() + presetData.days);
  }

  return date;
};

export const isExpired = (expiresAt: Date | null | string): boolean => {
  if (!expiresAt) return false; // Never expires

  const expirationDate =
    typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expirationDate < new Date();
};

export const getTimeUntilExpiration = (
  expiresAt: Date | null | string
): string | null => {
  if (!expiresAt) return null; // Never expires

  const expirationDate =
    typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const timeDiff = expirationDate.getTime() - now.getTime();

  if (timeDiff <= 0) return "Expired";

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const formatExpirationDate = (
  expiresAt: Date | null | string
): string => {
  if (!expiresAt) return "Never";

  const date = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateExpirationDate = (
  date: Date | null
): { isValid: boolean; error?: string } => {
  if (!date) return { isValid: true }; // Allow null for never expires

  const now = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);

  if (date <= now) {
    return { isValid: false, error: "Expiration date must be in the future" };
  }

  if (date > maxDate) {
    return {
      isValid: false,
      error: "Expiration date cannot be more than 5 years in the future",
    };
  }

  return { isValid: true };
};
