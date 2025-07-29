import { Button } from '@/components/ui';
import type { AliasSuggestionsProps } from '../types';

export const AliasSuggestions = ({
  aliases,
  onAliasClick,
  disabled,
}: AliasSuggestionsProps) => {
  if (aliases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        AI-generated suggestions (click to use):
      </p>
      <div className="flex flex-wrap gap-2">
        {aliases.map((alias, index) => (
          <Button
            key={index}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onAliasClick(alias)}
            className="text-xs h-7 px-2"
            disabled={disabled}
          >
            {alias}
          </Button>
        ))}
      </div>
    </div>
  );
};
