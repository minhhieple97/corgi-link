import { Button, Input } from '@/components/ui';
import { UI_CONSTANTS } from '@/constants';
import { SignInButton } from '@clerk/nextjs';
import type { UrlInputFieldProps } from '../types';

export const UrlInputField = ({
  value,
  onChange,
  disabled,
  isValid,
  isSignedIn,
  isPending,
  onSubmit,
}: UrlInputFieldProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignedIn && isValid) {
      onSubmit();
    }
  };

  const isUserSignedIn = Boolean(isSignedIn);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <Input
          placeholder={UI_CONSTANTS.FORM_PLACEHOLDERS.URL_INPUT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || !isUserSignedIn}
        />
      </div>
      {isUserSignedIn ? (
        <Button type="submit" disabled={isPending || !isValid}>
          {isPending
            ? UI_CONSTANTS.BUTTON_LABELS.SHORTENING
            : UI_CONSTANTS.BUTTON_LABELS.SHORTEN}
        </Button>
      ) : (
        <SignInButton>
          <Button type="button" disabled={isPending || !isValid}>
            Login to shorten
          </Button>
        </SignInButton>
      )}
    </form>
  );
};
