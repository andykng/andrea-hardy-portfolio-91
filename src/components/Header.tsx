
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
  Mail,
  Home
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b backdrop-blur-md bg-white/80 hidden md:block">
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

      {/* Mobile Navigation Bar (Instagram Style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <Home className="w-6 h-6 mb-1" />
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to="/projets"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <FolderKanban className="w-6 h-6 mb-1" />
            <span>Projets</span>
          </NavLink>

          <NavLink
            to="/competences"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <Code2 className="w-6 h-6 mb-1" />
            <span>Skills</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <Mail className="w-6 h-6 mb-1" />
            <span>Contact</span>
          </NavLink>

          <NavLink
            to="/a-propos"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <User className="w-6 h-6 mb-1" />
            <span>Profil</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};
