'use client';

import { Form, FormControl, FormField, FormItem } from '@/components/ui';
import { useAuth } from '@clerk/nextjs';
import { AnalyzingModal } from '@/components/shared';
import { useUrlShortenerForm } from '../hooks/use-url-shortener-form';
import {
  FlaggedUrlAlert,
  SuccessUrlDisplay,
  UrlInputField,
  CustomCodeField,
  AliasSuggestions,
  ExpirationField,
} from './';

export const UrlShortenerForm = () => {
  const { isSignedIn } = useAuth();
  const {
    // Form state
    form,

    // Computed values
    isUrlValid,
    baseUrl,

    // URL shortening state
    shortUrl,
    isPending,
    flagged,
    flagReason,
    isAnalyzing,

    // Alias generation state
    suggestedAliases,
    isGenerating,

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
  } = useUrlShortenerForm();

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {/* Flagged URL Alert */}
        {flagged && flagReason && (
          <FlaggedUrlAlert
            flagReason={flagReason}
            onCreateAnother={handleResetForm}
          />
        )}

        {/* Success URL Display */}
        {shortUrl && !flagged && (
          <SuccessUrlDisplay
            shortUrl={shortUrl}
            onCopy={handleCopy}
            onCreateAnother={handleResetForm}
          />
        )}

        {/* URL Shortener Form */}
        {!shortUrl && !flagged && (
          <Form {...form}>
            <div className="space-y-4">
              {/* URL Input Field */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UrlInputField
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleUrlChange(value);
                        }}
                        disabled={isPending}
                        isValid={isUrlValid}
                        isSignedIn={isSignedIn}
                        isPending={isPending}
                        onSubmit={handleSubmit}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Custom Code Field */}
              <FormField
                control={form.control}
                name="customCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <CustomCodeField
                          value={field.value || ''}
                          onChange={(value) => {
                            field.onChange(value);
                            handleCustomCodeChange(value);
                          }}
                          disabled={isPending || !isSignedIn || !isUrlValid}
                          baseUrl={baseUrl}
                          onGenerateAliases={handleGenerateAliases}
                          isGenerating={isGenerating}
                        />

                        {/* Alias Suggestions */}
                        <AliasSuggestions
                          aliases={suggestedAliases}
                          onAliasClick={handleSuggestionClick}
                          disabled={isPending || !isUrlValid}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Expiration Field */}
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ExpirationField
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          handleExpirationChange(date);
                        }}
                        disabled={isPending || !isSignedIn || !isUrlValid}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
      </div>

      <AnalyzingModal isOpen={isAnalyzing} onOpenChange={setIsAnalyzing} />
    </>
  );
};
