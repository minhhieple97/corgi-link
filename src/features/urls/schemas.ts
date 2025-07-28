import { z } from 'zod';

export const UrlFormSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  customCode: z
    .string()
    .max(20, 'Custom code must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code must be alphanumeric or hyphen')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  expiresAt: z
    .date()
    .min(new Date(), 'Expiration date must be in the future')
    .optional()
    .nullable()
    .refine((date) => {
      if (!date) return true;
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 5); // Maximum 5 years
      return date <= maxDate;
    }, 'Expiration date cannot be more than 5 years in the future'),
});


export const UpdateUrlSchema = z.object({
  id: z.number(),
  customCode: z
    .string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(255, 'Custom code must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code must be alphanumeric or hyphen'),
  expiresAt: z
    .date()
    .min(new Date(), 'Expiration date must be in the future')
    .optional()
    .refine((date) => {
      if (!date) return true;
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 5); // Maximum 5 years
      return date <= maxDate;
    }, 'Expiration date cannot be more than 5 years in the future')
    .nullable(),
});

export const DeleteUrlSchema = z.object({
  id: z.number(),
});