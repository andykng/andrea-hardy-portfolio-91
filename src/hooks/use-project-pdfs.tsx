import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ProjectPDF, ProjectsConfig } from '@/types/project-pdf';
import { useRealtimeSubscription } from './use-realtime-subscription';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

// Listes manuelles de fichiers si la récupération automatique échoue
const manualYear1Files = [
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

const manualYear2Files = [
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

// Icônes par défaut basées sur les catégories ou les mots clés dans le titre
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
  
  // Activer la subscription en temps réel pour les mises à jour
  useRealtimeSubscription({
    table: 'projects_config',
    queryKeys: ['projects', 'public'],
  });

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

  // Fonction pour charger les projets depuis la configuration
  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Essayer de récupérer la configuration depuis Supabase
      const { data, error } = await supabase
        .from('projects_config')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        throw error;
      }
      
      if (data && data.config) {
        // Vérifier si config.projects existe et est un tableau
        const configData = data.config as any;
        if (configData.projects && Array.isArray(configData.projects)) {
          console.log('Configuration de projets récupérée:', configData.projects.length, 'projets');
          setProjects(configData.projects);
        } else {
          // Si projects n'existe pas ou n'est pas un tableau
          console.log('Aucune liste de projets valide trouvée, génération automatique...');
          await generateAndSaveProjectsConfig();
        }
      } else {
        // Si pas de config ou config vide, générer automatiquement
        console.log('Aucune configuration de projets trouvée, génération automatique...');
        await generateAndSaveProjectsConfig();
      }
    } catch (err) {
      console.error('Erreur dans loadProjects:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // En cas d'erreur, utiliser les listes manuelles
      await generateAndSaveProjectsConfig();
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour générer et sauvegarder la configuration des projets
  const generateAndSaveProjectsConfig = async () => {
    try {
      console.log('Génération de la configuration des projets...');
      
      // Utiliser les listes manuelles pour garantir le fonctionnement
      console.log('Utilisation de la liste manuelle - Fichiers année 1:', manualYear1Files.length);
      console.log('Utilisation de la liste manuelle - Fichiers année 2:', manualYear2Files.length);
      
      const year1Projects = manualYear1Files.map(filename => fileToProject(filename, 1));
      const year2Projects = manualYear2Files.map(filename => fileToProject(filename, 2));
      
      const allProjects = [...year1Projects, ...year2Projects];
      setProjects(allProjects);
      
      // Sauvegarder la configuration dans Supabase
      const success = await saveProjectsConfig(allProjects);
      if (success) {
        console.log('Configuration générée et sauvegardée avec succès!');
        toast({
          title: 'Succès',
          description: 'La liste des documentations PDF a été générée avec succès',
          variant: 'default',
        });
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération de la configuration:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Fonction pour sauvegarder la configuration des projets
  const saveProjectsConfig = async (projectsList: ProjectPDF[]) => {
    try {
      const projectsConfig: ProjectsConfig = { projects: projectsList };
      
      // Vérifier si la configuration existe déjà
      const { data, error: checkError } = await supabase
        .from('projects_config')
        .select('id')
        .eq('id', 1)
        .maybeSingle();
      
      if (checkError) {
        console.error('Erreur lors de la vérification de la configuration:', checkError);
      }
      
      let result;
      
      if (data) {
        // Mettre à jour la configuration existante
        result = await supabase
          .from('projects_config')
          .update({ 
            config: projectsConfig as unknown as Json,
            updated_at: new Date().toISOString() 
          })
          .eq('id', 1);
      } else {
        // Créer une nouvelle configuration
        result = await supabase
          .from('projects_config')
          .insert({ 
            id: 1, 
            config: projectsConfig as unknown as Json 
          });
      }
      
      if (result.error) {
        console.error('Erreur lors de la sauvegarde de la configuration:', result.error);
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder la configuration des projets',
          variant: 'destructive',
        });
        return false;
      } else {
        console.log('Configuration des projets sauvegardée avec succès');
        return true;
      }
    } catch (error) {
      console.error('Erreur dans saveProjectsConfig:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Fonction pour mettre à jour un projet
  const updateProject = async (updatedProject: ProjectPDF) => {
    try {
      const updatedProjects = projects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
      
      setProjects(updatedProjects);
      await saveProjectsConfig(updatedProjects);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
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
    saveProjectsConfig,
    updateProject,
    generateAndSaveProjectsConfig
  };
};
