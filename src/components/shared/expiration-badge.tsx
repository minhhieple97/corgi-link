import { Badge } from "@/components/ui/badge";
import {
  getTimeUntilExpiration,
  isExpired,
  formatExpirationDate,
} from "@/lib/date-utils";
import { Clock, Timer, AlertTriangle } from "lucide-react";

type ExpirationBadgeProps = {
  expiresAt: Date | string | null;
  showFullDate?: boolean;
};

export function ExpirationBadge({
  expiresAt,
  showFullDate = false,
}: ExpirationBadgeProps) {
  if (!expiresAt) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Never expires
      </Badge>
    );
  }

  const expired = isExpired(expiresAt);
  const timeUntil = getTimeUntilExpiration(expiresAt);

  if (expired) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Expired
      </Badge>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="flex items-center gap-1">
        <Timer className="h-3 w-3" />
        {timeUntil ? `${timeUntil} left` : "Active"}
      </Badge>
      {showFullDate && (
        <span className="text-xs text-muted-foreground">
          Expires: {formatExpirationDate(expiresAt)}
        </span>
      )}
    </div>
  );
}
