
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
  Home,
  Menu,
  X,
  Settings
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b backdrop-blur-md shadow-sm hidden md:block">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink 
              to="/" 
              className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
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

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b shadow-sm md:hidden px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink 
            to="/" 
            className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Andrea Hardy
          </NavLink>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] sm:w-[350px]">
              <div className="space-y-6 py-6">
                <h2 className="text-lg font-semibold text-primary">Menu</h2>
                
                <div className="space-y-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Accueil
                  </NavLink>
                  
                  <NavLink
                    to="/a-propos"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <User className="mr-2 h-4 w-4" />
                    À propos
                  </NavLink>
                  
                  <NavLink
                    to="/competences"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <Code2 className="mr-2 h-4 w-4" />
                    Compétences
                  </NavLink>
                  
                  <NavLink
                    to="/experience"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Expérience
                  </NavLink>
                  
                  <NavLink
                    to="/formation"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Formation
                  </NavLink>
                  
                  <NavLink
                    to="/projets"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Projets
                  </NavLink>
                  
                  <NavLink
                    to="/veille-techno"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <Rss className="mr-2 h-4 w-4" />
                    Veille Techno
                  </NavLink>
                  
                  <NavLink
                    to="/blog"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Blog
                  </NavLink>
                  
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </NavLink>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        cn(
                          "flex items-center py-2 px-3 rounded-md w-full text-sm transition-colors",
                          isActive 
                            ? "bg-primary text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                        )
                      }
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {isAuthenticated ? "Administration" : "Connexion"}
                    </NavLink>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Mobile Navigation Bar (Instagram Style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 md:hidden shadow-lg">
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
            to={isAuthenticated ? "/admin" : "/login"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            {isAuthenticated ? (
              <>
                <Settings className="w-6 h-6 mb-1" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6 mb-1" />
                <span>Login</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  );
};
