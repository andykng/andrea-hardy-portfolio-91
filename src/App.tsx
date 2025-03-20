
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
import NotFoundPage from "./pages/NotFound";

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
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
