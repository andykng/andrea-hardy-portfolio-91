
import { NavLink } from "react-router-dom";
import { 
  LogIn, 
  User, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  FolderKanban,
  Rss,
  BookOpen,
  Mail
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b backdrop-blur-md bg-white/80">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink 
            to="/" 
            className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Andrea Hardy
          </NavLink>
          
          <div className="flex items-center gap-6">
            <NavLink
              to="/a-propos"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <User className="w-4 h-4" />
              À propos
            </NavLink>
            <NavLink
              to="/competences"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <Code2 className="w-4 h-4" />
              Compétences
            </NavLink>
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <Briefcase className="w-4 h-4" />
              Expérience
            </NavLink>
            <NavLink
              to="/formation"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <GraduationCap className="w-4 h-4" />
              Formation
            </NavLink>
            <NavLink
              to="/projets"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <FolderKanban className="w-4 h-4" />
              Projets
            </NavLink>
            <NavLink
              to="/veille-techno"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <Rss className="w-4 h-4" />
              Veille Techno
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary flex items-center gap-2",
                  isActive ? "text-primary font-medium" : "text-gray-600"
                )
              }
            >
              <Mail className="w-4 h-4" />
              Contact
            </NavLink>
            <NavLink to="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:bg-primary/10 hover:text-primary"
              >
                <LogIn className="w-4 h-4" />
                {isAuthenticated ? "Administration" : "Connexion"}
              </Button>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
