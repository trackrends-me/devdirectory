# Supabase Configuration Guide

## Environment Variables

Add these to your `.env.local` file (create it in the project root if it doesn't exist):

```env
VITE_SUPABASE_URL=https://idnzxfsjebmjdoymorwj.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_5Fk2oWerYSnZSIz3fh34-w_sRWPBfBT
VITE_GEMINI_API_KEY=AIzaSyBDJDqeVoHCU8hC-CGIRvjQFi50QYPlX80
```

## Setup Instructions

### 1. Create Tables in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `idnzxfsjebmjdoymorwj`
3. Go to **SQL Editor**
4. Copy and paste the entire contents of `SUPABASE_SETUP.sql`
5. Click **Run**

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add your Supabase credentials from the dashboard:
- Go to **Settings** → **API**
- Copy `Project URL` and `Publishable Key`

### 3. Migration from localStorage to Supabase

The system uses a **hybrid approach**:
- ✅ Tries Supabase first (if available)
- ✅ Falls back to localStorage (if Supabase fails)
- ✅ No data loss - existing localStorage data still works

To migrate existing data:

```javascript
// In browser console, run this script to export localStorage data as JSON:
const exportData = {
  tools: JSON.parse(localStorage.getItem('dd_tools_data_v52') || '[]'),
  blog: JSON.parse(localStorage.getItem('dd_blog_data_v52') || '[]'),
  learning: JSON.parse(localStorage.getItem('dd_learning_data_v52') || '[]'),
};
console.log(JSON.stringify(exportData, null, 2));
```

Then import this data via Supabase Dashboard or use the admin panel.

### 4. Test the Connection

After setup, the app will automatically:
1. Detect if Supabase is available
2. Fetch data from Supabase
3. Cache results for performance
4. Fall back to localStorage if needed

### 5. Row Level Security (Optional)

For additional security, enable RLS:
1. Go to **Authentication** → **Policies**
2. Add policies to restrict data access by user
3. See `SUPABASE_SETUP.sql` for example policies

## Data Structure

### Tools Table
- `id`, `name`, `description`, `shortDescription`
- `category`, `group`, `tags`, `websiteUrl`, `githubUrl`
- `pricing`, `stars`, `featured`, `logo`
- `alternativeTo`, `starsWeekly`, `deal`, `dealUrl`, `license`

### Blog Posts Table
- `id`, `title`, `slug`, `excerpt`, `content`
- `category`, `date`, `readTime`, `coverImage`
- `author`, `seoTitle`, `seoDescription`, `seoKeywords`

### Learning Paths Table
- `id`, `title`, `count`, `color`, `icon`, `markdown`

### User Bookmarks Table
- `userId`, `toolId` (stores user's saved tools)

### Categories Table
- Stores category groups and categories with hierarchy

## API Methods

All Supabase services are in `services/supabaseDataService.ts`:

```typescript
import { supabaseToolsService, supabaseBlogService, supabaseLearningService } from './supabaseDataService';

// Get all tools
const tools = await supabaseToolsService.getAll();

// Get single tool
const tool = await supabaseToolsService.getById('tool-id');

// Add tool
await supabaseToolsService.add(toolObject);

// Update tool
await supabaseToolsService.update(toolObject);

// Delete tool
await supabaseToolsService.delete('tool-id');
```

## Troubleshooting

### Connection Issues
- Check Supabase URL and key in `.env.local`
- Verify network connectivity
- Check Supabase Dashboard for service status

### Authentication Errors
- Ensure RLS policies are configured (or disabled for public access)
- Check that your anon key has correct permissions

### No Data
- Run `SUPABASE_SETUP.sql` to create tables
- Import data from localStorage using the export script above

## Performance Tips

1. **Caching**: Data is cached in React state, reducing API calls
2. **Indexing**: Common queries are indexed for faster performance
3. **Batch Operations**: For bulk actions, use SQL directly in Supabase
4. **Real-time**: Enable Supabase Realtime for live updates (optional)

## Next Steps

1. ✅ Install @supabase/supabase-js (`npm install @supabase/supabase-js`)
2. ✅ Create `.env.local` with credentials
3. ✅ Run SQL setup script
4. ✅ Test admin panel CRUD operations
5. ✅ Monitor Supabase Dashboard for performance

---

For more info: [Supabase Docs](https://supabase.com/docs)
