
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Liste des technologies avec leurs logos
export const techLogos = [
  { name: "ProFTPD", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487801/proftpd_zncgtu.png", description: "Serveur FTP sécurisé" },
  { name: "HTTPS", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/https_lkuelr.png", description: "Protocole de communication sécurisé" },
  { name: "Samba", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/samba_ttra9z.jpg", description: "Partage de fichiers entre systèmes" },
  { name: "OPNsense", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/opensense_hjm5hj.jpg", description: "Firewall & routeur open-source" },
  { name: "Fail2ban", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/fail2ban_paxiav.png", description: "Protection contre les attaques par force brute" },
  { name: "Active Directory", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/active_directory_ag6m4u.png", description: "Service d'annuaire de Microsoft" },
  { name: "Rescuezilla", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/rescuezila_qiz7pz.png", description: "Outil de sauvegarde et récupération" },
  { name: "Proxmox", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/proxmox_diep5e.png", description: "Plateforme de virtualisation" },
  { name: "BackupPC", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/backuppc_fhko15.jpg", description: "Solution de sauvegarde" },
  { name: "Munin", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/munin_umpvcc.jpg", description: "Outil de surveillance système" },
  { name: "Zabbix", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/zabbix_oret7o.jpg", description: "Plateforme de surveillance réseau" },
  { name: "GPG", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/gpg_ts1ixe.png", description: "Chiffrement et signature numérique" },
  { name: "MariaDB", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/mariadb_m7dqye.png", description: "Système de gestion de base de données" },
  { name: "Packet Tracer", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/packet_tracer_ctzfbu.png", description: "Simulateur de réseau Cisco" },
  { name: "DHCP", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487799/dhcp_brlhwq.png", description: "Attribution automatique d'adresses IP" },
  { name: "Netfilter", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/netfilter_h1wgyq.png", description: "Filtrage de paquets réseau" },
  { name: "DNS", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/dns_zwz6ym.jpg", description: "Système de noms de domaine" },
  { name: "OCS Inventory", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ocs_inventory_pnphau.png", description: "Inventaire informatique automatisé" },
  { name: "SSH", url: "https://res.cloudinary.com/drbfimvy9/image/upload/v1742487798/ssh_j4iu6y.png", description: "Protocole de connexion sécurisée" },
];

interface TechLogoProps {
  tech: {
    name: string;
    url: string;
    description: string;
  };
}

const TechLogo = ({ tech }: TechLogoProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full cursor-pointer">
          <div className="relative h-20 w-20 flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-md"></div>
            )}
            <img
              src={tech.url}
              alt={`Logo ${tech.name}`}
              className={`object-contain max-h-full max-w-full ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <span className="mt-3 text-sm font-medium text-center">{tech.name}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{tech.name}</h4>
            <p className="text-sm text-muted-foreground">{tech.description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export const TechGrid = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Outils et technologies maîtrisés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {techLogos.map((tech) => (
            <div key={tech.name} className="tech-logo skill-card">
              <TechLogo tech={tech} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
