import { Button } from '@/components/ui';
import { UI_CONSTANTS } from '@/constants';
import type { FlaggedUrlAlertProps } from '../types';

export const FlaggedUrlAlert = ({
  flagReason,
  onCreateAnother,
}: FlaggedUrlAlertProps) => {
  return (
    <div className="p-4 mb-4 border border-yellow-300 bg-yellow-50 rounded-md flex flex-col gap-2">
      <p className="font-medium text-yellow-800">⚠️ URL Flagged</p>
      <p className="text-yellow-700">{flagReason}</p>
      <div className="flex justify-center">
        <Button variant="outline" onClick={onCreateAnother} className="w-fit">
          {UI_CONSTANTS.BUTTON_LABELS.CREATE_ANOTHER}
        </Button>
      </div>
    </div>
  );
};
