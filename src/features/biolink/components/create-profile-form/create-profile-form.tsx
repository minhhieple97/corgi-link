'use client';

import {
  useCreateBiolinkForm,
  useSlugGeneration,
  useSlugValidation,
} from '@/features/biolink/hooks';
import { BasicInfoSection } from './basic-info-section';
import { AppearanceSection } from './appearance-section';
import { PreviewSection } from './preview-section';
import { FormActions } from './form-actions';

export const CreateProfileForm = () => {
  const { form, isPending, onSubmit } = useCreateBiolinkForm();
  const { slugAvailable, isValidating, validateSlug, resetValidation } =
    useSlugValidation();

  const { handleTitleChange, handleSlugChange } = useSlugGeneration({
    setValue: form.setValue,
    watch: form.watch,
  });

  const handleSlugBlur = () => {
    const slug = form.watch('slug');
    if (slug) {
      validateSlug(slug);
    }
  };

  const handleSlugChangeWithReset = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    resetValidation();
    handleSlugChange(e);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <BasicInfoSection
          register={form.register}
          errors={form.formState.errors}
          watch={form.watch}
          onTitleChange={handleTitleChange}
          onSlugChange={handleSlugChangeWithReset}
          onSlugBlur={handleSlugBlur}
          slugAvailable={slugAvailable}
          isValidatingSlug={isValidating}
        />

        <AppearanceSection register={form.register} />

        <PreviewSection watch={form.watch} />
      </div>

      <FormActions isPending={isPending} isValid={form.formState.isValid} />
    </form>
  );
};
