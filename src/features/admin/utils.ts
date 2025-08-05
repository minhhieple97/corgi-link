import type { UrlWithUser, HighlightStyle } from "./types";

export const truncateUrl = (url: string, maxLength = 50) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
};

export const getHighlightStyles = (
  url: UrlWithUser,
  highlightStyle?: HighlightStyle
) => {
  if (!url.flagged) return "";

  switch (highlightStyle) {
    case "security":
      return "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50/80 dark:hover:bg-red-900/20";
    case "inappropriate":
      return "bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/80 dark:hover:bg-orange-900/20";
    case "other":
      return "bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50/80 dark:hover:bg-yellow-900/20";
    default:
      return url.flagged ? "bg-yellow-50/50 dark:bg-yellow-900/10" : "";
  }
};

export const getFlagIconColor = (highlightStyle?: HighlightStyle) => {
  switch (highlightStyle) {
    case "security":
      return "text-red-500 dark:text-red-400";
    case "inappropriate":
      return "text-orange-500 dark:text-orange-400";
    case "other":
      return "text-yellow-500 dark:text-yellow-400";
    default:
      return "text-yellow-600 dark:text-yellow-400";
  }
};

export const getColumnWidth = (column: string): string => {
  switch (column) {
    case "originalUrl":
      return "w-[300px]";
    case "shortCode":
      return "w-[150px]";
    case "clicks":
      return "w-[100px]";
    case "userName":
      return "w-[150px]";
    case "createdAt":
      return "w-[150px]";
    default:
      return "";
  }
};

export const filterConfig = [
  {
    key: "all",
    label: "All URLs",
    variant: "default" as const,
    icon: null,
    className: "",
  },
  {
    key: "flagged",
    label: "All Flagged",
    variant: "secondary" as const,
    icon: "FlagIcon",
    className: "",
  },
  {
    key: "security",
    label: "Security Risks",
    variant: "secondary" as const,
    icon: "ShieldIcon",
    className: "text-red-600 dark:text-red-400",
  },
  {
    key: "inappropriate",
    label: "Inappropriate Content",
    variant: "secondary" as const,
    icon: "AlertTriangle",
    className: "text-orange-600 dark:text-orange-400",
  },
  {
    key: "other",
    label: "Other Flags",
    variant: "secondary" as const,
    icon: "Flag",
    className: "text-yellow-600 dark:text-yellow-400",
  },
];
