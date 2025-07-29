'use server';

import { db } from '@/db';
import {
  biolinkProfiles,
  biolinkComponents,
  biolinkSocialLinks,
  biolinkProjects,
  biolinkVersions,
} from '@/db/schema';
import { eq, and, desc, asc, count, sql } from 'drizzle-orm';
import { PAGINATION } from '@/constants';
import type {
  BiolinkProfile,
  BiolinkProfileWithRelations,
  BiolinkComponent,
  BiolinkSocialLink,
  BiolinkProject,
  BiolinkVersion,
  CreateBiolinkProfileInput,
  CreateBiolinkComponentInput,
  CreateBiolinkSocialLinkInput,
  CreateBiolinkProjectInput,
  UpdateBiolinkProfileInput,
  UpdateBiolinkComponentInput,
  UpdateBiolinkSocialLinkInput,
  UpdateBiolinkProjectInput,
} from '../types';

// Profile queries
export const getBiolinkProfileBySlug = async (
  slug: string,
): Promise<BiolinkProfileWithRelations | null> => {
  const profile = await db.query.biolinkProfiles.findFirst({
    where: eq(biolinkProfiles.slug, slug),
    with: {
      components: {
        where: eq(biolinkComponents.isVisible, true),
        orderBy: [asc(biolinkComponents.order)],
      },
      socialLinks: {
        where: eq(biolinkSocialLinks.isVisible, true),
        orderBy: [asc(biolinkSocialLinks.order)],
      },
      projects: {
        where: eq(biolinkProjects.isVisible, true),
        orderBy: [asc(biolinkProjects.order)],
      },
    },
  });

  return profile || null;
};

export const getBiolinkProfileById = async (
  id: number,
): Promise<BiolinkProfileWithRelations | null> => {
  const profile = await db.query.biolinkProfiles.findFirst({
    where: eq(biolinkProfiles.id, id),
    with: {
      components: {
        orderBy: [asc(biolinkComponents.order)],
      },
      socialLinks: {
        orderBy: [asc(biolinkSocialLinks.order)],
      },
      projects: {
        orderBy: [asc(biolinkProjects.order)],
      },
      versions: {
        orderBy: [desc(biolinkVersions.createdAt)],
        limit: 10, // Last 10 versions
      },
    },
  });

  return profile || null;
};

export const getUserBiolinkProfiles = async (
  userId: string,
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT,
) => {
  const offset = (page - PAGINATION.MIN_PAGE) * limit;

  const [totalResult] = await db
    .select({ count: count() })
    .from(biolinkProfiles)
    .where(eq(biolinkProfiles.userId, userId));

  const total = totalResult.count;

  const profiles = await db.query.biolinkProfiles.findMany({
    where: eq(biolinkProfiles.userId, userId),
    orderBy: [desc(biolinkProfiles.updatedAt)],
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > PAGINATION.MIN_PAGE,
    },
  };
};

export const checkSlugAvailability = async (
  slug: string,
  excludeProfileId?: number,
): Promise<boolean> => {
  const conditions = [eq(biolinkProfiles.slug, slug)];

  if (excludeProfileId) {
    conditions.push(sql`${biolinkProfiles.id} != ${excludeProfileId}`);
  }

  const existingProfile = await db.query.biolinkProfiles.findFirst({
    where: and(...conditions),
  });

  return !existingProfile;
};

export const createBiolinkProfile = async (
  userId: string,
  data: CreateBiolinkProfileInput,
): Promise<BiolinkProfile> => {
  const [newProfile] = await db
    .insert(biolinkProfiles)
    .values({ ...data, userId })
    .returning();

  return newProfile;
};

export const updateBiolinkProfile = async (
  id: number,
  data: Partial<UpdateBiolinkProfileInput>,
): Promise<BiolinkProfile | null> => {
  const [updatedProfile] = await db
    .update(biolinkProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(biolinkProfiles.id, id))
    .returning();

  return updatedProfile || null;
};

export const deleteBiolinkProfile = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(biolinkProfiles)
    .where(eq(biolinkProfiles.id, id));

  return result.length > 0;
};

// Component queries
export const getBiolinkComponent = async (
  id: number,
): Promise<BiolinkComponent | null> => {
  const component = await db.query.biolinkComponents.findFirst({
    where: eq(biolinkComponents.id, id),
  });

  return component || null;
};

export const getBiolinkSocialLink = async (
  id: number,
): Promise<BiolinkSocialLink | null> => {
  const socialLink = await db.query.biolinkSocialLinks.findFirst({
    where: eq(biolinkSocialLinks.id, id),
  });

  return socialLink || null;
};

export const getBiolinkProject = async (
  id: number,
): Promise<BiolinkProject | null> => {
  const project = await db.query.biolinkProjects.findFirst({
    where: eq(biolinkProjects.id, id),
  });

  return project || null;
};

export const createBiolinkComponent = async (
  data: CreateBiolinkComponentInput,
): Promise<BiolinkComponent> => {
  // Convert settings object to JSON string if provided
  const componentData = {
    ...data,
    settings: data.settings ? JSON.stringify(data.settings) : null,
  };

  const [newComponent] = await db
    .insert(biolinkComponents)
    .values(componentData)
    .returning();

  return newComponent;
};

export const updateBiolinkComponent = async (
  id: number,
  data: Partial<UpdateBiolinkComponentInput>,
): Promise<BiolinkComponent | null> => {
  const updateData = {
    ...data,
    settings: data.settings ? JSON.stringify(data.settings) : undefined,
    updatedAt: new Date(),
  };

  const [updatedComponent] = await db
    .update(biolinkComponents)
    .set(updateData)
    .where(eq(biolinkComponents.id, id))
    .returning();

  return updatedComponent || null;
};

export const deleteBiolinkComponent = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(biolinkComponents)
    .where(eq(biolinkComponents.id, id));

  return result.length > 0;
};

export const reorderBiolinkComponents = async (
  profileId: number,
  componentIds: number[],
): Promise<boolean> => {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < componentIds.length; i++) {
        await tx
          .update(biolinkComponents)
          .set({ order: i, updatedAt: new Date() })
          .where(
            and(
              eq(biolinkComponents.id, componentIds[i]),
              eq(biolinkComponents.profileId, profileId),
            ),
          );
      }
    });
    return true;
  } catch (error) {
    console.error('Error reordering components:', error);
    return false;
  }
};

// Social Links queries
export const createBiolinkSocialLink = async (
  data: CreateBiolinkSocialLinkInput,
): Promise<BiolinkSocialLink> => {
  const [newSocialLink] = await db
    .insert(biolinkSocialLinks)
    .values(data)
    .returning();

  return newSocialLink;
};

export const updateBiolinkSocialLink = async (
  id: number,
  data: Partial<UpdateBiolinkSocialLinkInput>,
): Promise<BiolinkSocialLink | null> => {
  const [updatedSocialLink] = await db
    .update(biolinkSocialLinks)
    .set(data)
    .where(eq(biolinkSocialLinks.id, id))
    .returning();

  return updatedSocialLink || null;
};

export const deleteBiolinkSocialLink = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(biolinkSocialLinks)
    .where(eq(biolinkSocialLinks.id, id));

  return result.length > 0;
};

// Project queries
export const createBiolinkProject = async (
  data: CreateBiolinkProjectInput,
): Promise<BiolinkProject> => {
  const projectData = {
    ...data,
    technologies: data.technologies ? JSON.stringify(data.technologies) : null,
  };

  const [newProject] = await db
    .insert(biolinkProjects)
    .values(projectData)
    .returning();

  return newProject;
};

export const updateBiolinkProject = async (
  id: number,
  data: Partial<UpdateBiolinkProjectInput>,
): Promise<BiolinkProject | null> => {
  const updateData = {
    ...data,
    technologies: data.technologies
      ? JSON.stringify(data.technologies)
      : undefined,
    updatedAt: new Date(),
  };

  const [updatedProject] = await db
    .update(biolinkProjects)
    .set(updateData)
    .where(eq(biolinkProjects.id, id))
    .returning();

  return updatedProject || null;
};

export const deleteBiolinkProject = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(biolinkProjects)
    .where(eq(biolinkProjects.id, id));

  return result.length > 0;
};

// Version queries
export const createBiolinkVersion = async (
  profileId: number,
  data: string,
): Promise<BiolinkVersion> => {
  // Get the next version number
  const [latestVersion] = await db
    .select({ versionNumber: biolinkVersions.versionNumber })
    .from(biolinkVersions)
    .where(eq(biolinkVersions.profileId, profileId))
    .orderBy(desc(biolinkVersions.versionNumber))
    .limit(1);

  const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

  const [newVersion] = await db
    .insert(biolinkVersions)
    .values({
      profileId,
      versionNumber: nextVersionNumber,
      data,
    })
    .returning();

  return newVersion;
};

export const getBiolinkVersions = async (
  profileId: number,
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT,
) => {
  const offset = (page - PAGINATION.MIN_PAGE) * limit;

  const [totalResult] = await db
    .select({ count: count() })
    .from(biolinkVersions)
    .where(eq(biolinkVersions.profileId, profileId));

  const total = totalResult.count;

  const versions = await db.query.biolinkVersions.findMany({
    where: eq(biolinkVersions.profileId, profileId),
    orderBy: [desc(biolinkVersions.createdAt)],
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    versions,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > PAGINATION.MIN_PAGE,
    },
  };
};

// Public profile queries (for published profiles only)
export const getPublicBiolinkProfile = async (
  slug: string,
): Promise<BiolinkProfileWithRelations | null> => {
  const profile = await db.query.biolinkProfiles.findFirst({
    where: and(
      eq(biolinkProfiles.slug, slug),
      eq(biolinkProfiles.status, 'public'),
    ),
    with: {
      components: {
        where: eq(biolinkComponents.isVisible, true),
        orderBy: [asc(biolinkComponents.order)],
      },
      socialLinks: {
        where: eq(biolinkSocialLinks.isVisible, true),
        orderBy: [asc(biolinkSocialLinks.order)],
      },
      projects: {
        where: eq(biolinkProjects.isVisible, true),
        orderBy: [asc(biolinkProjects.order)],
      },
    },
  });

  return profile || null;
};

// Search and discovery
export const searchPublicBiolinkProfiles = async (
  query: string,
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT,
) => {
  const offset = (page - PAGINATION.MIN_PAGE) * limit;
  const searchTerm = `%${query}%`;

  const [totalResult] = await db
    .select({ count: count() })
    .from(biolinkProfiles)
    .where(
      and(
        eq(biolinkProfiles.status, 'public'),
        sql`(
          ${biolinkProfiles.title} ILIKE ${searchTerm} OR 
          ${biolinkProfiles.bio} ILIKE ${searchTerm} OR 
          ${biolinkProfiles.career} ILIKE ${searchTerm}
        )`,
      ),
    );

  const total = totalResult.count;

  const profiles = await db
    .select({
      id: biolinkProfiles.id,
      slug: biolinkProfiles.slug,
      title: biolinkProfiles.title,
      bio: biolinkProfiles.bio,
      avatar: biolinkProfiles.avatar,
      career: biolinkProfiles.career,
      location: biolinkProfiles.location,
      createdAt: biolinkProfiles.createdAt,
    })
    .from(biolinkProfiles)
    .where(
      and(
        eq(biolinkProfiles.status, 'public'),
        sql`(
          ${biolinkProfiles.title} ILIKE ${searchTerm} OR 
          ${biolinkProfiles.bio} ILIKE ${searchTerm} OR 
          ${biolinkProfiles.career} ILIKE ${searchTerm}
        )`,
      ),
    )
    .orderBy(desc(biolinkProfiles.updatedAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(total / limit);

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > PAGINATION.MIN_PAGE,
    },
  };
};
