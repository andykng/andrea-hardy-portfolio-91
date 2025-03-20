
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkIcon, Server, Shield, TerminalSquare, User, Database, Laptop, Cloud, Router, GanttChart } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { fadeInOnScroll } from "@/lib/animations";
import { useEffect } from "react";

// Tech logos with their URLs
const techLogos = [
  { name: "ProFTPD", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487801/proftpd_zncgtu.png" },
  { name: "HTTPS", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/https_lkuelr.png" },
  { name: "Samba", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/samba_ttra9z.jpg" },
  { name: "OPNsense", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/opensense_hjm5hj.jpg" },
  { name: "Fail2ban", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/fail2ban_paxiav.png" },
  { name: "Active Directory", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/active_directory_ag6m4u.png" },
  { name: "Rescuezilla", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/rescuezila_qiz7pz.png" },
  { name: "Proxmox", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/proxmox_diep5e.png" },
  { name: "BackupPC", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/backuppc_fhko15.jpg" },
  { name: "Munin", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/munin_umpvcc.jpg" },
  { name: "Zabbix", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/zabbix_oret7o.jpg" },
  { name: "GPG", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/gpg_ts1ixe.png" },
  { name: "MariaDB", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/mariadb_m7dqye.png" },
  { name: "Packet Tracer", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/packet_tracer_ctzfbu.png" },
  { name: "DHCP", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/dhcp_brlhwq.png" },
  { name: "Netfilter", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/netfilter_h1wgyq.png" },
  { name: "DNS", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/dns_zwz6ym.jpg" },
  { name: "OCS Inventory", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ocs_inventory_pnphau.png" },
  { name: "SSH", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ssh_j4iu6y.png" },
];

// Updated skill arrays with logo URLs
const systemNetworkSkills = [
  {
    name: "Windows Server",
    icon: Server,
    description: "Administration et configuration",
    logoUrl: null
  },
  {
    name: "Linux",
    icon: TerminalSquare,
    description: "Gestion de serveurs Linux",
    logoUrl: null
  },
  {
    name: "Virtualisation",
    icon: null,
    description: "VMware, VirtualBox, Proxmox",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/proxmox_diep5e.png"
  },
  {
    name: "VLAN",
    icon: NetworkIcon,
    description: "Configuration des réseaux virtuels",
    logoUrl: null
  },
  {
    name: "DHCP",
    icon: null,
    description: "Distribution d'adresses IP",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/dhcp_brlhwq.png"
  },
  {
    name: "DNS",
    icon: null,
    description: "Résolution de noms de domaine",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/dns_zwz6ym.jpg"
  },
  {
    name: "Apache2",
    icon: Server,
    description: "Configuration de serveurs web",
    logoUrl: null
  },
  {
    name: "MariaDB",
    icon: null,
    description: "Gestion de bases de données",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/mariadb_m7dqye.png"
  },
  {
    name: "SSH",
    icon: null,
    description: "Connexion sécurisée",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ssh_j4iu6y.png"
  },
  {
    name: "Samba",
    icon: null,
    description: "Partage de fichiers",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/samba_ttra9z.jpg"
  },
  {
    name: "ProFTPD",
    icon: null,
    description: "Serveur FTP",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487801/proftpd_zncgtu.png"
  },
];

const securitySkills = [
  {
    name: "Pare-feu",
    icon: Shield,
    description: "Protection réseau",
    logoUrl: null
  },
  {
    name: "OPNsense",
    icon: null,
    description: "Firewall open-source",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/opensense_hjm5hj.jpg"
  },
  {
    name: "Fail2ban",
    icon: null,
    description: "Protection contre les attaques par force brute",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/fail2ban_paxiav.png"
  },
  {
    name: "Netfilter",
    icon: null,
    description: "Filtrage réseau",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/netfilter_h1wgyq.png"
  },
  {
    name: "HTTPS/SSL",
    icon: null,
    description: "Certificats et connexions sécurisées",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/https_lkuelr.png"
  },
  {
    name: "GPG",
    icon: null,
    description: "Chiffrement et signatures",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/gpg_ts1ixe.png"
  },
  {
    name: "Gestion des accès",
    icon: User,
    description: "Contrôle d'accès et permissions",
    logoUrl: null
  },
];

const cloudSkills = [
  {
    name: "Docker",
    icon: Cloud,
    description: "Conteneurisation",
    logoUrl: null
  },
  {
    name: "Proxmox",
    icon: null,
    description: "Virtualisation open-source",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/proxmox_diep5e.png"
  },
  {
    name: "AWS",
    icon: Cloud,
    description: "Services cloud Amazon",
    logoUrl: null
  },
  {
    name: "Azure",
    icon: Cloud,
    description: "Services cloud Microsoft",
    logoUrl: null
  },
];

const supportSkills = [
  {
    name: "Diagnostic d'incidents",
    icon: TerminalSquare,
    description: "Résolution de problèmes techniques",
    logoUrl: null
  },
  {
    name: "Packet Tracer",
    icon: null,
    description: "Simulation réseau",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/packet_tracer_ctzfbu.png"
  },
  {
    name: "Active Directory",
    icon: null,
    description: "Gestion des utilisateurs Windows",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/active_directory_ag6m4u.png"
  },
  {
    name: "OCS Inventory",
    icon: null,
    description: "Inventaire informatique",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ocs_inventory_pnphau.png"
  },
  {
    name: "Zabbix",
    icon: null,
    description: "Surveillance informatique",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/zabbix_oret7o.jpg"
  },
  {
    name: "Munin",
    icon: null,
    description: "Monitoring système",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/munin_umpvcc.jpg"
  },
  {
    name: "BackupPC",
    icon: null,
    description: "Solution de sauvegarde",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/backuppc_fhko15.jpg"
  },
  {
    name: "Rescuezilla",
    icon: null,
    description: "Récupération de données",
    logoUrl: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/rescuezila_qiz7pz.png"
  },
];

const softSkills = [
  {
    name: "Communication",
    icon: User,
    description: "Échange clair et efficace",
    logoUrl: null
  },
  {
    name: "Travail d'équipe",
    icon: User,
    description: "Collaboration et partage",
    logoUrl: null
  },
  {
    name: "Résolution de problèmes",
    icon: TerminalSquare,
    description: "Analyse et solutions",
    logoUrl: null
  },
  {
    name: "Organisation",
    icon: GanttChart,
    description: "Gestion du temps et des tâches",
    logoUrl: null
  },
  {
    name: "Adaptabilité",
    icon: User,
    description: "Flexibilité face aux changements",
    logoUrl: null
  },
  {
    name: "Autonomie",
    icon: User,
    description: "Initiative et indépendance",
    logoUrl: null
  },
];

const LogoBanner = () => {
  return (
    <div className="w-full py-8 bg-primary/5 rounded-lg mb-8">
      <h3 className="text-xl font-semibold text-center mb-6">Technologies maîtrisées</h3>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="px-4">
            {techLogos.map((logo, index) => (
              <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/6">
                <div className="p-2 h-full">
                  <div className="flex flex-col items-center justify-center space-y-2 bg-white rounded-md shadow-sm p-4 h-32">
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="h-16 w-16 object-contain" 
                    />
                    <span className="text-xs font-medium text-center">{logo.name}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

const SkillCard = ({ skill }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 h-12 w-12 flex items-center justify-center">
            {skill.logoUrl ? (
              <img src={skill.logoUrl} alt={skill.name} className="h-8 w-8 object-contain" />
            ) : (
              skill.icon && <skill.icon className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-lg">{skill.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-muted-foreground text-sm">{skill.description}</p>
      </CardContent>
    </Card>
  );
};

export const Skills = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.skill-card');
    fadeInOnScroll(Array.from(elements));
  }, []);

  return (
    <section id="competences" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Mes Compétences</h2>
        
        <LogoBanner />
        
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
                <div key={skill.name} className="skill-card">
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="securite" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {securitySkills.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cloud" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cloudSkills.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {supportSkills.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="savoir-etre" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {softSkills.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
