import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Button,
} from '@/components/ui';
import { Loader2, Calendar, Clock } from 'lucide-react';
import { useUpdateUrl } from '../hooks/use-update-url';
import { env } from '@/env';
import { ExpirationDatePicker } from '@/components/ui/date-picker';
import { ExpirationBadge } from '@/components/shared';

type EditUrlModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: number;
  currentShortCode: string;
  currentExpiration?: Date | null;
  onSuccess: (newShortCode: string) => void;
};

export const EditUrlModal = ({
  isOpen,
  onOpenChange,
  urlId,
  currentShortCode,
  currentExpiration,
  onSuccess,
}: EditUrlModalProps) => {
  const { onSubmit, isPending, form, handleCancel } = useUpdateUrl({
    urlId,
    currentShortCode,
    currentExpiration,
    onSuccess: (newShortCode) => {
      onSuccess(newShortCode);
      onOpenChange(false);
    },
    isOpen,
    onOpenChange,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Short URL
          </DialogTitle>
          <DialogDescription>
            Customize the short code and expiration date for this URL. The short code must be unique
            and can only contain letters, numbers, hyphens, and underscores.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form.getValues());
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">
                        {env.NEXT_PUBLIC_APP_URL}/r/
                      </span>
                      <Input
                        placeholder="Custom code"
                        {...field}
                        disabled={isPending}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ExpirationDatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      disabled={isPending}
                      placeholder="Select expiration date (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Status Display */}
            {currentExpiration && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Current Expiration:
                </p>
                <ExpirationBadge expiresAt={currentExpiration} showFullDate />
              </div>
            )}

            <DialogFooter className="sm:justify-end">
              <Button type="button" variant={'outline'} onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
