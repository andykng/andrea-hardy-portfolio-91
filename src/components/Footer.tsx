
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Andrea Hardy</h3>
            <p className="text-gray-600">
              Administratrice Système & Réseau passionnée par la sécurité et la gestion de projets IT
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="flex flex-col space-y-2">
              <Button variant="link" className="w-fit p-0 h-auto text-gray-600 hover:text-primary">
                <Mail className="w-4 h-4 mr-2" />
                contact@andreahardy.fr
              </Button>
              <Button variant="link" className="w-fit p-0 h-auto text-gray-600 hover:text-primary">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="link" className="w-fit p-0 h-auto text-gray-600 hover:text-primary">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localisation</h3>
            <p className="text-gray-600">
              Rennes, France
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {new Date().getFullYear()} Andrea Hardy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
