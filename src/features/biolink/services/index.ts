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

import {
  getBiolinkProfileBySlug,
  getBiolinkProfileById,
  getUserBiolinkProfiles,
  checkSlugAvailability,
  createBiolinkProfile,
  updateBiolinkProfile,
  deleteBiolinkProfile,
  getBiolinkComponent,
  getBiolinkSocialLink,
  getBiolinkProject,
  createBiolinkComponent,
  updateBiolinkComponent,
  deleteBiolinkComponent,
  reorderBiolinkComponents,
  createBiolinkSocialLink,
  updateBiolinkSocialLink,
  deleteBiolinkSocialLink,
  createBiolinkProject,
  updateBiolinkProject,
  deleteBiolinkProject,
  createBiolinkVersion,
  getBiolinkVersions,
  getPublicBiolinkProfile,
  searchPublicBiolinkProfiles,
} from '../queries';

export const biolinkService = {
  // Profile management
  async getUserProfiles(userId: string, page?: number, limit?: number) {
    return await getUserBiolinkProfiles(userId, page, limit);
  },

  async getProfileBySlug(slug: string): Promise<BiolinkProfileWithRelations | null> {
    return await getBiolinkProfileBySlug(slug);
  },

  async getProfileById(id: number): Promise<BiolinkProfileWithRelations | null> {
    return await getBiolinkProfileById(id);
  },

  async getPublicProfile(slug: string): Promise<BiolinkProfileWithRelations | null> {
    return await getPublicBiolinkProfile(slug);
  },

  async createProfile(userId: string, data: CreateBiolinkProfileInput): Promise<{
    success: boolean;
    profile?: BiolinkProfile;
    error?: string;
  }> {
    try {
      // Check if slug is available
      const isSlugAvailable = await checkSlugAvailability(data.slug);
      if (!isSlugAvailable) {
        return {
          success: false,
          error: 'This URL is already taken. Please choose a different one.',
        };
      }

      // Create the profile
      const profile = await createBiolinkProfile(userId, data);

      // Create initial version
      const profileData = JSON.stringify({
        profile,
        components: [],
        socialLinks: [],
        projects: [],
      });
      await createBiolinkVersion(profile.id, profileData);

      return {
        success: true,
        profile,
      };
    } catch (error) {
      console.error('Error creating biolink profile:', error);
      return {
        success: false,
        error: 'Failed to create profile. Please try again.',
      };
    }
  },

  async updateProfile(id: number, data: Partial<UpdateBiolinkProfileInput>): Promise<{
    success: boolean;
    profile?: BiolinkProfile;
    error?: string;
  }> {
    try {
      // If updating slug, check availability
      if (data.slug) {
        const isSlugAvailable = await checkSlugAvailability(data.slug, id);
        if (!isSlugAvailable) {
          return {
            success: false,
            error: 'This URL is already taken. Please choose a different one.',
          };
        }
      }

      const profile = await updateBiolinkProfile(id, data);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found.',
        };
      }

      return {
        success: true,
        profile,
      };
    } catch (error) {
      console.error('Error updating biolink profile:', error);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    }
  },

  async deleteProfile(id: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const success = await deleteBiolinkProfile(id);
      if (!success) {
        return {
          success: false,
          error: 'Profile not found.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting biolink profile:', error);
      return {
        success: false,
        error: 'Failed to delete profile. Please try again.',
      };
    }
  },

  async publishProfile(id: number, status: 'draft' | 'public'): Promise<{
    success: boolean;
    profile?: BiolinkProfile;
    error?: string;
  }> {
    try {
      const profile = await updateBiolinkProfile(id, { status });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found.',
        };
      }

      // If publishing, create a new version
      if (status === 'public') {
        const fullProfile = await getBiolinkProfileById(id);
        if (fullProfile) {
          const profileData = JSON.stringify(fullProfile);
          await createBiolinkVersion(id, profileData);
        }
      }

      return {
        success: true,
        profile,
      };
    } catch (error) {
      console.error('Error publishing biolink profile:', error);
      return {
        success: false,
        error: 'Failed to publish profile. Please try again.',
      };
    }
  },

  async duplicateProfile(profileId: number, newSlug: string): Promise<{
    success: boolean;
    profile?: BiolinkProfile;
    error?: string;
  }> {
    try {
      // Check if new slug is available
      const isSlugAvailable = await checkSlugAvailability(newSlug);
      if (!isSlugAvailable) {
        return {
          success: false,
          error: 'This URL is already taken. Please choose a different one.',
        };
      }

      // Get the original profile with all data
      const originalProfile = await getBiolinkProfileById(profileId);
      if (!originalProfile) {
        return {
          success: false,
          error: 'Original profile not found.',
        };
      }

      // Create new profile
      const newProfileData: CreateBiolinkProfileInput = {
        slug: newSlug,
        title: originalProfile.title ? `${originalProfile.title} (Copy)` : undefined,
        bio: originalProfile.bio || undefined,
        avatar: originalProfile.avatar || undefined,
        career: originalProfile.career || undefined,
        location: originalProfile.location || undefined,
        backgroundColor: originalProfile.backgroundColor || undefined,
        textColor: originalProfile.textColor || undefined,
        accentColor: originalProfile.accentColor || undefined,
        customCss: originalProfile.customCss || undefined,
        metaTitle: originalProfile.metaTitle || undefined,
        metaDescription: originalProfile.metaDescription || undefined,
      };

      const newProfile = await createBiolinkProfile(originalProfile.userId, newProfileData);

      // Duplicate components
      for (const component of originalProfile.components) {
        await createBiolinkComponent({
          profileId: newProfile.id,
          type: component.type,
          title: component.title || undefined,
          content: component.content || undefined,
          url: component.url || undefined,
          imageUrl: component.imageUrl || undefined,
          backgroundColor: component.backgroundColor || undefined,
          textColor: component.textColor || undefined,
          borderColor: component.borderColor || undefined,
          order: component.order,
          isVisible: component.isVisible,
          settings: component.settings ? JSON.parse(component.settings) : undefined,
        });
      }

      // Duplicate social links
      for (const socialLink of originalProfile.socialLinks) {
        await createBiolinkSocialLink({
          profileId: newProfile.id,
          platform: socialLink.platform,
          url: socialLink.url,
          username: socialLink.username || undefined,
          isVisible: socialLink.isVisible,
          order: socialLink.order,
        });
      }

      // Duplicate projects
      for (const project of originalProfile.projects) {
        await createBiolinkProject({
          profileId: newProfile.id,
          title: project.title,
          description: project.description || undefined,
          imageUrl: project.imageUrl || undefined,
          projectUrl: project.projectUrl || undefined,
          githubUrl: project.githubUrl || undefined,
          technologies: project.technologies ? JSON.parse(project.technologies) : undefined,
          isVisible: project.isVisible,
          isFeatured: project.isFeatured,
          order: project.order,
        });
      }

      return {
        success: true,
        profile: newProfile,
      };
    } catch (error) {
      console.error('Error duplicating biolink profile:', error);
      return {
        success: false,
        error: 'Failed to duplicate profile. Please try again.',
      };
    }
  },

  // Component management
  async getBiolinkComponent(id: number): Promise<BiolinkComponent | null> {
    return await getBiolinkComponent(id);
  },

  async addComponent(data: CreateBiolinkComponentInput): Promise<{
    success: boolean;
    component?: BiolinkComponent;
    error?: string;
  }> {
    try {
      const component = await createBiolinkComponent(data);
      return {
        success: true,
        component,
      };
    } catch (error) {
      console.error('Error adding biolink component:', error);
      return {
        success: false,
        error: 'Failed to add component. Please try again.',
      };
    }
  },

  async updateComponent(id: number, data: Partial<UpdateBiolinkComponentInput>): Promise<{
    success: boolean;
    component?: BiolinkComponent;
    error?: string;
  }> {
    try {
      const component = await updateBiolinkComponent(id, data);
      if (!component) {
        return {
          success: false,
          error: 'Component not found.',
        };
      }

      return {
        success: true,
        component,
      };
    } catch (error) {
      console.error('Error updating biolink component:', error);
      return {
        success: false,
        error: 'Failed to update component. Please try again.',
      };
    }
  },

  async deleteComponent(id: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const success = await deleteBiolinkComponent(id);
      if (!success) {
        return {
          success: false,
          error: 'Component not found.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting biolink component:', error);
      return {
        success: false,
        error: 'Failed to delete component. Please try again.',
      };
    }
  },

  async reorderComponents(profileId: number, componentIds: number[]): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const success = await reorderBiolinkComponents(profileId, componentIds);
      if (!success) {
        return {
          success: false,
          error: 'Failed to reorder components.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error reordering biolink components:', error);
      return {
        success: false,
        error: 'Failed to reorder components. Please try again.',
      };
    }
  },

  // Social links management
  async getBiolinkSocialLink(id: number): Promise<BiolinkSocialLink | null> {
    return await getBiolinkSocialLink(id);
  },

  async addSocialLink(data: CreateBiolinkSocialLinkInput): Promise<{
    success: boolean;
    socialLink?: BiolinkSocialLink;
    error?: string;
  }> {
    try {
      const socialLink = await createBiolinkSocialLink(data);
      return {
        success: true,
        socialLink,
      };
    } catch (error) {
      console.error('Error adding biolink social link:', error);
      return {
        success: false,
        error: 'Failed to add social link. Please try again.',
      };
    }
  },

  async updateSocialLink(id: number, data: Partial<UpdateBiolinkSocialLinkInput>): Promise<{
    success: boolean;
    socialLink?: BiolinkSocialLink;
    error?: string;
  }> {
    try {
      const socialLink = await updateBiolinkSocialLink(id, data);
      if (!socialLink) {
        return {
          success: false,
          error: 'Social link not found.',
        };
      }

      return {
        success: true,
        socialLink,
      };
    } catch (error) {
      console.error('Error updating biolink social link:', error);
      return {
        success: false,
        error: 'Failed to update social link. Please try again.',
      };
    }
  },

  async deleteSocialLink(id: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const success = await deleteBiolinkSocialLink(id);
      if (!success) {
        return {
          success: false,
          error: 'Social link not found.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting biolink social link:', error);
      return {
        success: false,
        error: 'Failed to delete social link. Please try again.',
      };
    }
  },

  // Projects management
  async getBiolinkProject(id: number): Promise<BiolinkProject | null> {
    return await getBiolinkProject(id);
  },

  async addProject(data: CreateBiolinkProjectInput): Promise<{
    success: boolean;
    project?: BiolinkProject;
    error?: string;
  }> {
    try {
      const project = await createBiolinkProject(data);
      return {
        success: true,
        project,
      };
    } catch (error) {
      console.error('Error adding biolink project:', error);
      return {
        success: false,
        error: 'Failed to add project. Please try again.',
      };
    }
  },

  async updateProject(id: number, data: Partial<UpdateBiolinkProjectInput>): Promise<{
    success: boolean;
    project?: BiolinkProject;
    error?: string;
  }> {
    try {
      const project = await updateBiolinkProject(id, data);
      if (!project) {
        return {
          success: false,
          error: 'Project not found.',
        };
      }

      return {
        success: true,
        project,
      };
    } catch (error) {
      console.error('Error updating biolink project:', error);
      return {
        success: false,
        error: 'Failed to update project. Please try again.',
      };
    }
  },

  async deleteProject(id: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const success = await deleteBiolinkProject(id);
      if (!success) {
        return {
          success: false,
          error: 'Project not found.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting biolink project:', error);
      return {
        success: false,
        error: 'Failed to delete project. Please try again.',
      };
    }
  },

  // Version management
  async saveVersion(profileId: number): Promise<{
    success: boolean;
    version?: BiolinkVersion;
    error?: string;
  }> {
    try {
      const profile = await getBiolinkProfileById(profileId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found.',
        };
      }

      const profileData = JSON.stringify(profile);
      const version = await createBiolinkVersion(profileId, profileData);

      return {
        success: true,
        version,
      };
    } catch (error) {
      console.error('Error saving biolink version:', error);
      return {
        success: false,
        error: 'Failed to save version. Please try again.',
      };
    }
  },

  async getVersions(profileId: number, page?: number, limit?: number) {
    return await getBiolinkVersions(profileId, page, limit);
  },

  // Public features
  async searchProfiles(query: string, page?: number, limit?: number) {
    return await searchPublicBiolinkProfiles(query, page, limit);
  },

  async validateSlug(slug: string, excludeProfileId?: number): Promise<{
    isValid: boolean;
    isAvailable: boolean;
    error?: string;
  }> {
    try {
      // Validate slug format
      const slugRegex = /^[a-zA-Z0-9-_]+$/;
      if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 100) {
        return {
          isValid: false,
          isAvailable: false,
          error: 'Slug must be 3-100 characters and contain only letters, numbers, hyphens, and underscores.',
        };
      }

      // Check if slug is reserved
      const reservedSlugs = ['admin', 'api', 'www', 'app', 'dashboard', 'login', 'signup', 'terms', 'privacy'];
      if (reservedSlugs.includes(slug.toLowerCase())) {
        return {
          isValid: false,
          isAvailable: false,
          error: 'This URL is reserved and cannot be used.',
        };
      }

      // Check availability
      const isAvailable = await checkSlugAvailability(slug, excludeProfileId);

      return {
        isValid: true,
        isAvailable,
        error: !isAvailable ? 'This URL is already taken.' : undefined,
      };
    } catch (error) {
      console.error('Error validating slug:', error);
      return {
        isValid: false,
        isAvailable: false,
        error: 'Failed to validate URL. Please try again.',
      };
    }
  },
}; 