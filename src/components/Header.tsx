
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Accueil", path: "/" },
  { name: "Compétences", path: "/competences" },
  { name: "Expérience", path: "/experience" },
  { name: "Formation", path: "/formation" },
  { name: "Projets", path: "/projets" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Andrea Hardy
        </Link>
        <nav className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`transition-colors ${
                location.pathname === item.path
                  ? "text-primary font-medium"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Button variant="outline" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
