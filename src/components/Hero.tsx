
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section id="accueil" className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-down">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Andrea Hardy"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Bonjour, je suis <span className="text-primary">Andrea Hardy</span>
          </h1>
          <p className="text-xl text-gray-600">
            Administratrice Système & Réseau passionnée par la sécurité et la gestion de projets IT
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Mon CV</Button>
            <Button variant="outline" size="lg">Me Contacter</Button>
          </div>
        </div>
        <a
          href="#competences"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </a>
      </div>
    </section>
  );
};
