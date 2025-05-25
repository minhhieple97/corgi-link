import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  customCode: z
    .string()
    .max(20, 'Custom code must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code must be alphanumeric or hyphen')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export type UrlFormData = z.infer<typeof urlSchema>;
