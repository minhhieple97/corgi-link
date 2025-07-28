export type BiolinkStatus = 'draft' | 'public';

export type ComponentType = 
  | 'button'
  | 'text'
  | 'image'
  | 'link'
  | 'social-links'
  | 'projects'
  | 'contact-form'
  | 'divider';

export type BiolinkProfile = {
  id: number;
  userId: string;
  slug: string;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  career: string | null;
  location: string | null;
  status: BiolinkStatus;
  backgroundColor: string | null;
  textColor: string | null;
  accentColor: string | null;
  customCss: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BiolinkComponent = {
  id: number;
  profileId: number;
  type: ComponentType;
  title: string | null;
  content: string | null;
  url: string | null;
  imageUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  borderColor: string | null;
  order: number;
  isVisible: boolean;
  settings: string | null; // JSON string
  createdAt: Date;
  updatedAt: Date;
};

export type BiolinkSocialLink = {
  id: number;
  profileId: number;
  platform: string;
  url: string;
  username: string | null;
  isVisible: boolean;
  order: number;
  createdAt: Date;
};

export type BiolinkProject = {
  id: number;
  profileId: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  technologies: string | null; // JSON array
  isVisible: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BiolinkVersion = {
  id: number;
  profileId: number;
  versionNumber: number;
  data: string; // JSON snapshot
  createdAt: Date;
};

// Input types for creating/updating
export type CreateBiolinkProfileInput = {
  slug: string;
  title?: string;
  bio?: string;
  avatar?: string;
  career?: string;
  location?: string;
  status?: BiolinkStatus;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  customCss?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type UpdateBiolinkProfileInput = Partial<CreateBiolinkProfileInput> & {
  id: number;
};

export type CreateBiolinkComponentInput = {
  profileId: number;
  type: ComponentType;
  title?: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  order: number;
  isVisible?: boolean;
  settings?: Record<string, any>;
};

export type UpdateBiolinkComponentInput = Partial<CreateBiolinkComponentInput> & {
  id: number;
};

export type CreateBiolinkSocialLinkInput = {
  profileId: number;
  platform: string;
  url: string;
  username?: string;
  isVisible?: boolean;
  order: number;
};

export type UpdateBiolinkSocialLinkInput = Partial<CreateBiolinkSocialLinkInput> & {
  id: number;
};

export type CreateBiolinkProjectInput = {
  profileId: number;
  title: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  isVisible?: boolean;
  isFeatured?: boolean;
  order: number;
};

export type UpdateBiolinkProjectInput = Partial<CreateBiolinkProjectInput> & {
  id: number;
};

// Complete profile with relations
export type BiolinkProfileWithRelations = BiolinkProfile & {
  components: BiolinkComponent[];
  socialLinks: BiolinkSocialLink[];
  projects: BiolinkProject[];
  versions?: BiolinkVersion[];
};

// Component settings types
export type ButtonComponentSettings = {
  buttonStyle: 'filled' | 'outlined' | 'ghost';
  borderRadius: number;
  icon?: string;
};

export type TextComponentSettings = {
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign: 'left' | 'center' | 'right';
};

export type ImageComponentSettings = {
  width: number;
  height: number;
  borderRadius: number;
  alt: string;
};

export type LinkComponentSettings = {
  showIcon: boolean;
  openInNewTab: boolean;
  underline: boolean;
};

export type ComponentSettings = 
  | ButtonComponentSettings
  | TextComponentSettings
  | ImageComponentSettings
  | LinkComponentSettings
  | Record<string, any>;

// Page builder types
export type DraggedComponent = {
  type: ComponentType;
  id: string;
  tempId?: string;
};

export type PageBuilderState = {
  components: BiolinkComponent[];
  selectedComponent: BiolinkComponent | null;
  isDragging: boolean;
  draggedComponent: DraggedComponent | null;
}; 