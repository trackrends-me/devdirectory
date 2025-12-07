
import { Tool, CategoryGroup, LearningPath, TechStack, BlogPost, AIToolSpotlight, GithubRepo, CloudProvider, SelfHostedTool, AIAgent } from '../types';

// --- STORAGE KEYS (Version Bumped) ---
const STORAGE_KEY_TOOLS = 'dd_tools_data_v52';
const STORAGE_KEY_LEARNING = 'dd_learning_data_v52';
const STORAGE_KEY_BLOG = 'dd_blog_data_v52';
const STORAGE_KEY_AI_SPOTLIGHT = 'dd_ai_spotlight_v52';
const STORAGE_KEY_AI_AGENTS = 'dd_ai_agents_v52';
const STORAGE_KEY_GITHUB = 'dd_github_trending_v52';
const STORAGE_KEY_CLOUD = 'dd_cloud_providers_v52';
const STORAGE_KEY_SELFHOSTED = 'dd_self_hosted_v52';
const STORAGE_KEY_CATEGORIES = 'dd_categories_v52';

// --- INITIAL DATA ---
const INITIAL_TOOLS: Tool[] = []; 

const INITIAL_CATEGORY_GROUPS: CategoryGroup[] = [
    {
    name: 'Tech & Development',
    slug: 'tech-development',
    categories: [
      { id: 'dev-1', name: 'Tech Stacks', slug: 'tech-stacks', description: 'Popular ecosystem combinations like MERN.', icon: 'Layers', toolCount: 15 },
      { id: 'dev-2', name: 'Frontend Frameworks', slug: 'frontend-frameworks', description: 'React, Vue, Svelte, Angular.', icon: 'Layout', toolCount: 50 },
      { id: 'dev-3', name: 'Backend Frameworks', slug: 'backend-frameworks', description: 'Express, Django, Spring, Laravel.', icon: 'Server', toolCount: 85 },
      { id: 'dev-4', name: 'Full Stack Frameworks', slug: 'full-stack-frameworks', description: 'Next.js, Nuxt, Remix, Redwood.', icon: 'Globe', toolCount: 20 },
      { id: 'dev-5', name: 'Static Site Generators', slug: 'static-site-generators', description: 'Gatsby, Astro, Hugo, Jekyll.', icon: 'FileJson', toolCount: 18 },
      { id: 'dev-6', name: 'Micro Frameworks', slug: 'micro-frameworks', description: 'Flask, Sinatra, Hono, Slim.', icon: 'Zap', toolCount: 30 },
      { id: 'dev-7', name: 'Mobile App Frameworks', slug: 'mobile-app-frameworks', description: 'React Native, Flutter, Swift.', icon: 'Smartphone', toolCount: 25 },
      { id: 'dev-8', name: 'Desktop App Frameworks', slug: 'desktop-app-frameworks', description: 'Electron, Tauri, .NET MAUI.', icon: 'Monitor', toolCount: 10 },
      { id: 'dev-9', name: 'Database Systems', slug: 'database-systems', description: 'Postgres, MySQL, MongoDB, SQLite.', icon: 'Database', toolCount: 45 },
      { id: 'dev-10', name: 'ORMs & Query Builders', slug: 'orms-query-builders', description: 'Prisma, Drizzle, TypeORM.', icon: 'Table', toolCount: 22 },
      { id: 'dev-11', name: 'DevOps Tools', slug: 'devops-tools', description: 'Docker, Kubernetes, Terraform.', icon: 'Terminal', toolCount: 50 },
      { id: 'dev-12', name: 'CI/CD Tools', slug: 'ci-cd-tools', description: 'GitHub Actions, Jenkins, CircleCI.', icon: 'GitMerge', toolCount: 30 },
    ]
  },
  {
    name: 'Hosting & Infrastructure',
    slug: 'hosting-infrastructure',
    categories: [
      { id: 'inf-1', name: 'Free Cloud Providers', slug: 'free-cloud-providers', description: 'Generous free tiers for devs.', icon: 'Cloud', toolCount: 25 },
      { id: 'inf-2', name: 'Edge Hosting', slug: 'edge-hosting', description: 'Vercel, Netlify, Cloudflare.', icon: 'Zap', toolCount: 15 },
      { id: 'inf-3', name: 'Serverless Platforms', slug: 'serverless-platforms', description: 'AWS Lambda, Google Cloud Functions.', icon: 'Server', toolCount: 20 },
      { id: 'inf-4', name: 'VM/Compute', slug: 'vm-compute', description: 'EC2, DigitalOcean Droplets.', icon: 'HardDrive', toolCount: 18 },
      { id: 'inf-5', name: 'Container Hosting', slug: 'container-hosting', description: 'ECS, Google Cloud Run.', icon: 'Box', toolCount: 12 },
      { id: 'inf-6', name: 'Managed Databases', slug: 'managed-databases', description: 'Neon, PlanetScale, Supabase.', icon: 'Database', toolCount: 28 },
      { id: 'inf-7', name: 'Object Storage', slug: 'object-storage', description: 'S3, R2, MinIO.', icon: 'Archive', toolCount: 10 },
    ]
  },
  {
    name: 'AI & ML',
    slug: 'ai-ml',
    categories: [
      { id: 'ai-1', name: 'Open Source LLMs', slug: 'open-source-llms', description: 'Llama 3, Mistral, Falcon.', icon: 'Bot', toolCount: 35 },
      { id: 'ai-2', name: 'SLMs', slug: 'slms', description: 'Phi-3, Gemma, TinyLlama.', icon: 'Cpu', toolCount: 15 },
      { id: 'ai-3', name: 'Vision Models', slug: 'vision-models', description: 'Stable Diffusion, Midjourney.', icon: 'Eye', toolCount: 20 },
      { id: 'ai-4', name: 'Speech Models', slug: 'speech-models', description: 'Whisper, ElevenLabs.', icon: 'Mic', toolCount: 12 },
      { id: 'ai-5', name: 'Vector Databases', slug: 'vector-databases', description: 'Pinecone, Weaviate, Chroma.', icon: 'Database', toolCount: 18 },
      { id: 'ai-6', name: 'Fine-tuning Tools', slug: 'fine-tuning-tools', description: 'Axolotl, Unsloth, LoRA.', icon: 'Settings', toolCount: 10 },
      { id: 'ai-7', name: 'AI Agents', slug: 'ai-agents', description: 'AutoGPT, BabyAGI, CrewAI.', icon: 'Users', toolCount: 25 },
      { id: 'ai-8', name: 'Embeddings', slug: 'embeddings', description: 'OpenAI, Cohere, Jina.', icon: 'Binary', toolCount: 8 },
      { id: 'ai-9', name: 'Training Platforms', slug: 'training-platforms', description: 'Hugging Face, RunPod.', icon: 'Activity', toolCount: 14 },
    ]
  },
  {
    name: 'Tools & Utilities',
    slug: 'tools-utilities',
    categories: [
      { id: 'tool-1', name: 'Code Editors & IDEs', slug: 'code-editors', description: 'VS Code, JetBrains, Neovim.', icon: 'Code2', toolCount: 15 },
      { id: 'tool-2', name: 'API Clients', slug: 'api-clients', description: 'Postman, Insomnia, Hoppscotch.', icon: 'Send', toolCount: 12 },
      { id: 'tool-3', name: 'Terminal Tools', slug: 'terminal-tools', description: 'Oh My Zsh, Warp, Starship.', icon: 'Terminal', toolCount: 30 },
      { id: 'tool-4', name: 'Formatters & Validators', slug: 'formatters-validators', description: 'Prettier, ESLint, Biome.', icon: 'AlignLeft', toolCount: 20 },
      { id: 'tool-5', name: 'JSON/YAML Tools', slug: 'json-yaml-tools', description: 'Validators, Converters, Visualizers.', icon: 'FileCode', toolCount: 25 },
      { id: 'tool-6', name: 'Code Generators', slug: 'code-generators', description: 'Plop, Hygen, Yeoman.', icon: 'Wand2', toolCount: 10 },
      { id: 'tool-7', name: 'Browser Extensions', slug: 'browser-extensions', description: 'React DevTools, Pesticide.', icon: 'Chrome', toolCount: 40 },
      { id: 'tool-8', name: 'Regex Tools', slug: 'regex-tools', description: 'Regex101, RegExr.', icon: 'Regex', toolCount: 8 },
      { id: 'tool-9', name: 'Diff Checkers', slug: 'diff-checkers', description: 'Diffchecker, Meld.', icon: 'FileDiff', toolCount: 6 },
    ]
  },
  {
    name: 'Open Source',
    slug: 'open-source',
    categories: [
      { id: 'os-1', name: 'GitHub Projects', slug: 'github-projects', description: 'Trending repos and tools.', icon: 'Github', toolCount: 100 },
      { id: 'os-2', name: 'Templates & Boilerplates', slug: 'templates-boilerplates', description: 'Next.js starters, SaaS kits.', icon: 'Copy', toolCount: 50 },
      { id: 'os-3', name: 'Admin Dashboards', slug: 'admin-dashboards', description: 'React Admin, Refine.', icon: 'LayoutDashboard', toolCount: 22 },
      { id: 'os-4', name: 'Self-hosted Tools', slug: 'self-hosted-tools', description: 'Coolify, NocoDB, Appwrite.', icon: 'Server', toolCount: 45 },
      { id: 'os-5', name: 'Developer Portfolio Templates', slug: 'portfolio-templates', description: 'Showcase your work.', icon: 'User', toolCount: 30 },
    ]
  },
  {
    name: 'APIs',
    slug: 'apis',
    categories: [
      { id: 'api-1', name: 'Public APIs', slug: 'public-apis', description: 'Weather, Finance, Data.', icon: 'Globe', toolCount: 60 },
      { id: 'api-2', name: 'Free APIs', slug: 'free-apis', description: 'No credit card needed.', icon: 'Gift', toolCount: 40 },
      { id: 'api-3', name: 'API Testing Tools', slug: 'api-testing', description: 'K6, JMeter, Locust.', icon: 'TestTube', toolCount: 15 },
      { id: 'api-4', name: 'Mock API Services', slug: 'mock-api', description: 'Mocky, Beeceptor.', icon: 'Ghost', toolCount: 10 },
    ]
  },
  {
    name: 'Learning',
    slug: 'learning',
    categories: [
      { id: 'learn-1', name: 'Learning Paths', slug: 'learning-paths', description: 'Roadmap.sh, FreeCodeCamp.', icon: 'Map', toolCount: 12 },
      { id: 'learn-2', name: 'Courses', slug: 'courses', description: 'Udemy, Coursera, Egghead.', icon: 'GraduationCap', toolCount: 50 },
      { id: 'learn-3', name: 'Coding Practice', slug: 'coding-practice', description: 'LeetCode, HackerRank.', icon: 'Code', toolCount: 15 },
      { id: 'learn-4', name: 'System Design', slug: 'system-design', description: 'ByteByteGo, Exponent.', icon: 'Network', toolCount: 10 },
      { id: 'learn-5', name: 'DSA Resources', slug: 'dsa-resources', description: 'Algorithms, Data Structures.', icon: 'Binary', toolCount: 20 },
      { id: 'learn-6', name: 'Interview Prep', slug: 'interview-prep', description: 'Mock interviews, Questions.', icon: 'Briefcase', toolCount: 18 },
    ]
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    categories: [
      { id: 'prod-1', name: 'Bookmarks', slug: 'bookmarks', description: 'Raindrop, Pinboard.', icon: 'Bookmark', toolCount: 8 },
      { id: 'prod-2', name: 'Checklists', slug: 'checklists', description: 'Launch checklist, SEO check.', icon: 'CheckSquare', toolCount: 12 },
      { id: 'prod-3', name: 'Roadmaps', slug: 'roadmaps', description: 'Product and dev roadmaps.', icon: 'Map', toolCount: 10 },
      { id: 'prod-4', name: 'Developer Guides', slug: 'developer-guides', description: 'MDN, W3Schools.', icon: 'Book', toolCount: 30 },
      { id: 'prod-5', name: 'Best Practices', slug: 'best-practices', description: 'Clean Code, Security.', icon: 'ThumbsUp', toolCount: 15 },
      { id: 'prod-6', name: 'Cheatsheets', slug: 'cheatsheets', description: 'Git, CSS, Regex sheets.', icon: 'FileText', toolCount: 25 },
    ]
  },
  {
    name: 'Design & Frontend',
    slug: 'design-frontend',
    categories: [
      { id: 'des-1', name: 'UI Kits', slug: 'ui-kits', description: 'Tailwind UI, Untitled UI.', icon: 'Layout', toolCount: 35 },
      { id: 'des-2', name: 'Icon Libraries', slug: 'icon-libraries', description: 'Lucide, Heroicons, FA.', icon: 'Shapes', toolCount: 28 },
      { id: 'des-3', name: 'Color Tools', slug: 'color-tools', description: 'Palettes, Gradients.', icon: 'Palette', toolCount: 20 },
      { id: 'des-4', name: 'Illustrations', slug: 'illustrations', description: 'Undraw, Humaaans.', icon: 'Image', toolCount: 18 },
      { id: 'des-5', name: 'CSS Tools', slug: 'css-tools', description: 'Generators, Flexbox helpers.', icon: 'Scissors', toolCount: 30 },
    ]
  },
  {
    name: 'Business & SaaS',
    slug: 'business-saas',
    categories: [
      { id: 'biz-1', name: 'SaaS Boilerplates', slug: 'saas-boilerplates', description: 'ShipFast, Shipfa.st.', icon: 'Rocket', toolCount: 15 },
      { id: 'biz-2', name: 'Payment Integrations', slug: 'payment-integrations', description: 'Stripe, LemonSqueezy.', icon: 'CreditCard', toolCount: 10 },
      { id: 'biz-3', name: 'Authentication Tools', slug: 'authentication-tools', description: 'Clerk, Auth0, Kinde.', icon: 'Lock', toolCount: 12 },
      { id: 'biz-4', name: 'Billing Systems', slug: 'billing-systems', description: 'Paddle, Chargebee.', icon: 'DollarSign', toolCount: 8 },
      { id: 'biz-5', name: 'Admin Templates', slug: 'admin-templates', description: 'Metronic, Berry.', icon: 'LayoutDashboard', toolCount: 20 },
    ]
  }
];

export const TECH_STACKS: TechStack[] = [];
const INITIAL_LEARNING_PATHS: LearningPath[] = [];
const INITIAL_BLOG_POSTS: BlogPost[] = [];

// --- SECTION DATA ---
const INITIAL_AI_TOOLS: AIToolSpotlight[] = [
  { id: 'ai-1', name: 'OpenAI API', description: 'Access GPT-4 and DALL-E models.', category: 'LLM', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', tags: ['Paid', 'Proprietary'], url: 'https://openai.com' },
  { id: 'ai-2', name: 'Hugging Face', description: 'The AI community building the future.', category: 'Platform', logo: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg', tags: ['Open Source', 'Hub'], url: 'https://huggingface.co' },
  { id: 'ai-3', name: 'Pinecone', description: 'Long-term memory for AI.', category: 'Vector DB', logo: 'https://cdn.worldvectorlogo.com/logos/pinecone.svg', tags: ['Freemium', 'Managed'], url: 'https://pinecone.io' },
  { id: 'ai-4', name: 'Midjourney', description: 'Generative AI for images.', category: 'Generative', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png', tags: ['Paid', 'Art'], url: 'https://midjourney.com' }
];

const INITIAL_AI_AGENTS: AIAgent[] = [
  { id: 'agent-1', name: 'AutoGPT', description: 'An experimental open-source attempt to make GPT-4 fully autonomous.', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/AutoGPT_logo.png', tags: ['Autonomous', 'Python'], url: 'https://github.com/Significant-Gravitas/Auto-GPT' },
  { id: 'agent-2', name: 'BabyAGI', description: 'AI-powered task management system.', logo: 'https://avatars.githubusercontent.com/u/108924164?s=200&v=4', tags: ['Task Management', 'Python'], url: 'https://github.com/yoheinakajima/babyagi' },
  { id: 'agent-3', name: 'CrewAI', description: 'Framework for orchestrating role-playing, autonomous AI agents.', logo: 'https://avatars.githubusercontent.com/u/153186259?s=200&v=4', tags: ['Multi-Agent', 'Framework'], url: 'https://crewai.com' },
  { id: 'agent-4', name: 'LangChain', description: 'Building applications with LLMs through composability.', logo: 'https://avatars.githubusercontent.com/u/126733545?s=200&v=4', tags: ['Framework', 'JS/Python'], url: 'https://langchain.com' }
];

const INITIAL_GITHUB: GithubRepo[] = [
  { id: 'gh-1', name: 'shadcn/ui', description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', stars: '45.2k', language: 'TypeScript', url: 'https://github.com/shadcn-ui/ui' },
  { id: 'gh-2', name: 'cal.com', description: 'Scheduling infrastructure for absolutely everyone.', stars: '28.1k', language: 'TypeScript', url: 'https://github.com/calcom/cal.com' },
  { id: 'gh-3', name: 'excalidraw', description: 'Virtual whiteboard for sketching hand-drawn like diagrams.', stars: '62.5k', language: 'TypeScript', url: 'https://github.com/excalidraw/excalidraw' },
  { id: 'gh-4', name: 'tldraw', description: 'A tiny little drawing app.', stars: '31.9k', language: 'TypeScript', url: 'https://github.com/tldraw/tldraw' }
];

const INITIAL_CLOUD: CloudProvider[] = [
  { id: 'cp-1', name: 'Render', tier: 'Free Tier', type: 'PaaS', logo: 'https://picsum.photos/seed/render/64/64', url: 'https://render.com', features: ['Auto Deploys', 'DDoS Protection'] },
  { id: 'cp-2', name: 'Railway', tier: 'Trial', type: 'PaaS', logo: 'https://picsum.photos/seed/railway/64/64', url: 'https://railway.app', features: ['Usage Pricing', 'Plugins'] },
  { id: 'cp-3', name: 'Fly.io', tier: 'Free Allowance', type: 'Edge', logo: 'https://picsum.photos/seed/fly/64/64', url: 'https://fly.io', features: ['Global', 'Firecracker'] },
  { id: 'cp-4', name: 'Netlify', tier: 'Generous Free', type: 'Static', logo: 'https://picsum.photos/seed/netlify/64/64', url: 'https://netlify.com', features: ['Forms', 'Functions'] },
];

const INITIAL_SELF_HOSTED: SelfHostedTool[] = [
  { id: 'sh-1', name: 'Coolify', description: 'Open-source and self-hostable Heroku / Netlify alternative.', logo: 'https://picsum.photos/seed/coolify/64/64', alternativeTo: 'Vercel / Heroku', url: 'https://coolify.io' },
  { id: 'sh-2', name: 'NocoDB', description: 'Open Source Airtable Alternative.', logo: 'https://picsum.photos/seed/nocodb/64/64', alternativeTo: 'Airtable', url: 'https://nocodb.com' },
  { id: 'sh-3', name: 'Appwrite', description: 'Secure Backend Server for Web, Mobile & Flutter Developers.', logo: 'https://picsum.photos/seed/appwrite/64/64', alternativeTo: 'Firebase', url: 'https://appwrite.io' },
  { id: 'sh-4', name: 'PostHog', description: 'The open source product analytics suite.', logo: 'https://picsum.photos/seed/posthog/64/64', alternativeTo: 'Mixpanel', url: 'https://posthog.com' },
];

// --- HELPER GENERIC CRUD ---
function createCRUD<T>(key: string, initialData: T[]) {
  const get = (): T[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }
      return JSON.parse(stored);
    }
    return initialData;
  };

  const add = (item: T) => {
    const items = get();
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
  };

  const remove = (id: string) => {
    const items = get();
    // @ts-ignore
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  };
  
  const update = (item: T) => {
      const items = get();
      // @ts-ignore
      const index = items.findIndex(i => i.id === item.id);
      if (index !== -1) {
          items[index] = item;
          localStorage.setItem(key, JSON.stringify(items));
      }
  }

  return { get, add, remove, update };
}

// --- EXPORTS ---

export const CategoryService = {
    getGroups: () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
            if (!stored) {
                localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORY_GROUPS));
                return INITIAL_CATEGORY_GROUPS;
            }
            return JSON.parse(stored) as CategoryGroup[];
        }
        return INITIAL_CATEGORY_GROUPS;
    },
    saveGroups: (groups: CategoryGroup[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(groups));
        }
    }
};

export const CATEGORY_GROUPS = CategoryService.getGroups();

export const ToolsService = {
    getTools: () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY_TOOLS);
            if (!stored) { localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(INITIAL_TOOLS)); return INITIAL_TOOLS; }
            return JSON.parse(stored) as Tool[];
        }
        return INITIAL_TOOLS;
    },
    getFeatured: () => ToolsService.getTools().filter(t => t.featured),
    addTool: (t: Tool) => { const list = ToolsService.getTools(); list.push(t); localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(list)); },
    deleteTool: (id: string) => { const list = ToolsService.getTools().filter(t => t.id !== id); localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(list)); },
    getToolById: (id: string) => ToolsService.getTools().find(t => t.id === id),
    getToolsByIds: (ids: string[]) => ToolsService.getTools().filter(t => ids.includes(t.id)),
    getToolsByCategory: (slug: string) => ToolsService.getTools().filter(t => t.category.toLowerCase().replace(/\s+/g, '-') === slug)
};

export const getTools = ToolsService.getTools;
export const getFeaturedTools = ToolsService.getFeatured;
export const getToolById = ToolsService.getToolById;
export const getToolsByIds = ToolsService.getToolsByIds;
export const addTool = ToolsService.addTool;
export const updateTool = (t: Tool) => { const list = ToolsService.getTools(); const idx = list.findIndex(x => x.id === t.id); if(idx !== -1) { list[idx] = t; localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(list)); }};
export const deleteTool = ToolsService.deleteTool;
export const getToolsByCategory = ToolsService.getToolsByCategory;

export const AISpotlightService = createCRUD<AIToolSpotlight>(STORAGE_KEY_AI_SPOTLIGHT, INITIAL_AI_TOOLS);
export const AIAgentsService = createCRUD<AIAgent>(STORAGE_KEY_AI_AGENTS, INITIAL_AI_AGENTS);
export const GithubTrendingService = createCRUD<GithubRepo>(STORAGE_KEY_GITHUB, INITIAL_GITHUB);
export const CloudService = createCRUD<CloudProvider>(STORAGE_KEY_CLOUD, INITIAL_CLOUD);
export const SelfHostedService = createCRUD<SelfHostedTool>(STORAGE_KEY_SELFHOSTED, INITIAL_SELF_HOSTED);

export const LearningService = createCRUD<LearningPath>(STORAGE_KEY_LEARNING, INITIAL_LEARNING_PATHS);
export const getLearningPaths = LearningService.get;
export const getLearningPathById = (id: string) => LearningService.get().find(p => p.id === id);
export const addLearningPath = LearningService.add;
export const deleteLearningPath = LearningService.remove;
export const updateLearningPath = (p: LearningPath) => LearningService.update(p);

export const BlogService = createCRUD<BlogPost>(STORAGE_KEY_BLOG, INITIAL_BLOG_POSTS);
export const getBlogPosts = BlogService.get;
export const getBlogPostById = (id: string) => BlogService.get().find(p => p.id === id);
export const addBlogPost = BlogService.add;
export const deleteBlogPost = BlogService.remove;
export const updateBlogPost = (p: BlogPost) => BlogService.update(p);

export const getTechStacks = () => TECH_STACKS;
export const getTechStackBySlug = (slug: string) => TECH_STACKS.find(s => s.slug === slug);

// Re-exports
export const AI_TOOLS = []; 
export const GITHUB_TRENDING = []; 
export const CLOUD_PROVIDERS = []; 
export const SELF_HOSTED = [];
