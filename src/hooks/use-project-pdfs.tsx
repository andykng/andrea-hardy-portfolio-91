
import { useState, useEffect } from 'react';
import { ProjectPDF } from '@/types/project-pdf';
import { useToast } from '@/components/ui/use-toast';

// Listes des fichiers dans les répertoires
const year1Files = [
  "atelier_n_6_-_apache2.pdf",
  "bind.pdf",
  "configuration_de_ssh.pdf",
  "dhcp (1).pdf",
  "etape_1_mise_a_jour_du_systeme (1).pdf",
  "etude_du_contexte.pdf",
  "fail2ban.pdf",
  "ftp.pdf",
  "installation_des_systemes.pdf",
  "installation_lamp.pdf",
  "installation_lxc_sur_le_serveur_en_root.pdf",
  "iptables_netfilter.pdf",
  "munin.pdf",
  "rsync.pdf",
  "ssl_tls.pdf",
  "vlan.pdf",
  "Étude du Contexte _ Calculs d'Adresses IP et Sous-Réseaux.pdf",
];

const year2Files = [
  "Récupération d'une configuration.pdf",
  "active_directory_windows_server (1).pdf",
  "authentification_gpg (1).pdf",
  "configuration_d_un_serveur_de_bases_de_donnees (1).pdf",
  "configuration_tls_sur_proftpd (1).pdf", 
  "contexte_gsb (2).pdf",
  "dhcp1.pdf",
  "dhcp2.pdf",
  "dns (1).pdf",
  "ftp (1).pdf",
  "http (1).pdf",
  "installation (1).pdf",
  "opnsense (1).pdf",
  "portsentry_fail2ban (1).pdf",
  "serveur de sauvegarde.pdf",
  "zabbix.pdf",
];

// Fonction pour obtenir l'icône par défaut
const getDefaultIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('apache') || lowerTitle.includes('http')) return 'server';
  if (lowerTitle.includes('ssh') || lowerTitle.includes('tls') || lowerTitle.includes('ssl')) return 'shield';
  if (lowerTitle.includes('dns') || lowerTitle.includes('bind')) return 'globe';
  if (lowerTitle.includes('ftp')) return 'folder-open';
  if (lowerTitle.includes('dhcp')) return 'network';
  if (lowerTitle.includes('iptables') || lowerTitle.includes('firewall')) return 'shield-alert';
  if (lowerTitle.includes('active_directory') || lowerTitle.includes('windows')) return 'windows';
  if (lowerTitle.includes('gpg') || lowerTitle.includes('authentification')) return 'key';
  if (lowerTitle.includes('base') || lowerTitle.includes('donnees')) return 'database';
  if (lowerTitle.includes('sauvegarde') || lowerTitle.includes('backup')) return 'save';
  if (lowerTitle.includes('zabbix') || lowerTitle.includes('munin')) return 'activity';
  if (lowerTitle.includes('fail2ban')) return 'ban';
  if (lowerTitle.includes('installation')) return 'download';
  if (lowerTitle.includes('config')) return 'settings';
  if (lowerTitle.includes('vlan') || lowerTitle.includes('reseau')) return 'network';
  
  return 'file-text'; // Icône par défaut
};

// Fonction pour générer un nom d'affichage plus lisible
const generateDisplayName = (filename: string): string => {
  // Supprimer l'extension et les parenthèses avec chiffres
  let name = filename.replace(/\.[^/.]+$/, '').replace(/\s*\(\d+\)\s*/g, ' ');
  
  // Remettre en forme avec des espaces et capitalisation
  name = name.replace(/_/g, ' ').replace(/-/g, ' ');
  
  // Capitaliser chaque mot
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  return name.trim();
};

// Fonction pour déterminer la catégorie basée sur le nom de fichier
const determineCategory = (filename: string): string => {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('apache') || lowerName.includes('http') || lowerName.includes('lamp')) 
    return 'Serveur Web';
  if (lowerName.includes('ssh') || lowerName.includes('tls') || lowerName.includes('ssl') || 
     lowerName.includes('authentification') || lowerName.includes('gpg')) 
    return 'Sécurité';
  if (lowerName.includes('dns') || lowerName.includes('bind')) 
    return 'DNS';
  if (lowerName.includes('ftp')) 
    return 'Transfert de fichiers';
  if (lowerName.includes('dhcp')) 
    return 'DHCP';
  if (lowerName.includes('iptables') || lowerName.includes('firewall') || 
     lowerName.includes('fail2ban') || lowerName.includes('portsentry')) 
    return 'Firewall & Sécurité';
  if (lowerName.includes('active_directory') || lowerName.includes('windows')) 
    return 'Windows Server';
  if (lowerName.includes('base') || lowerName.includes('donnees')) 
    return 'Bases de données';
  if (lowerName.includes('sauvegarde') || lowerName.includes('backup') || lowerName.includes('rsync')) 
    return 'Sauvegarde';
  if (lowerName.includes('zabbix') || lowerName.includes('munin')) 
    return 'Monitoring';
  if (lowerName.includes('installation') || lowerName.includes('config') || lowerName.includes('mise_a_jour')) 
    return 'Installation & Configuration';
  if (lowerName.includes('vlan') || lowerName.includes('reseau') || lowerName.includes('ip') || 
     lowerName.includes('sous-reseau')) 
    return 'Réseaux';
  if (lowerName.includes('opnsense')) 
    return 'Firewall OPNsense';
  if (lowerName.includes('lxc') || lowerName.includes('contexte')) 
    return 'Infrastructure';
  
  return 'Autre';
};

export const useProjectPDFs = () => {
  const [projects, setProjects] = useState<ProjectPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fonction pour convertir un fichier en objet ProjectPDF
  const fileToProject = (filename: string, year: 1 | 2): ProjectPDF => {
    const id = `${year}-${filename}`;
    const path = `/project année ${year}/${filename}`;
    const displayName = generateDisplayName(filename);
    const category = determineCategory(filename);
    const icon = getDefaultIcon(filename);
    
    return {
      id,
      title: filename,
      displayName,
      year,
      path,
      icon,
      category
    };
  };

  // Fonction pour charger les projets directement depuis les listes de fichiers
  const loadProjects = () => {
    try {
      setLoading(true);
      
      // Créer les projets à partir des listes de fichiers
      const year1Projects = year1Files.map(filename => fileToProject(filename, 1));
      const year2Projects = year2Files.map(filename => fileToProject(filename, 2));
      
      const allProjects = [...year1Projects, ...year2Projects];
      setProjects(allProjects);
      
      console.log(`Chargement de ${allProjects.length} projets PDF terminé`);
      
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les documentations PDF',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sauvegarder les modifications de projet
  const updateProject = (updatedProject: ProjectPDF): boolean => {
    try {
      // Chercher l'index du projet à mettre à jour
      const projectIndex = projects.findIndex(p => p.id === updatedProject.id);
      
      // Si le projet existe, le mettre à jour
      if (projectIndex !== -1) {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;
        setProjects(updatedProjects);
        
        toast({
          title: 'Succès',
          description: 'Le projet a été mis à jour avec succès',
        });
        
        return true;
      } else {
        console.error('Projet non trouvé:', updatedProject.id);
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet:', err);
      return false;
    }
  };

  // Charger les projets au montage du composant
  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    loadProjects,
    updateProject
  };
};
