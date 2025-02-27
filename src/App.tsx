
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/Blog";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import IndexPage from "./pages/Index";
import ProjectsPage from "./pages/Projects";
import SkillsPage from "./pages/Skills";
import ExperiencePage from "./pages/Experience";
import EducationPage from "./pages/Education";
import TechWatchPage from "./pages/TechWatch";
import LoginPage from "./pages/auth/Login";
import { BotpressChat } from "./components/BotpressChat";

// Admin Routes
import DashboardPage from "./pages/admin/Dashboard";
import AboutAdmin from "./pages/admin/about/AboutAdmin";
import BlogAdmin from "./pages/admin/blog/BlogAdmin";
import EducationAdmin from "./pages/admin/education/EducationAdmin";
import ExperiencesAdmin from "./pages/admin/experiences/ExperiencesAdmin";
import ProjectsAdmin from "./pages/admin/projects/ProjectsAdmin";
import SkillsAdmin from "./pages/admin/skills/SkillsAdmin";
import TechWatchAdmin from "./pages/admin/tech-watch/TechWatchAdmin";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route index element={<IndexPage />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/competences" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/formation" element={<EducationPage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/veille-techno" element={<TechWatchPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes - Flat structure pour éviter les problèmes de Outlet */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/a-propos" element={<AboutAdmin />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/admin/formation" element={<EducationAdmin />} />
          <Route path="/admin/experiences" element={<ExperiencesAdmin />} />
          <Route path="/admin/projets" element={<ProjectsAdmin />} />
          <Route path="/admin/competences" element={<SkillsAdmin />} />
          <Route path="/admin/veille-techno" element={<TechWatchAdmin />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <BotpressChat />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
