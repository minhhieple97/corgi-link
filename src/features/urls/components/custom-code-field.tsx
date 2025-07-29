import { Button, Input } from '@/components/ui';
import { UI_CONSTANTS } from '@/constants';
import { Sparkles, Loader2 } from 'lucide-react';
import type { CustomCodeFieldProps } from '../types';

export const CustomCodeField = ({
  value,
  onChange,
  disabled,
  baseUrl,
  onGenerateAliases,
  isGenerating,
}: CustomCodeFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1">
          <span className="text-sm text-muted-foreground mr-2">
            {baseUrl}
            {UI_CONSTANTS.URL_PREFIX_SEPARATOR}
          </span>
          <Input
            placeholder={UI_CONSTANTS.FORM_PLACEHOLDERS.CUSTOM_CODE}
            value={value || ''}
            onChange={(e) => onChange(e.target.value || '')}
            className="flex-1"
            disabled={disabled}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerateAliases}
          disabled={disabled || isGenerating}
          className="shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : 'Suggest'}
        </Button>
      </div>
    </div>
  );
};
