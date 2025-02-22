
import { NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-lg font-semibold">
            Andrea Hardy
          </NavLink>
          
          <div className="flex items-center gap-6">
            <NavLink
              to="/a-propos"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              À propos
            </NavLink>
            <NavLink
              to="/competences"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Compétences
            </NavLink>
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Expérience
            </NavLink>
            <NavLink
              to="/formation"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Formation
            </NavLink>
            <NavLink
              to="/projets"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Projets
            </NavLink>
            <NavLink
              to="/veille-techno"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Veille Techno
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-gray-600"
                )
              }
            >
              Blog
            </NavLink>
            <NavLink to="/login">
              <Button variant="ghost" size="sm" className="gap-2">
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
