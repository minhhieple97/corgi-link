'use client';

import { useAction } from 'next-safe-action/hooks';
import { shortenUrl } from '../actions/shorten-url';
import { useState, useRef } from 'react';
import { IUrlFormData } from '../types';
import { UrlFormSchema } from '../schemas';
import { toast } from 'sonner';
import { UI_CONSTANTS } from '@/constants';

export const useShortenUrl = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    execute,
    result,
    isPending,
    reset: resetAction,
  } = useAction(shortenUrl, {
    onExecute: () => {
      timeoutRef.current = setTimeout(() => {
        setIsAnalyzing(true);
      }, 500);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsAnalyzing(false);
    },
    onSuccess: (result) => {
      if (result.data?.flagged && result.data?.flagReason) {
        toast.warning(`URL flagged: ${result.data.flagReason}`);
        return;
      }
      if (result.data?.shortUrl) {
        toast.success(
          `${UI_CONSTANTS.TOAST_MESSAGES.SHORT_URL_SUCCESS_PREFIX}${result.data.shortUrl}`,
        );
      }
    },
    onError: (error) => {
      if (error.error.validationErrors) {
        const fieldErrors = error.error.validationErrors.fieldErrors;
        const formErrors = error.error.validationErrors.formErrors;

        if (fieldErrors?.url) {
          toast.error(
            `${UI_CONSTANTS.TOAST_MESSAGES.URL_ERROR_PREFIX}${fieldErrors.url[0]}`,
          );
        }
        if (fieldErrors?.customCode) {
          toast.error(
            `${UI_CONSTANTS.TOAST_MESSAGES.CUSTOM_CODE_ERROR_PREFIX}${fieldErrors.customCode[0]}`,
          );
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

  const onSubmit = async (data: IUrlFormData) => {
    const validationResult = UrlFormSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      if (errors.url?.[0]) {
        toast.error(errors.url[0]);
        return;
      }
      if (errors.customCode?.[0]) {
        toast.error(errors.customCode[0]);
        return;
      }
      if (errors.expiresAt?.[0]) {
        toast.error(errors.expiresAt[0]);
        return;
      }
      toast.error(UI_CONSTANTS.TOAST_MESSAGES.VALIDATION_FALLBACK);
      return;
    }
    execute(data);
  };

  const resetForm = () => {
    resetAction();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsAnalyzing(false);
  };

  const handleCopy = () => {
    if (result?.data?.shortUrl) {
      navigator.clipboard.writeText(result.data.shortUrl);
      toast.success(UI_CONSTANTS.TOAST_MESSAGES.COPY_SUCCESS);
    }
  };

  return {
    onSubmit,
    isPending,
    shortUrl: result?.data?.shortUrl,
    flagged: result?.data?.flagged,
    flagReason: result?.data?.flagReason,
    resetForm,
    handleCopy,
    isAnalyzing,
    setIsAnalyzing,
  };
};
