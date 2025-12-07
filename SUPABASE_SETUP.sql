-- Supabase Database Schema Setup
-- Run these SQL commands in your Supabase dashboard (SQL Editor)

-- 1. TOOLS TABLE
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  "group" TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  website_url TEXT,
  github_url TEXT,
  pricing TEXT CHECK (pricing IN ('Free', 'Paid', 'Freemium', 'Open Source')),
  stars INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  logo TEXT,
  alternative_to TEXT,
  stars_weekly INTEGER DEFAULT 0,
  deal TEXT,
  deal_url TEXT,
  license TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_group ON tools("group");
CREATE INDEX idx_tools_featured ON tools(featured);

-- 2. BLOG POSTS TABLE
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  date TEXT,
  read_time TEXT,
  cover_image TEXT,
  author TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_date ON blog_posts(date);

-- 3. LEARNING PATHS TABLE
CREATE TABLE learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  count TEXT,
  color TEXT,
  icon TEXT,
  markdown TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. USER BOOKMARKS TABLE
CREATE TABLE user_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tool_id)
);

CREATE INDEX idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX idx_bookmarks_tool ON user_bookmarks(tool_id);

-- 5. CATEGORIES TABLE (for managing category groups)
CREATE TABLE category_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES category_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  slug TEXT NOT NULL,
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, slug)
);

CREATE INDEX idx_categories_group ON categories(group_id);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for public read access)
-- CREATE POLICY "Enable read access for all users" ON tools FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON blog_posts FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON learning_paths FOR SELECT USING (true);
