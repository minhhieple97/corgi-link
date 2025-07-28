'use client';

import { useAction } from 'next-safe-action/hooks';
import { updateUrl } from '../actions/update-url';
import { IUpdateUrlFormData } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UpdateUrlSchema } from '../schemas';
import { toast } from 'sonner';
import { UI_CONSTANTS } from '@/constants';
import { useEffect } from 'react';

type UseUpdateUrlProps = {
  urlId: number;
  currentShortCode: string;
  currentExpiration?: Date | null;
  onSuccess?: (newShortCode: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useUpdateUrl = ({
  urlId,
  currentShortCode,
  currentExpiration,
  onSuccess,
  isOpen,
  onOpenChange,
}: UseUpdateUrlProps) => {
  const form = useForm<IUpdateUrlFormData>({
    resolver: zodResolver(UpdateUrlSchema),
    defaultValues: {
      customCode: currentShortCode,
      expiresAt: currentExpiration,
    },
  });

  const {
    execute,
    result,
    isPending,
    reset: resetAction,
  } = useAction(updateUrl, {
    onSuccess: (result) => {
      if (result.data?.customCode) {
        toast.success('URL updated successfully', {
          description: 'The URL has been updated successfully',
        });
        onSuccess?.(result.data.customCode);
      }
    },
    onError: (error) => {
      if (error.error.validationErrors) {
        const fieldErrors = error.error.validationErrors.fieldErrors;
        const formErrors = error.error.validationErrors.formErrors;

        if (fieldErrors?.customCode) {
          toast.error(
            `${UI_CONSTANTS.TOAST_MESSAGES.CUSTOM_CODE_ERROR_PREFIX}${fieldErrors.customCode[0]}`,
          );
        }

        if (fieldErrors?.expiresAt) {
          toast.error(fieldErrors.expiresAt[0]);
        }

        if (formErrors && formErrors.length > 0) {
          toast.error(formErrors[0]);
        }
      }

      if (error.error.serverError) {
        toast.error(error.error.serverError);
      }
    },
  });

  const onSubmit = async (data: IUpdateUrlFormData) => {
    execute({
      id: urlId,
      customCode: data.customCode,
      expiresAt: data.expiresAt,
    });
  };

  const resetForm = () => {
    form.reset({
      customCode: currentShortCode,
      expiresAt: currentExpiration,
    });
    resetAction();
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        customCode: currentShortCode,
        expiresAt: currentExpiration,
      });
    }
  }, [isOpen, currentShortCode, currentExpiration, form]);

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return {
    onSubmit,
    isPending,
    form,
    resetForm,
    shortUrl: result?.data?.shortUrl,
    handleCancel,
  };
};
