'use client';

import { useEffect, useMemo } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
} from '@/components/ui';
import { ExpirationDatePicker } from '@/components/ui/date-picker';
import { env } from '@/env';
import { useShortenUrl } from '../hooks/use-shorten-url';
import { useGenerateAlias } from '../hooks/use-generate-alias';
import { UrlFormSchema } from '../schemas';
import { UI_CONSTANTS } from '@/constants';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { AnalyzingModal } from '@/components/shared';
import { Sparkles, Loader2 } from 'lucide-react';

export const UrlShortenerForm = () => {
  const { isSignedIn } = useAuth();
  const {
    onSubmit,
    shortUrl,
    isPending,
    form,
    resetForm,
    flagged,
    flagReason,
    handleCopy,
    isAnalyzing,
    setIsAnalyzing,
  } = useShortenUrl();

  const { suggestedAliases, isGenerating, generateAliases, clearSuggestions } =
    useGenerateAlias();

  const urlValue = form.watch('url');
  const isUrlValid = useMemo(() => {
    if (!urlValue || urlValue.trim() === '') return false;
    return UrlFormSchema.shape.url.safeParse(urlValue).success;
  }, [urlValue]);

  const handleSuggestionClick = (alias: string) => {
    form.setValue('customCode', alias);
    clearSuggestions();
  };

  const handleGenerateAliases = () => {
    const url = form.getValues('url');
    generateAliases(url);
  };

  const handleResetForm = () => {
    resetForm();
    clearSuggestions();
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'url' && suggestedAliases.length > 0) {
        clearSuggestions();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, suggestedAliases.length, clearSuggestions]);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {flagged && flagReason && (
          <div className="p-4 mb-4 border border-yellow-300 bg-yellow-50 rounded-md flex flex-col gap-2">
            <p className="font-medium text-yellow-800">⚠️ URL Flagged</p>
            <p className="text-yellow-700">{flagReason}</p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleResetForm}
                className="w-fit"
              >
                {UI_CONSTANTS.BUTTON_LABELS.CREATE_ANOTHER}
              </Button>
            </div>
          </div>
        )}

        {shortUrl && !flagged && (
          <div className="p-4 mb-4 border rounded-md flex flex-col gap-2">
            <p className="font-medium">Your shortened URL:</p>
            <div className="flex items-center gap-2 mt-2">
              <Input value={shortUrl} readOnly />
              <Button onClick={handleCopy} size="sm">
                {UI_CONSTANTS.BUTTON_LABELS.COPY}
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleResetForm}
                className="w-fit"
              >
                {UI_CONSTANTS.BUTTON_LABELS.CREATE_ANOTHER}
              </Button>
            </div>
          </div>
        )}

        {!shortUrl && !flagged && (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isSignedIn && isUrlValid) {
                  onSubmit(form.getValues());
                }
              }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={UI_CONSTANTS.FORM_PLACEHOLDERS.URL_INPUT}
                          {...field}
                          disabled={isPending || !isSignedIn}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isSignedIn ? (
                  <Button type="submit" disabled={isPending || !isUrlValid}>
                    {isPending
                      ? UI_CONSTANTS.BUTTON_LABELS.SHORTENING
                      : UI_CONSTANTS.BUTTON_LABELS.SHORTEN}
                  </Button>
                ) : (
                  <SignInButton>
                    <Button type="button" disabled={isPending || !isUrlValid}>
                      Login to shorten
                    </Button>
                  </SignInButton>
                )}
              </div>

              <FormField
                control={form.control}
                name="customCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center flex-1">
                            <span className="text-sm text-muted-foreground mr-2">
                              {env.NEXT_PUBLIC_APP_URL ||
                                window.location.origin}
                              {UI_CONSTANTS.URL_PREFIX_SEPARATOR}
                            </span>
                            <Input
                              placeholder={
                                UI_CONSTANTS.FORM_PLACEHOLDERS.CUSTOM_CODE
                              }
                              {...field}
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value || '')
                              }
                              className="flex-1"
                              disabled={isPending || !isSignedIn || !isUrlValid}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateAliases}
                            disabled={
                              isPending ||
                              !isSignedIn ||
                              isGenerating ||
                              !isUrlValid
                            }
                            className="shrink-0"
                          >
                            {isGenerating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                            {isGenerating ? 'Generating...' : 'Suggest'}
                          </Button>
                        </div>

                        {suggestedAliases.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              AI-generated suggestions (click to use):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {suggestedAliases.map((alias, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(alias)}
                                  className="text-xs h-7 px-2"
                                  disabled={isPending || !isUrlValid}
                                >
                                  {alias}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
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
                        disabled={isPending || !isSignedIn || !isUrlValid}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </div>

      <AnalyzingModal isOpen={isAnalyzing} onOpenChange={setIsAnalyzing} />
    </>
  );
};
