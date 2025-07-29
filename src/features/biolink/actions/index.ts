'use server';

import { revalidatePath } from 'next/cache';
import { ActionError, authAction } from '@/lib/safe-action';
import { routes } from '@/routes';
import { biolinkService } from '../services';
import {
  getBiolinkComponent,
  getBiolinkSocialLink,
  getBiolinkProject,
} from '../queries';
import {
  createBiolinkProfileSchema,
  updateBiolinkProfileSchema,
  createBiolinkComponentSchema,
  updateBiolinkComponentSchema,
  createSocialLinkWithPlatformSchema,
  updateSocialLinkWithPlatformSchema,
  createBiolinkProjectSchema,
  updateBiolinkProjectSchema,
  publishProfileSchema,
  duplicateProfileSchema,
  reorderComponentsSchema,
  validateSlugSchema,
} from '../schemas';
import { z } from 'zod';

// Profile actions
export const createBiolinkProfileAction = authAction
  .schema(createBiolinkProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    const result = await biolinkService.createProfile(user.id, parsedInput);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to create profile');
    }

    revalidatePath(routes.biolink.root);
    revalidatePath(routes.dashboard.root);

    return {
      success: true,
      profile: result.profile,
    };
  });

export const updateBiolinkProfileAction = authAction
  .schema(updateBiolinkProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { id, ...updateData } = parsedInput;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(id);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to edit it",
      );
    }

    const result = await biolinkService.updateProfile(id, updateData);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to update profile');
    }

    revalidatePath(routes.biolink.root);
    revalidatePath(routes.biolink.edit(id));
    revalidatePath(routes.biolink.builder(id));
    if (result.profile?.slug) {
      revalidatePath(routes.profile(result.profile.slug));
    }

    return {
      success: true,
      profile: result.profile,
    };
  });

export const deleteBiolinkProfileAction = authAction
  .schema(z.object({ id: z.number().positive() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(id);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to delete it",
      );
    }

    const result = await biolinkService.deleteProfile(id);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to delete profile');
    }

    revalidatePath(routes.biolink.root);
    revalidatePath(routes.dashboard.root);
    if (profile.slug) {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      id,
    };
  });

export const publishBiolinkProfileAction = authAction
  .schema(publishProfileSchema)
  .action(async ({ parsedInput: { profileId, status }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to publish it",
      );
    }

    const result = await biolinkService.publishProfile(profileId, status);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to publish profile');
    }

    revalidatePath(routes.biolink.root);
    revalidatePath(routes.biolink.edit(profileId));
    if (result.profile?.slug) {
      revalidatePath(routes.profile(result.profile.slug));
    }

    return {
      success: true,
      profile: result.profile,
    };
  });

export const duplicateBiolinkProfileAction = authAction
  .schema(duplicateProfileSchema)
  .action(async ({ parsedInput: { profileId, newSlug }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to duplicate it",
      );
    }

    const result = await biolinkService.duplicateProfile(profileId, newSlug);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to duplicate profile');
    }

    revalidatePath(routes.biolink.root);

    return {
      success: true,
      profile: result.profile,
    };
  });

// Component actions
export const createBiolinkComponentAction = authAction
  .schema(createBiolinkComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(parsedInput.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to add components",
      );
    }

    const result = await biolinkService.addComponent(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to add component');
    }

    revalidatePath(routes.biolink.builder(parsedInput.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      component: result.component,
    };
  });

export const updateBiolinkComponentAction = authAction
  .schema(updateBiolinkComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { id, ...updateData } = parsedInput;

    // Get the component and check ownership through profile
    const component = await getBiolinkComponent(id);
    if (!component) {
      throw new ActionError('Component not found');
    }

    const profile = await biolinkService.getProfileById(component.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError("You don't have permission to edit this component");
    }

    const result = await biolinkService.updateComponent(id, updateData);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to update component');
    }

    revalidatePath(routes.biolink.builder(component.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      component: result.component,
    };
  });

export const deleteBiolinkComponentAction = authAction
  .schema(z.object({ id: z.number().positive() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const { user } = ctx;

    // Get the component and check ownership through profile
    const component = await getBiolinkComponent(id);
    if (!component) {
      throw new ActionError('Component not found');
    }

    const profile = await biolinkService.getProfileById(component.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "You don't have permission to delete this component",
      );
    }

    const result = await biolinkService.deleteComponent(id);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to delete component');
    }

    revalidatePath(routes.biolink.builder(component.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      id,
    };
  });

export const reorderBiolinkComponentsAction = authAction
  .schema(reorderComponentsSchema)
  .action(async ({ parsedInput: { profileId, componentIds }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError("You don't have permission to reorder components");
    }

    const result = await biolinkService.reorderComponents(
      profileId,
      componentIds,
    );

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to reorder components');
    }

    revalidatePath(routes.biolink.builder(profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
    };
  });

// Social link actions
export const createBiolinkSocialLinkAction = authAction
  .schema(createSocialLinkWithPlatformSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(parsedInput.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to add social links",
      );
    }

    const result = await biolinkService.addSocialLink(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to add social link');
    }

    revalidatePath(routes.biolink.builder(parsedInput.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      socialLink: result.socialLink,
    };
  });

export const updateBiolinkSocialLinkAction = authAction
  .schema(updateSocialLinkWithPlatformSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { id, ...updateData } = parsedInput;

    // Get the social link and check ownership through profile
    const socialLink = await getBiolinkSocialLink(id);
    if (!socialLink) {
      throw new ActionError('Social link not found');
    }

    const profile = await biolinkService.getProfileById(socialLink.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "You don't have permission to edit this social link",
      );
    }

    const result = await biolinkService.updateSocialLink(id, updateData);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to update social link');
    }

    revalidatePath(routes.biolink.builder(socialLink.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      socialLink: result.socialLink,
    };
  });

export const deleteBiolinkSocialLinkAction = authAction
  .schema(z.object({ id: z.number().positive() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const { user } = ctx;

    // Get the social link and check ownership through profile
    const socialLink = await getBiolinkSocialLink(id);
    if (!socialLink) {
      throw new ActionError('Social link not found');
    }

    const profile = await biolinkService.getProfileById(socialLink.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "You don't have permission to delete this social link",
      );
    }

    const result = await biolinkService.deleteSocialLink(id);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to delete social link');
    }

    revalidatePath(routes.biolink.builder(socialLink.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      id,
    };
  });

// Project actions
export const createBiolinkProjectAction = authAction
  .schema(createBiolinkProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(parsedInput.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to add projects",
      );
    }

    const result = await biolinkService.addProject(parsedInput);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to add project');
    }

    revalidatePath(routes.biolink.builder(parsedInput.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      project: result.project,
    };
  });

export const updateBiolinkProjectAction = authAction
  .schema(updateBiolinkProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { id, ...updateData } = parsedInput;

    // Get the project and check ownership through profile
    const project = await getBiolinkProject(id);
    if (!project) {
      throw new ActionError('Project not found');
    }

    const profile = await biolinkService.getProfileById(project.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError("You don't have permission to edit this project");
    }

    const result = await biolinkService.updateProject(id, updateData);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to update project');
    }

    revalidatePath(routes.biolink.builder(project.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      project: result.project,
    };
  });

export const deleteBiolinkProjectAction = authAction
  .schema(z.object({ id: z.number().positive() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const { user } = ctx;

    // Get the project and check ownership through profile
    const project = await getBiolinkProject(id);
    if (!project) {
      throw new ActionError('Project not found');
    }

    const profile = await biolinkService.getProfileById(project.profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError("You don't have permission to delete this project");
    }

    const result = await biolinkService.deleteProject(id);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to delete project');
    }

    revalidatePath(routes.biolink.builder(project.profileId));
    if (profile.slug && profile.status === 'public') {
      revalidatePath(routes.profile(profile.slug));
    }

    return {
      success: true,
      id,
    };
  });

// Version actions
export const saveBiolinkVersionAction = authAction
  .schema(z.object({ profileId: z.number().positive() }))
  .action(async ({ parsedInput: { profileId }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to save versions",
      );
    }

    const result = await biolinkService.saveVersion(profileId);

    if (!result.success) {
      throw new ActionError(result.error || 'Failed to save version');
    }

    revalidatePath(routes.biolink.builder(profileId));

    return {
      success: true,
      version: result.version,
    };
  });

// Utility actions
// Preview action
export const previewBiolinkProfileAction = authAction
  .schema(z.object({ profileId: z.number().positive() }))
  .action(async ({ parsedInput: { profileId }, ctx }) => {
    const { user } = ctx;

    // Check if user owns the profile
    const profile = await biolinkService.getProfileById(profileId);
    if (!profile || profile.userId !== user.id) {
      throw new ActionError(
        "Profile not found or you don't have permission to preview it",
      );
    }

    return {
      success: true,
      previewUrl: routes.biolink.preview(profile.slug),
    };
  });

export const validateBiolinkSlugAction = authAction
  .schema(validateSlugSchema)
  .action(async ({ parsedInput: { slug, excludeProfileId } }) => {
    const result = await biolinkService.validateSlug(slug, excludeProfileId);

    return {
      isValid: result.isValid,
      isAvailable: result.isAvailable,
      error: result.error,
    };
  });
