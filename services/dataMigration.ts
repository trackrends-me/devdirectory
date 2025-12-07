/**
 * Data Migration Helper
 * Use this to migrate data from localStorage to Supabase
 * 
 * Usage:
 * 1. Go to Admin Dashboard
 * 2. Open browser console (F12)
 * 3. Copy-paste the entire content of this file
 * 4. Run the migration function
 */

import { supabaseToolsService, supabaseBlogService, supabaseLearningService } from './services/supabaseDataService';

export const DataMigration = {
  /**
   * Export data from localStorage to JSON
   * Run in browser console and copy the output
   */
  exportFromLocalStorage: () => {
    const exportData = {
      tools: JSON.parse(localStorage.getItem('dd_tools_data_v52') || '[]'),
      blog: JSON.parse(localStorage.getItem('dd_blog_data_v52') || '[]'),
      learning: JSON.parse(localStorage.getItem('dd_learning_data_v52') || '[]'),
      aiSpotlight: JSON.parse(localStorage.getItem('dd_ai_spotlight_v52') || '[]'),
      aiAgents: JSON.parse(localStorage.getItem('dd_ai_agents_v52') || '[]'),
      github: JSON.parse(localStorage.getItem('dd_github_trending_v52') || '[]'),
      cloud: JSON.parse(localStorage.getItem('dd_cloud_providers_v52') || '[]'),
      selfHosted: JSON.parse(localStorage.getItem('dd_self_hosted_v52') || '[]'),
      categories: JSON.parse(localStorage.getItem('dd_categories_v52') || '[]'),
    };

    console.log('=== EXPORTED DATA ===');
    console.log(JSON.stringify(exportData, null, 2));
    console.log('=== END EXPORT ===');
    console.log('Copy the data above and use import functions below');

    return exportData;
  },

  /**
   * Migrate tools from localStorage to Supabase
   * Call: await DataMigration.migrateTools()
   */
  migrateTools: async () => {
    try {
      console.log('Starting tools migration...');
      const tools = JSON.parse(localStorage.getItem('dd_tools_data_v52') || '[]');
      
      let successCount = 0;
      let errorCount = 0;

      for (const tool of tools) {
        try {
          await supabaseToolsService.add(tool);
          successCount++;
          console.log(`✅ Migrated tool: ${tool.name}`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to migrate tool: ${tool.name}`, error);
        }
      }

      console.log(`\n📊 Tools Migration Complete!`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${errorCount}`);
      console.log(`Total: ${tools.length}`);

      return { successCount, errorCount, total: tools.length };
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  /**
   * Migrate blog posts from localStorage to Supabase
   * Call: await DataMigration.migrateBlog()
   */
  migrateBlog: async () => {
    try {
      console.log('Starting blog posts migration...');
      const posts = JSON.parse(localStorage.getItem('dd_blog_data_v52') || '[]');
      
      let successCount = 0;
      let errorCount = 0;

      for (const post of posts) {
        try {
          await supabaseBlogService.add(post);
          successCount++;
          console.log(`✅ Migrated blog: ${post.title}`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to migrate blog: ${post.title}`, error);
        }
      }

      console.log(`\n📊 Blog Posts Migration Complete!`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${errorCount}`);
      console.log(`Total: ${posts.length}`);

      return { successCount, errorCount, total: posts.length };
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  /**
   * Migrate learning paths from localStorage to Supabase
   * Call: await DataMigration.migrateLearning()
   */
  migrateLearning: async () => {
    try {
      console.log('Starting learning paths migration...');
      const paths = JSON.parse(localStorage.getItem('dd_learning_data_v52') || '[]');
      
      let successCount = 0;
      let errorCount = 0;

      for (const path of paths) {
        try {
          await supabaseLearningService.add(path);
          successCount++;
          console.log(`✅ Migrated learning path: ${path.title}`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to migrate learning path: ${path.title}`, error);
        }
      }

      console.log(`\n📊 Learning Paths Migration Complete!`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${errorCount}`);
      console.log(`Total: ${paths.length}`);

      return { successCount, errorCount, total: paths.length };
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  /**
   * Migrate ALL data at once
   * Call: await DataMigration.migrateAll()
   */
  migrateAll: async () => {
    try {
      console.log('🚀 Starting FULL DATA MIGRATION...\n');

      const toolsResult = await DataMigration.migrateTools();
      const blogResult = await DataMigration.migrateBlog();
      const learningResult = await DataMigration.migrateLearning();

      console.log('\n' + '='.repeat(50));
      console.log('📊 MIGRATION SUMMARY');
      console.log('='.repeat(50));
      console.log(`Tools:        ${toolsResult.successCount}/${toolsResult.total} ✅`);
      console.log(`Blog Posts:   ${blogResult.successCount}/${blogResult.total} ✅`);
      console.log(`Learning:     ${learningResult.successCount}/${learningResult.total} ✅`);
      console.log('='.repeat(50));

      const totalSuccess = toolsResult.successCount + blogResult.successCount + learningResult.successCount;
      const totalFailed = toolsResult.errorCount + blogResult.errorCount + learningResult.errorCount;

      console.log(`\n🎉 Total: ${totalSuccess} migrated, ${totalFailed} failed`);
      console.log('Migration complete! Check Supabase dashboard to verify.');

      return {
        tools: toolsResult,
        blog: blogResult,
        learning: learningResult,
        totalSuccess,
        totalFailed
      };
    } catch (error) {
      console.error('Full migration error:', error);
      throw error;
    }
  },

  /**
   * Clear all Supabase tables (DANGEROUS - use with caution)
   * Call: await DataMigration.clearSupabase()
   */
  clearSupabase: async () => {
    const confirm = window.confirm(
      'WARNING: This will DELETE all data from Supabase!\n\nAre you absolutely sure? This cannot be undone.'
    );
    
    if (!confirm) {
      console.log('Clear cancelled.');
      return;
    }

    try {
      console.log('⚠️ Clearing Supabase tables...');
      
      // Note: This would require additional delete functions
      // For now, users should delete from Supabase dashboard
      
      console.log('Please delete tables manually from Supabase dashboard:');
      console.log('1. Go to Supabase dashboard');
      console.log('2. Open SQL Editor');
      console.log('3. Run: DELETE FROM tools; DELETE FROM blog_posts; DELETE FROM learning_paths; DELETE FROM user_bookmarks;');
      
    } catch (error) {
      console.error('Clear error:', error);
    }
  }
};

/**
 * USAGE INSTRUCTIONS:
 * 
 * Step 1: Export data from localStorage
 * > DataMigration.exportFromLocalStorage()
 * Copy the output and save it somewhere safe
 * 
 * Step 2: Migrate data to Supabase
 * > await DataMigration.migrateAll()
 * or migrate individually:
 * > await DataMigration.migrateTools()
 * > await DataMigration.migrateBlog()
 * > await DataMigration.migrateLearning()
 * 
 * Step 3: Verify in Supabase Dashboard
 * Go to https://app.supabase.com and check tables
 * 
 * Step 4: Switch to Supabase in your code
 * Update components to use supabaseToolsService instead of localStorage
 */

// Make available in console
if (typeof window !== 'undefined') {
  (window as any).DataMigration = DataMigration;
}
