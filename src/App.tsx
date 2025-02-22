
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import TechWatch from "./pages/TechWatch";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import SkillsAdmin from "./pages/admin/skills/SkillsAdmin";
import ExperiencesAdmin from "./pages/admin/experiences/ExperiencesAdmin";
import BlogAdmin from "./pages/admin/blog/BlogAdmin";
import AboutAdmin from "./pages/admin/about/AboutAdmin";
import TechWatchAdmin from "./pages/admin/tech-watch/TechWatchAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/competences" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/formation" element={<Education />} />
          <Route path="/projets" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/veille-techno" element={<TechWatch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/skills" element={<SkillsAdmin />} />
          <Route path="/admin/experiences" element={<ExperiencesAdmin />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/admin/about" element={<AboutAdmin />} />
          <Route path="/admin/tech-watch" element={<TechWatchAdmin />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
