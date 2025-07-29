import { Button, Input } from '@/components/ui';
import { UI_CONSTANTS } from '@/constants';
import type { SuccessUrlDisplayProps } from '../types';

export const SuccessUrlDisplay = ({
  shortUrl,
  onCopy,
  onCreateAnother,
}: SuccessUrlDisplayProps) => {
  return (
    <div className="p-4 mb-4 border rounded-md flex flex-col gap-2">
      <p className="font-medium">Your shortened URL:</p>
      <div className="flex items-center gap-2 mt-2">
        <Input value={shortUrl} readOnly />
        <Button onClick={onCopy} size="sm">
          {UI_CONSTANTS.BUTTON_LABELS.COPY}
        </Button>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" onClick={onCreateAnother} className="w-fit">
          {UI_CONSTANTS.BUTTON_LABELS.CREATE_ANOTHER}
        </Button>
      </div>
    </div>
  );
};
