
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Public Pages
import HomePage from "./pages/Index";
import SkillsPage from "./pages/Skills";
import ExperiencesPage from "./pages/Experience";
import ProjectsPage from "./pages/Projects";
import ProjectsPdfPage from "./pages/ProjectsPdf";
import EducationPage from "./pages/Education";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/Blog"; // This needs a proper BlogPost page
import TechWatchPage from "./pages/TechWatch";

// Admin Pages
import DashboardPage from "./pages/admin/Dashboard";
import SkillsAdmin from "./pages/admin/skills/SkillsAdmin";
import ExperiencesAdmin from "./pages/admin/experiences/ExperiencesAdmin";
import ProjectsAdmin from "./pages/admin/projects/ProjectsAdmin";
import ProjectsPdfAdmin from "./pages/admin/projects/ProjectsPdfAdmin";
import EducationAdmin from "./pages/admin/education/EducationAdmin";
import AboutAdmin from "./pages/admin/about/AboutAdmin";
import BlogAdmin from "./pages/admin/blog/BlogAdmin";
import TechWatchAdmin from "./pages/admin/tech-watch/TechWatchAdmin";
import ContentAdmin from "./pages/admin/content/ContentAdmin";

// Auth Pages
import LoginPage from "./pages/auth/Login";
import NotFoundPage from "./pages/NotFound";

// Auth Context
import { AuthProvider } from './hooks/use-auth-provider';
import { RequireAuth } from './hooks/use-require-auth';

// Créez une nouvelle instance de QueryClient
const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects-pdf" element={<ProjectsPdfPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/tech-watch" element={<TechWatchPage />} />
            
            {/* French Routes (Redirections) */}
            <Route path="/competences" element={<Navigate to="/skills" replace />} />
            <Route path="/experience" element={<Navigate to="/experiences" replace />} />
            <Route path="/projets" element={<Navigate to="/projects" replace />} />
            <Route path="/projets-pdf" element={<Navigate to="/projects-pdf" replace />} />
            <Route path="/formation" element={<Navigate to="/education" replace />} />
            <Route path="/a-propos" element={<Navigate to="/about" replace />} />
            <Route path="/veille-techno" element={<Navigate to="/tech-watch" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            <Route path="/admin/skills" element={<RequireAuth><SkillsAdmin /></RequireAuth>} />
            <Route path="/admin/experiences" element={<RequireAuth><ExperiencesAdmin /></RequireAuth>} />
            <Route path="/admin/projects" element={<RequireAuth><ProjectsAdmin /></RequireAuth>} />
            <Route path="/admin/projects-pdf" element={<RequireAuth><ProjectsPdfAdmin /></RequireAuth>} />
            <Route path="/admin/education" element={<RequireAuth><EducationAdmin /></RequireAuth>} />
            <Route path="/admin/about" element={<RequireAuth><AboutAdmin /></RequireAuth>} />
            <Route path="/admin/blog" element={<RequireAuth><BlogAdmin /></RequireAuth>} />
            <Route path="/admin/tech-watch" element={<RequireAuth><TechWatchAdmin /></RequireAuth>} />
            <Route path="/admin/content" element={<RequireAuth><ContentAdmin /></RequireAuth>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
