import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public Pages
import HomePage from "./pages/HomePage";
import SkillsPage from "./pages/SkillsPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import ProjectsPage from "./pages/ProjectsPage";
import EducationPage from "./pages/EducationPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import TechWatchPage from "./pages/TechWatchPage";

// Admin Pages
import DashboardPage from "./pages/admin/Dashboard";
import SkillsAdmin from "./pages/admin/skills/SkillsAdmin";
import ExperiencesAdmin from "./pages/admin/experiences/ExperiencesAdmin";
import ProjectsAdmin from "./pages/admin/projects/ProjectsAdmin";
import EducationAdmin from "./pages/admin/education/EducationAdmin";
import AboutAdmin from "./pages/admin/about/AboutAdmin";
import BlogAdmin from "./pages/admin/blog/BlogAdmin";
import TechWatchAdmin from "./pages/admin/tech-watch/TechWatchAdmin";
import ContentAdmin from "./pages/admin/content/ContentAdmin"; // Add this import

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import { RequireAuth } from "./components/auth/RequireAuth";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

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
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/tech-watch" element={<TechWatchPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/admin/skills" element={<RequireAuth><SkillsAdmin /></RequireAuth>} />
        <Route path="/admin/experiences" element={<RequireAuth><ExperiencesAdmin /></RequireAuth>} />
        <Route path="/admin/projects" element={<RequireAuth><ProjectsAdmin /></RequireAuth>} />
        <Route path="/admin/education" element={<RequireAuth><EducationAdmin /></RequireAuth>} />
        <Route path="/admin/about" element={<RequireAuth><AboutAdmin /></RequireAuth>} />
        <Route path="/admin/blog" element={<RequireAuth><BlogAdmin /></RequireAuth>} />
        <Route path="/admin/tech-watch" element={<RequireAuth><TechWatchAdmin /></RequireAuth>} />
        <Route path="/admin/content" element={<RequireAuth><ContentAdmin /></RequireAuth>} /> {/* Add this route */}

        {/* Auth Routes */}
        <Route path="/login" element={authState.isAuthenticated ? <Navigate to="/admin" /> : <LoginPage />} />
        <Route path="/register" element={authState.isAuthenticated ? <Navigate to="/admin" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
