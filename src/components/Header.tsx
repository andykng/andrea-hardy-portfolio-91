
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-semibold">
          Andrea Hardy
        </a>
        <nav className="hidden md:flex space-x-8">
          {["Accueil", "Compétences", "Expérience", "Formation", "Blog"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <Button variant="outline" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
