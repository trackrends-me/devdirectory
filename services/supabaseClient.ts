import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL || 'https://idnzxfsjebmjdoymorwj.supabase.co';
const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_5Fk2oWerYSnZSIz3fh34-w_sRWPBfBT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  return {
    error: true,
    message: error?.message || 'An error occurred'
  };
};
