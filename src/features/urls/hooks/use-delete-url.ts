"use client";

import { useAction } from "next-safe-action/hooks";
import { deleteUrl } from "../actions/delete-url";
import { toast } from "sonner";

type UseDeleteUrlProps = {
  onSuccess?: () => void;
};

export const useDeleteUrl = ({ onSuccess }: UseDeleteUrlProps = {}) => {
  const {
    execute,
    isPending,
    reset: resetAction,
  } = useAction(deleteUrl, {
    onSuccess: result => {
      if (result.data?.success) {
        toast.success("URL deleted successfully", {
          description: "The URL has been deleted successfully",
        });
        onSuccess?.();
      }
    },
    onError: error => {
      if (error.error.validationErrors) {
        const fieldErrors = error.error.validationErrors.fieldErrors;
        const formErrors = error.error.validationErrors.formErrors;

        if (fieldErrors?.id) {
          toast.error(`Invalid URL ID: ${fieldErrors.id[0]}`);
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

  const handleDelete = async (id: number) => {
    execute({ id });
  };

  return {
    handleDelete,
    isDeleting: isPending,
    resetAction,
  };
};
