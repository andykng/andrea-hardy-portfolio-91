
import { NetworkIcon, NetworkPort, Server, Shield, TerminalSquare, User, Database, Laptop, Cable, Cloud, Router, GanttChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systemNetworkSkills = [
  {
    name: "Windows Server",
    icon: Server,
    description: "Administration et configuration",
  },
  {
    name: "Linux",
    icon: TerminalSquare,
    description: "Gestion de serveurs Linux",
  },
  {
    name: "Virtualisation",
    icon: Laptop,
    description: "VMware, VirtualBox, Proxmox",
  },
  {
    name: "VLAN",
    icon: NetworkIcon,
    description: "Configuration des réseaux virtuels",
  },
  {
    name: "DHCP",
    icon: NetworkPort,
    description: "Distribution d'adresses IP",
  },
  {
    name: "DNS",
    icon: GanttChart,
    description: "Résolution de noms de domaine",
  },
  {
    name: "Apache2",
    icon: Server,
    description: "Configuration de serveurs web",
  },
  {
    name: "MariaDB",
    icon: Database,
    description: "Gestion de bases de données",
  },
];

const securitySkills = [
  {
    name: "Pare-feu",
    icon: Shield,
    description: "Protection réseau",
  },
  {
    name: "Chiffrement",
    icon: Shield,
    description: "Sécurisation des données",
  },
  {
    name: "SSL/TLS",
    icon: Shield,
    description: "Certificats et connexions sécurisées",
  },
  {
    name: "GPG",
    icon: Shield,
    description: "Chiffrement et signatures",
  },
  {
    name: "Gestion des accès",
    icon: User,
    description: "Contrôle d'accès et permissions",
  },
  {
    name: "IAM",
    icon: User,
    description: "Gestion des identités",
  },
];

const cloudSkills = [
  {
    name: "Docker",
    icon: Cloud,
    description: "Conteneurisation",
  },
  {
    name: "Proxmox",
    icon: Server,
    description: "Virtualisation open-source",
  },
  {
    name: "AWS",
    icon: Cloud,
    description: "Services cloud Amazon",
  },
  {
    name: "Azure",
    icon: Cloud,
    description: "Services cloud Microsoft",
  },
];

const softSkills = [
  {
    name: "Communication",
    icon: User,
    description: "Échange clair et efficace",
  },
  {
    name: "Travail d'équipe",
    icon: User,
    description: "Collaboration et partage",
  },
  {
    name: "Résolution de problèmes",
    icon: TerminalSquare,
    description: "Analyse et solutions",
  },
  {
    name: "Organisation",
    icon: GanttChart,
    description: "Gestion du temps et des tâches",
  },
  {
    name: "Adaptabilité",
    icon: User,
    description: "Flexibilité face aux changements",
  },
  {
    name: "Autonomie",
    icon: User,
    description: "Initiative et indépendance",
  },
];

const supportSkills = [
  {
    name: "Diagnostic d'incidents",
    icon: TerminalSquare,
    description: "Résolution de problèmes techniques",
  },
  {
    name: "Documentation",
    icon: Laptop,
    description: "Rédaction technique",
  },
  {
    name: "Gestion de projets IT",
    icon: GanttChart,
    description: "Planification et suivi",
  },
];

export const Skills = () => {
  return (
    <section id="competences" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Mes Compétences</h2>
        
        <Tabs defaultValue="systemes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="systemes">Systèmes & Réseaux</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
            <TabsTrigger value="cloud">Cloud & Virtualisation</TabsTrigger>
            <TabsTrigger value="support">Support & Projets</TabsTrigger>
            <TabsTrigger value="savoir-etre">Savoir-être</TabsTrigger>
          </TabsList>
          
          <TabsContent value="systemes" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {systemNetworkSkills.map((skill) => (
                <Card key={skill.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-primary/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="securite" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {securitySkills.map((skill) => (
                <Card key={skill.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-primary/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cloud" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cloudSkills.map((skill) => (
                <Card key={skill.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-primary/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {supportSkills.map((skill) => (
                <Card key={skill.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-primary/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="savoir-etre" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {softSkills.map((skill) => (
                <Card key={skill.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="bg-primary/5 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
