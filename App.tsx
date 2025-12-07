
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { AllCategories } from './pages/AllCategories';
import { ToolDetail } from './pages/ToolDetail';
import { Submit } from './pages/Submit';
import { Learning } from './pages/Learning';
import { LearningDetail } from './pages/LearningDetail';
import { StackBuilder } from './pages/StackBuilder';
import { StackDetail } from './pages/StackDetail';
import { AIRecommendations } from './pages/AIRecommendations';
import { GithubPage } from './pages/collections/GithubPage';
import { CloudPage } from './pages/collections/CloudPage';
import { SelfHostedPage } from './pages/collections/SelfHostedPage';

// Admin Imports
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ToolsManager } from './pages/admin/ToolsManager';
import { ToolEditor } from './pages/admin/ToolEditor';
import { SectionsManager } from './pages/admin/SectionsManager';
import { LearningManager } from './pages/admin/LearningManager';
import { LearningEditor } from './pages/admin/LearningEditor';
import { BlogManager } from './pages/admin/BlogManager';
import { BlogEditor } from './pages/admin/BlogEditor';
import { CategoriesManager } from './pages/admin/CategoriesManager'; // New Import
import { AuthService } from './services/authService';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/tools" element={<ProtectedRoute><ToolsManager /></ProtectedRoute>} />
        <Route path="/admin/tools/new" element={<ProtectedRoute><ToolEditor /></ProtectedRoute>} />
        <Route path="/admin/tools/edit/:id" element={<ProtectedRoute><ToolEditor /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><CategoriesManager /></ProtectedRoute>} /> {/* New Route */}
        <Route path="/admin/sections" element={<ProtectedRoute><SectionsManager /></ProtectedRoute>} />
        <Route path="/admin/learning" element={<ProtectedRoute><LearningManager /></ProtectedRoute>} />
        <Route path="/admin/learning/new" element={<ProtectedRoute><LearningEditor /></ProtectedRoute>} />
        <Route path="/admin/learning/edit/:id" element={<ProtectedRoute><LearningEditor /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
        <Route path="/admin/blog/new" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
        <Route path="/admin/blog/edit/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/learning/:id" element={<LearningDetail />} />
              <Route path="/stack-builder" element={<StackBuilder />} />
              <Route path="/stack/:slug" element={<StackDetail />} />
              <Route path="/ai-recommendations" element={<AIRecommendations />} />
              
              <Route path="/collection/github" element={<GithubPage />} />
              <Route path="/collection/cloud" element={<CloudPage />} />
              <Route path="/collection/self-hosted" element={<SelfHostedPage />} />
              
              <Route path="/ai-tools" element={<Navigate to="/browse?group=ai-tools" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
