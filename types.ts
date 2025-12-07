
export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  group: string;
  tags: string[];
  websiteUrl: string;
  githubUrl?: string;
  pricing: 'Free' | 'Paid' | 'Freemium' | 'Open Source';
  stars?: number;
  featured?: boolean;
  logo: string;
  alternativeTo?: string;
  starsWeekly?: number;
  deal?: string;
  dealUrl?: string;
  license?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  toolCount: number;
}

export interface CategoryGroup {
  name: string;
  slug: string;
  categories: Category[];
}

export interface SubmissionForm {
  name: string;
  website: string;
  description: string;
  category: string;
  pricing: string;
  email: string;
}

export interface StackItem {
  id: string;
  category: string;
  toolId?: string;
}

export interface UserStack {
  id: string;
  name: string;
  items: StackItem[];
}

export interface LearningPath {
  id: string;
  title: string;
  count: string;
  color: string;
  icon: string;
  markdown?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
}

export interface StackSection {
  title: string;
  description?: string;
  toolIds: string[];
}

export interface TechStack {
  id: string;
  slug: string;
  name: string;
  description: string;
  lastUpdated: string;
  sections: StackSection[];
}

// --- HOMEPAGE SECTION TYPES ---

export interface AIToolSpotlight {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  logo: string;
  url?: string;
}

// NEW: AI Agents
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  tags: string[];
  logo: string;
  url?: string;
}

export interface GithubRepo {
  id: string;
  name: string;
  description: string;
  stars: string;
  language: string;
  url: string;
}

export interface CloudProvider {
  id: string;
  name: string;
  type: string;
  tier: string;
  logo: string;
  url?: string;
  features?: string[];
}

export interface SelfHostedTool {
  id: string;
  name: string;
  description: string;
  alternativeTo: string;
  logo: string;
  url?: string;
  license?: string;
}
