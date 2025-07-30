import { Button, Input, Card, CardContent, Badge } from '@/components/ui';
import { UI_CONSTANTS } from '@/constants';
import { CheckCircle, Copy, Plus, ExternalLink } from 'lucide-react';
import type { SuccessUrlDisplayProps } from '../types';

export const SuccessUrlDisplay = ({
  shortUrl,
  onCopy,
  onCreateAnother,
}: SuccessUrlDisplayProps) => {
  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 shadow-lg">
      <CardContent className="p-3 lg:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-green-900 dark:text-green-100">
                Success! Link ready
              </h3>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Ready to share
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={shortUrl}
                readOnly
                className="pr-8 bg-background/80 border-border/50 focus:border-green-500 dark:focus:border-green-400 font-mono text-sm"
              />
              <ExternalLink className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            </div>
            <Button onClick={onCopy} size="sm" className="gap-1 text-xs">
              <Copy className="h-3 w-3" />
              <span className="hidden sm:inline">{UI_CONSTANTS.BUTTON_LABELS.COPY}</span>
              <span className="sm:hidden">Copy</span>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onCreateAnother}
              size="sm"
              className="gap-1 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-xs"
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">{UI_CONSTANTS.BUTTON_LABELS.CREATE_ANOTHER}</span>
              <span className="sm:hidden">Create Another</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
