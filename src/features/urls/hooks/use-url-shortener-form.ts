import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { env } from "@/env";
import { shortenUrl } from "../actions/shorten-url";
import { UrlFormSchema } from "../schemas";
import { UI_CONSTANTS } from "@/constants";
import type {
  IUrlFormData,
  UseUrlShortenerFormReturn,
  AliasGenerationResponse,
  UrlPreviewState,
} from "../types";
import { urlPreviewService } from "../services/url-preview-service";

type AliasGenerationOptions = {
  count?: number;
  maxLength?: number;
  excludeWords?: string[];
};

export const useUrlShortenerForm = (): UseUrlShortenerFormReturn => {
  // Form state management
  const form = useForm<IUrlFormData>({
    resolver: zodResolver(UrlFormSchema),
    defaultValues: {
      url: "",
      customCode: "",
      expiresAt: undefined,
    },
  });

  // Local state for URL shortening
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [suggestedAliases, setSuggestedAliases] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [previewState, setPreviewState] = useState<UrlPreviewState>({
    isLoading: false,
    data: null,
    error: null,
  });
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    onSuccess: result => {
      if (result.data?.flagged && result.data?.flagReason) {
        toast.warning(`URL flagged: ${result.data.flagReason}`);
        return;
      }
      if (result.data?.shortUrl) {
        toast.success(
          `${UI_CONSTANTS.TOAST_MESSAGES.SHORT_URL_SUCCESS_PREFIX}${result.data.shortUrl}`
        );
      }
    },
    onError: error => {
      if (error.error.validationErrors) {
        const fieldErrors = error.error.validationErrors.fieldErrors;
        const formErrors = error.error.validationErrors.formErrors;

        if (fieldErrors?.url) {
          toast.error(
            `${UI_CONSTANTS.TOAST_MESSAGES.URL_ERROR_PREFIX}${fieldErrors.url[0]}`
          );
        }
        if (fieldErrors?.customCode) {
          toast.error(
            `${UI_CONSTANTS.TOAST_MESSAGES.CUSTOM_CODE_ERROR_PREFIX}${fieldErrors.customCode[0]}`
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

  // Computed values
  const urlValue = form.watch("url");
  const customCodeValue = form.watch("customCode");
  const expirationValue = form.watch("expiresAt");

  const isUrlValid = useMemo(() => {
    if (!urlValue || urlValue.trim() === "") return false;
    return UrlFormSchema.shape.url.safeParse(urlValue).success;
  }, [urlValue]);

  const baseUrl = useMemo(
    () =>
      env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  const fetchUrlPreview = useCallback(async (url: string) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    if (!urlPreviewService.isValidPreviewUrl(url)) {
      setPreviewState({
        isLoading: false,
        data: null,
        error: null,
      });
      return;
    }

    setPreviewState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const metadata = await urlPreviewService.fetchPreview(url);
      setPreviewState({
        isLoading: false,
        data: metadata,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch preview";
      setPreviewState({
        isLoading: false,
        data: null,
        error: errorMessage,
      });
    }
  }, []);

  const generateAliases = useCallback(
    async (url: string, options: AliasGenerationOptions = {}) => {
      if (!url.trim()) {
        const errorMessage = "Please enter a URL first";
        toast.error(errorMessage);
        return;
      }

      setIsGenerating(true);
      setSuggestedAliases([]);

      try {
        const requestBody = {
          url: url.trim(),
          options: {
            count: options.count || 5,
            maxLength: options.maxLength || 12,
            excludeWords: options.excludeWords || [],
          },
        };

        const response = await fetch("/api/generate-alias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data: AliasGenerationResponse = await response.json();

        if (!response.ok) {
          const errorMessage =
            data.error?.message || `Server error: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (data.success && data.data?.aliases) {
          if (data.data.aliases.length === 0) {
            const warningMessage = "No aliases could be generated for this URL";
            toast.warning(warningMessage);
          } else {
            setSuggestedAliases(data.data.aliases);
            toast.success(
              `Generated ${data.data.aliases.length} alias suggestions`
            );
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate aliases";

        console.error("Error generating aliases:", error);
        toast.error(errorMessage);
        setSuggestedAliases([]);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearSuggestions = useCallback(() => {
    setSuggestedAliases([]);
  }, []);

  // Form submission logic
  const onSubmit = useCallback(
    async (data: IUrlFormData) => {
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
    },
    [execute]
  );

  const handleSubmit = useCallback(() => {
    const formData = form.getValues();
    onSubmit(formData);
  }, [form, onSubmit]);

  const handleUrlChange = useCallback(
    (value: string) => {
      form.setValue("url", value);

      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }

      previewTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          fetchUrlPreview(value.trim());
        } else {
          setPreviewState({
            isLoading: false,
            data: null,
            error: null,
          });
        }
      }, 800); // 800ms debounce
    },
    [form, fetchUrlPreview]
  );

  const handleCustomCodeChange = useCallback(
    (value: string) => {
      form.setValue("customCode", value);
    },
    [form]
  );

  const handleExpirationChange = useCallback(
    (date: Date | undefined) => {
      form.setValue("expiresAt", date);
    },
    [form]
  );

  const handleSuggestionClick = useCallback(
    (alias: string) => {
      form.setValue("customCode", alias);
      clearSuggestions();
    },
    [form, clearSuggestions]
  );

  const handleGenerateAliases = useCallback(() => {
    const url = form.getValues("url");
    generateAliases(url);
  }, [form, generateAliases]);

  const handleResetForm = useCallback(() => {
    resetAction();
    clearSuggestions();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setIsAnalyzing(false);
    setPreviewState({
      isLoading: false,
      data: null,
      error: null,
    });
    form.reset();
  }, [resetAction, clearSuggestions, form]);

  const handleCopy = useCallback(() => {
    if (result?.data?.shortUrl) {
      navigator.clipboard.writeText(result.data.shortUrl);
      toast.success(UI_CONSTANTS.TOAST_MESSAGES.COPY_SUCCESS);
    }
  }, [result?.data?.shortUrl]);

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === "url" && suggestedAliases.length > 0) {
        clearSuggestions();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, suggestedAliases.length, clearSuggestions]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Form state
    form,
    urlValue,
    customCodeValue,
    expirationValue,

    // Computed values
    isUrlValid,
    baseUrl,

    // URL shortening state
    shortUrl: result?.data?.shortUrl,
    isPending,
    flagged: result?.data?.flagged,
    flagReason: result?.data?.flagReason,
    isAnalyzing,

    // Alias generation state
    suggestedAliases,
    isGenerating,

    // URL preview state
    previewState,

    // Event handlers
    handleSubmit,
    handleUrlChange,
    handleCustomCodeChange,
    handleExpirationChange,
    handleSuggestionClick,
    handleGenerateAliases,
    handleResetForm,
    handleCopy,
    setIsAnalyzing,
  };
};
