import { z } from 'zod';

export const biolinkStatusSchema = z.enum(['draft', 'public']);

export const componentTypeSchema = z.enum([
  'button',
  'text', 
  'image',
  'link',
  'social-links',
  'projects',
  'contact-form',
  'divider',
]);

export const createBiolinkProfileSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
  title: z.string().max(255).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  career: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  status: biolinkStatusSchema.default('draft'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#ffffff'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#000000'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#3b82f6'),
  customCss: z.string().max(5000).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export const updateBiolinkProfileSchema = createBiolinkProfileSchema.partial().extend({
  id: z.number().positive(),
});

export const createBiolinkComponentSchema = z.object({
  profileId: z.number().positive(),
  type: componentTypeSchema,
  title: z.string().max(255).optional(),
  content: z.string().max(2000).optional(),
  url: z.string().url().max(500).optional().or(z.literal('')),
  imageUrl: z.string().url().max(500).optional().or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  borderColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  order: z.number().min(0),
  isVisible: z.boolean().default(true),
  settings: z.record(z.any()).optional(),
});

export const updateBiolinkComponentSchema = createBiolinkComponentSchema.partial().extend({
  id: z.number().positive(),
});

export const createBiolinkSocialLinkSchema = z.object({
  profileId: z.number().positive(),
  platform: z.string().min(1).max(50),
  url: z.string().url().max(500),
  username: z.string().max(100).optional(),
  isVisible: z.boolean().default(true),
  order: z.number().min(0),
});

export const updateBiolinkSocialLinkSchema = createBiolinkSocialLinkSchema.partial().extend({
  id: z.number().positive(),
});

export const createBiolinkProjectSchema = z.object({
  profileId: z.number().positive(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().max(500).optional().or(z.literal('')),
  projectUrl: z.string().url().max(500).optional().or(z.literal('')),
  githubUrl: z.string().url().max(500).optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().min(0),
});

export const updateBiolinkProjectSchema = createBiolinkProjectSchema.partial().extend({
  id: z.number().positive(),
});

export const updateComponentOrderSchema = z.object({
  componentId: z.number().positive(),
  newOrder: z.number().min(0),
  profileId: z.number().positive(),
});

export const publishProfileSchema = z.object({
  profileId: z.number().positive(),
  status: biolinkStatusSchema,
});

export const duplicateProfileSchema = z.object({
  profileId: z.number().positive(),
  newSlug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
});

// Component-specific settings schemas
export const buttonComponentSettingsSchema = z.object({
  buttonStyle: z.enum(['filled', 'outlined', 'ghost']).default('filled'),
  borderRadius: z.number().min(0).max(50).default(8),
  icon: z.string().optional(),
});

export const textComponentSettingsSchema = z.object({
  fontSize: z.enum(['sm', 'base', 'lg', 'xl', '2xl']).default('base'),
  fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

export const imageComponentSettingsSchema = z.object({
  width: z.number().min(50).max(500).default(200),
  height: z.number().min(50).max(500).default(200),
  borderRadius: z.number().min(0).max(50).default(8),
  alt: z.string().max(255).default(''),
});

export const linkComponentSettingsSchema = z.object({
  showIcon: z.boolean().default(true),
  openInNewTab: z.boolean().default(true),
  underline: z.boolean().default(false),
});

// Social platform validation
export const socialPlatformsSchema = z.enum([
  'github',
  'linkedin',
  'twitter',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'discord',
  'telegram',
  'whatsapp',
  'email',
  'website',
]);

export const createSocialLinkWithPlatformSchema = createBiolinkSocialLinkSchema.extend({
  platform: socialPlatformsSchema,
});

export const updateSocialLinkWithPlatformSchema = updateBiolinkSocialLinkSchema.extend({
  platform: socialPlatformsSchema.optional(),
});

// Bulk operations schemas
export const bulkUpdateComponentsSchema = z.object({
  profileId: z.number().positive(),
  components: z.array(updateBiolinkComponentSchema),
});

export const reorderComponentsSchema = z.object({
  profileId: z.number().positive(),
  componentIds: z.array(z.number().positive()),
});

export const createVersionSchema = z.object({
  profileId: z.number().positive(),
  versionNumber: z.number().positive(),
});

// URL validation for custom slug
export const validateSlugSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
  excludeProfileId: z.number().positive().optional(),
}); 