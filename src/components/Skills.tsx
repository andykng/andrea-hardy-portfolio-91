
import { Code, Server, Shield, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const skills = [
  {
    title: "Systèmes & Réseaux",
    icon: Server,
    items: ["Windows Server", "Linux", "Virtualisation", "VLAN", "DHCP", "DNS", "Apache2", "MariaDB"],
  },
  {
    title: "Sécurité",
    icon: Shield,
    items: ["Pare-feu", "Chiffrement", "SSL/TLS", "GPG", "Gestion des accès", "IAM"],
  },
  {
    title: "Virtualisation & Cloud",
    icon: Cloud,
    items: ["Docker", "Proxmox", "AWS", "Azure"],
  },
  {
    title: "Support & Projets",
    icon: Code,
    items: ["Diagnostic d'incidents", "Documentation", "Gestion de projets IT"],
  },
];

export const Skills = () => {
  return (
    <section id="competences" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Mes Compétences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <Card key={skill.title} className="animate-fade-up">
              <CardHeader>
                <skill.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
