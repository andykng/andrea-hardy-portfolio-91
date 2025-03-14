
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public Pages
import HomePage from "./pages/Index";
import SkillsPage from "./pages/Skills";
import ExperiencesPage from "./pages/Experience";
import ProjectsPage from "./pages/Projects";
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
import EducationAdmin from "./pages/admin/education/EducationAdmin";
import AboutAdmin from "./pages/admin/about/AboutAdmin";
import BlogAdmin from "./pages/admin/blog/BlogAdmin";
import TechWatchAdmin from "./pages/admin/tech-watch/TechWatchAdmin";
import ContentAdmin from "./pages/admin/content/ContentAdmin";

// Auth Pages
import LoginPage from "./pages/auth/Login";
// We'll need to create these auth pages or adjust imports
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;

// Auth Context placeholder - we should create this
const AuthContext = React.createContext({});
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ isAuthenticated: false });
  const useAuth = () => ({ authState });
  return <AuthContext.Provider value={{ authState, useAuth }}>{children}</AuthContext.Provider>;
};

// RequireAuth placeholder - we should create this
const RequireAuth = ({ children }) => <>{children}</>;
const NotFoundPage = () => <div>Not Found</div>;

function App() {
  const [loading, setLoading] = useState(true);
  const { authState } = { authState: { isAuthenticated: false } }; // Placeholder for auth state

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
        <Route path="/blog/:slug" element={<BlogPage />} /> {/* Updated to use BlogPage for now */}
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
        <Route path="/admin/content" element={<RequireAuth><ContentAdmin /></RequireAuth>} />

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
