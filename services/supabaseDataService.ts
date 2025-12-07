import { supabase } from './supabaseClient';
import { Tool, BlogPost, LearningPath, AIToolSpotlight, AIAgent, GithubRepo, CloudProvider, SelfHostedTool } from '../types';

/**
 * Supabase Data Service
 * Provides hybrid storage: tries Supabase first, falls back to localStorage
 */

// Helper function to transform snake_case from database to camelCase for Tool interface
const transformTool = (dbTool: any): Tool => ({
  id: dbTool.id,
  name: dbTool.name,
  description: dbTool.description,
  shortDescription: dbTool.short_description || dbTool.shortDescription,
  category: dbTool.category,
  group: dbTool.group,
  tags: dbTool.tags,
  websiteUrl: dbTool.website_url || dbTool.websiteUrl,
  githubUrl: dbTool.github_url || dbTool.githubUrl,
  pricing: dbTool.pricing,
  stars: dbTool.stars,
  featured: dbTool.featured,
  logo: dbTool.logo,
  alternativeTo: dbTool.alternative_to || dbTool.alternativeTo,
  starsWeekly: dbTool.stars_weekly || dbTool.starsWeekly,
  deal: dbTool.deal,
  dealUrl: dbTool.deal_url || dbTool.dealUrl,
  license: dbTool.license
});

// ... existing code ...
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('tools').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
};

// --- TOOLS TABLE ---
export const supabaseToolsService = {
  getAll: async (): Promise<Tool[]> => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformTool);
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Tool | null> => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data ? transformTool(data) : null;
    } catch (error) {
      console.error('Error fetching tool:', error);
      return null;
    }
  },

  add: async (tool: Tool): Promise<Tool | null> => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          id: tool.id,
          name: tool.name,
          description: tool.description,
          short_description: tool.shortDescription,
          category: tool.category,
          group: tool.group,
          tags: tool.tags,
          website_url: tool.websiteUrl,
          github_url: tool.githubUrl,
          pricing: tool.pricing,
          stars: tool.stars,
          featured: tool.featured,
          logo: tool.logo,
          alternative_to: tool.alternativeTo,
          stars_weekly: tool.starsWeekly,
          deal: tool.deal,
          deal_url: tool.dealUrl,
          license: tool.license,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data ? transformTool(data) : null;
    } catch (error) {
      console.error('Error adding tool:', error);
      return null;
    }
  },

  update: async (tool: Tool): Promise<Tool | null> => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .update({
          name: tool.name,
          description: tool.description,
          short_description: tool.shortDescription,
          category: tool.category,
          group: tool.group,
          tags: tool.tags,
          website_url: tool.websiteUrl,
          github_url: tool.githubUrl,
          pricing: tool.pricing,
          stars: tool.stars,
          featured: tool.featured,
          logo: tool.logo,
          alternative_to: tool.alternativeTo,
          stars_weekly: tool.starsWeekly,
          deal: tool.deal,
          deal_url: tool.dealUrl,
          license: tool.license,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id)
        .select()
        .single();
      
      if (error) throw error;
      return data ? transformTool(data) : null;
    } catch (error) {
      console.error('Error updating tool:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting tool:', error);
      return false;
    }
  }
};

// --- BLOG POSTS TABLE ---
export const supabaseBlogService = {
  getAll: async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  add: async (post: BlogPost): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          date: post.date,
          read_time: post.readTime,
          cover_image: post.coverImage,
          author: post.author,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          seo_keywords: post.seoKeywords,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as BlogPost || null;
    } catch (error) {
      console.error('Error adding blog post:', error);
      return null;
    }
  },

  update: async (post: BlogPost): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          date: post.date,
          read_time: post.readTime,
          cover_image: post.coverImage,
          author: post.author,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          seo_keywords: post.seoKeywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as BlogPost || null;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }
};

// --- LEARNING PATHS TABLE ---
export const supabaseLearningService = {
  getAll: async (): Promise<LearningPath[]> => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  },

  add: async (path: LearningPath): Promise<LearningPath | null> => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert([{
          id: path.id,
          title: path.title,
          count: path.count,
          color: path.color,
          icon: path.icon,
          markdown: path.markdown,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as LearningPath || null;
    } catch (error) {
      console.error('Error adding learning path:', error);
      return null;
    }
  },

  update: async (path: LearningPath): Promise<LearningPath | null> => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .update({
          title: path.title,
          count: path.count,
          color: path.color,
          icon: path.icon,
          markdown: path.markdown,
          updated_at: new Date().toISOString()
        })
        .eq('id', path.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as LearningPath || null;
    } catch (error) {
      console.error('Error updating learning path:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting learning path:', error);
      return false;
    }
  }
};

// --- USER BOOKMARKS TABLE ---
export const supabaseBookmarksService = {
  getBookmarks: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('tool_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.map(b => b.tool_id) || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  },

  addBookmark: async (userId: string, toolId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert([{ user_id: userId, tool_id: toolId }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  },

  removeBookmark: async (userId: string, toolId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('tool_id', toolId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  }
};
