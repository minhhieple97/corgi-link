"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Flag, FlagIcon, ShieldIcon } from "lucide-react";
import { useUrlFilter } from "../hooks";
import { filterConfig } from "../utils";

type UrlFilterProps = {
  initialFilter: string;
};

const iconMap = {
  FlagIcon,
  ShieldIcon,
  AlertTriangle,
  Flag,
};

export const UrlFilter = ({ initialFilter }: UrlFilterProps) => {
  const { currentFilter, handleFilterChange } = useUrlFilter(initialFilter);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filterConfig.map(filter => {
        const IconComponent = filter.icon
          ? iconMap[filter.icon as keyof typeof iconMap]
          : null;
        const isActive = currentFilter === filter.key;
        const variant = isActive ? filter.variant : "outline";

        return (
          <Button
            key={filter.key}
            variant={variant}
            size="sm"
            onClick={() => handleFilterChange(filter.key)}
            className={`gap-2 ${filter.className}`}
          >
            {IconComponent && <IconComponent className="size-4" />}
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};
