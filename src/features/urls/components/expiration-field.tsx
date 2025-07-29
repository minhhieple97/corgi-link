import { ExpirationDatePicker } from '@/components/ui/date-picker';
import type { ExpirationFieldProps } from '../types';

export const ExpirationField = ({
  value,
  onChange,
  disabled,
}: ExpirationFieldProps) => {
  const handleDateChange = (date: Date | null) => {
    onChange(date || undefined);
  };

  return (
    <ExpirationDatePicker
      date={value || undefined}
      onDateChange={handleDateChange}
      disabled={disabled}
    />
  );
};
