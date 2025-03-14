
import {
  LayoutDashboard,
  Code2,
  Briefcase,
  FolderKanban,
  GraduationCap,
  User,
  BookText,
  Rss,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>
        <div className="space-y-1">
          <Button
            variant={pathname === "/admin" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Tableau de bord
          </Button>
          
          <Button
            variant={pathname === "/admin/content" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/content")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Générateur IA
          </Button>
          
          <Button
            variant={pathname === "/admin/skills" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/skills")}
          >
            <Code2 className="mr-2 h-4 w-4" />
            Compétences
          </Button>
          <Button
            variant={pathname === "/admin/experiences" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/experiences")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Expériences
          </Button>
          <Button
            variant={pathname === "/admin/projects" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/projects")}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Projets
          </Button>
          <Button
            variant={pathname === "/admin/education" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/education")}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Formation
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Contenu
        </h2>
        <div className="space-y-1">
          <Button
            variant={pathname === "/admin/about" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/about")}
          >
            <User className="mr-2 h-4 w-4" />
            À propos
          </Button>
          <Button
            variant={pathname === "/admin/blog" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/blog")}
          >
            <BookText className="mr-2 h-4 w-4" />
            Blog
          </Button>
          <Button
            variant={pathname === "/admin/tech-watch" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate("/admin/tech-watch")}
          >
            <Rss className="mr-2 h-4 w-4" />
            Veille
          </Button>
        </div>
      </div>
    </div>
  );
}
