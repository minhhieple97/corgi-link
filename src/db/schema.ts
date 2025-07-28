import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  password: text('password'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: varchar('original_url', { length: 2000 }).notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  clicks: integer('clicks').default(0).notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, {
    onDelete: 'set null',
  }),
  flagged: boolean('flagged').default(false).notNull(),
  flagReason: text('flag_reason'),
  expiresAt: timestamp('expires_at'),
});

export const urlsRelations = relations(urls, ({ one }) => ({
  user: one(users, {
    fields: [urls.userId],
    references: [users.id],
  }),
}));

export const biolinkStatusEnum = pgEnum('biolink_status', ['draft', 'public']);
export const componentTypeEnum = pgEnum('component_type', [
  'button',
  'text',
  'image',
  'link',
  'social-links',
  'projects',
  'contact-form',
  'divider',
]);

export const biolinkProfiles = pgTable('biolink_profiles', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  bio: text('bio'),
  avatar: text('avatar'),
  career: varchar('career', { length: 255 }),
  location: varchar('location', { length: 255 }),
  status: biolinkStatusEnum('status').default('draft').notNull(),
  backgroundColor: varchar('background_color', { length: 7 }).default('#ffffff'),
  textColor: varchar('text_color', { length: 7 }).default('#000000'),
  accentColor: varchar('accent_color', { length: 7 }).default('#3b82f6'),
  customCss: text('custom_css'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const biolinkComponents = pgTable('biolink_components', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => biolinkProfiles.id, {
      onDelete: 'cascade',
    }),
  type: componentTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  url: varchar('url', { length: 500 }),
  imageUrl: text('image_url'),
  backgroundColor: varchar('background_color', { length: 7 }),
  textColor: varchar('text_color', { length: 7 }),
  borderColor: varchar('border_color', { length: 7 }),
  order: integer('order').notNull().default(0),
  isVisible: boolean('is_visible').default(true).notNull(),
  settings: text('settings'), // JSON string for additional component settings
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const biolinkSocialLinks = pgTable('biolink_social_links', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => biolinkProfiles.id, {
      onDelete: 'cascade',
    }),
  platform: varchar('platform', { length: 50 }).notNull(), // github, linkedin, twitter, etc.
  url: varchar('url', { length: 500 }).notNull(),
  username: varchar('username', { length: 100 }),
  isVisible: boolean('is_visible').default(true).notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const biolinkProjects = pgTable('biolink_projects', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => biolinkProfiles.id, {
      onDelete: 'cascade',
    }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  projectUrl: varchar('project_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  technologies: text('technologies'), // JSON array of tech stack
  isVisible: boolean('is_visible').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const biolinkVersions = pgTable('biolink_versions', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => biolinkProfiles.id, {
      onDelete: 'cascade',
    }),
  versionNumber: integer('version_number').notNull(),
  data: text('data').notNull(), // JSON snapshot of the entire profile
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls),
  biolinkProfiles: many(biolinkProfiles),
}));

export const biolinkProfilesRelations = relations(biolinkProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [biolinkProfiles.userId],
    references: [users.id],
  }),
  components: many(biolinkComponents),
  socialLinks: many(biolinkSocialLinks),
  projects: many(biolinkProjects),
  versions: many(biolinkVersions),
}));

export const biolinkComponentsRelations = relations(biolinkComponents, ({ one }) => ({
  profile: one(biolinkProfiles, {
    fields: [biolinkComponents.profileId],
    references: [biolinkProfiles.id],
  }),
}));

export const biolinkSocialLinksRelations = relations(biolinkSocialLinks, ({ one }) => ({
  profile: one(biolinkProfiles, {
    fields: [biolinkSocialLinks.profileId],
    references: [biolinkProfiles.id],
  }),
}));

export const biolinkProjectsRelations = relations(biolinkProjects, ({ one }) => ({
  profile: one(biolinkProfiles, {
    fields: [biolinkProjects.profileId],
    references: [biolinkProfiles.id],
  }),
}));

export const biolinkVersionsRelations = relations(biolinkVersions, ({ one }) => ({
  profile: one(biolinkProfiles, {
    fields: [biolinkVersions.profileId],
    references: [biolinkProfiles.id],
  }),
}));
