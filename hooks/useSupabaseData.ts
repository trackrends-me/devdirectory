import { useState, useEffect } from 'react';
import { supabaseToolsService, supabaseBlogService, supabaseLearningService } from '../services/supabaseDataService';
import { Tool, BlogPost, LearningPath } from '../types';

/**
 * Custom hook for fetching data from Supabase with caching
 * Falls back to empty array if Supabase is unavailable
 */

export const useSupabaseTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const data = await supabaseToolsService.getAll();
        setTools(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tools');
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, loading, error };
};

export const useSupabaseBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await supabaseBlogService.getAll();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export const useSupabaseLearning = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        const data = await supabaseLearningService.getAll();
        setPaths(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching learning paths:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch paths');
        setPaths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  return { paths, loading, error };
};
