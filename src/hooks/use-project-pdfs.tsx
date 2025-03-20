
import { useState, useEffect } from "react";
import { ProjectPDF, ProjectsConfig, ProjectsConfigTable } from "@/types/project-pdf";
import { supabase } from "@/integrations/supabase/client";

// Fonction pour formater le titre à partir du nom de fichier
const formatTitle = (filename: string): string => {
  // Remplacer les underscores et tirets par des espaces
  const withoutExtension = filename.replace('.pdf', '');
  // Remplacer les underscores et tirets par des espaces
  const withSpaces = withoutExtension.replace(/[_-]/g, ' ');
  // Capitaliser chaque mot
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Récupérer la liste de tous les PDF des projets
export const useProjectPDFs = () => {
  const [projects, setProjects] = useState<ProjectPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Récupérer la configuration depuis Supabase
        const { data: configData, error: configError } = await supabase
          .from('projects_config')
          .select('*')
          .single();

        let config: ProjectsConfig = { projects: [] };
        if (configError && configError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération de la configuration:", configError);
        } else if (configData) {
          const typedConfigData = configData as unknown as ProjectsConfigTable;
          config = typedConfigData.config;
        }

        // Liste des projets de l'année 1
        const year1Files: ProjectPDF[] = [];
        try {
          const year1Response = await fetch('/project année 1/');
          if (!year1Response.ok) throw new Error("Impossible de charger les projets de l'année 1");
          const year1Text = await year1Response.text();
          
          // Parser le HTML pour trouver les liens PDF
          const year1Parser = new DOMParser();
          const year1Doc = year1Parser.parseFromString(year1Text, 'text/html');
          
          const year1Links = Array.from(year1Doc.querySelectorAll('a'));
          
          for (const a of year1Links) {
            const href = a.getAttribute('href');
            if (href && href.endsWith('.pdf')) {
              const filename = href.split('/').pop() || '';
              const id = `year1_${filename}`;
              
              // Chercher si le projet existe déjà dans la configuration
              const existingProject = config.projects.find(p => p.id === id);
              
              year1Files.push({
                id,
                title: formatTitle(filename),
                year: 1 as const,
                path: `/project année 1/${filename}`,
                icon: existingProject?.icon || 'file'
              });
            }
          }
          console.log("Fichiers de l'année 1 trouvés:", year1Files.length);
        } catch (err) {
          console.error("Erreur lors du chargement des projets de l'année 1:", err);
        }

        // Liste des projets de l'année 2
        const year2Files: ProjectPDF[] = [];
        try {
          const year2Response = await fetch('/project année 2/');
          if (!year2Response.ok) throw new Error("Impossible de charger les projets de l'année 2");
          const year2Text = await year2Response.text();
          
          // Parser le HTML pour trouver les liens PDF
          const year2Parser = new DOMParser();
          const year2Doc = year2Parser.parseFromString(year2Text, 'text/html');
          
          const year2Links = Array.from(year2Doc.querySelectorAll('a'));
          
          for (const a of year2Links) {
            const href = a.getAttribute('href');
            if (href && href.endsWith('.pdf')) {
              const filename = href.split('/').pop() || '';
              const id = `year2_${filename}`;
              
              // Chercher si le projet existe déjà dans la configuration
              const existingProject = config.projects.find(p => p.id === id);
              
              year2Files.push({
                id,
                title: formatTitle(filename),
                year: 2 as const,
                path: `/project année 2/${filename}`,
                icon: existingProject?.icon || 'file'
              });
            }
          }
          console.log("Fichiers de l'année 2 trouvés:", year2Files.length);
        } catch (err) {
          console.error("Erreur lors du chargement des projets de l'année 2:", err);
        }

        // Si aucun fichier n'a été trouvé, essayons de les lister manuellement
        if (year1Files.length === 0 && year2Files.length === 0) {
          // Liste des fichiers connus pour l'année 1
          const year1KnownFiles = [
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
            "Étude du Contexte _ Calculs d'Adresses IP et Sous-Réseaux.pdf"
          ];
          
          for (const filename of year1KnownFiles) {
            const id = `year1_${filename}`;
            const existingProject = config.projects.find(p => p.id === id);
            
            year1Files.push({
              id,
              title: formatTitle(filename),
              year: 1 as const,
              path: `/project année 1/${filename}`,
              icon: existingProject?.icon || 'file'
            });
          }
          
          // Liste des fichiers connus pour l'année 2
          const year2KnownFiles = [
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
            "zabbix.pdf"
          ];
          
          for (const filename of year2KnownFiles) {
            const id = `year2_${filename}`;
            const existingProject = config.projects.find(p => p.id === id);
            
            year2Files.push({
              id,
              title: formatTitle(filename),
              year: 2 as const,
              path: `/project année 2/${filename}`,
              icon: existingProject?.icon || 'file'
            });
          }
          
          console.log("Utilisation de la liste manuelle - Fichiers année 1:", year1Files.length);
          console.log("Utilisation de la liste manuelle - Fichiers année 2:", year2Files.length);
        }

        setProjects([...year1Files, ...year2Files]);
      } catch (err) {
        console.error("Erreur lors du chargement des projets:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

// Sauvegarder la configuration des projets
export const saveProjectsConfig = async (projects: ProjectPDF[]) => {
  try {
    const config: ProjectsConfig = { projects };
    
    // Cast the config to Json explicitly to satisfy TypeScript
    const { data, error } = await supabase
      .from('projects_config')
      .upsert({ 
        id: 1, 
        config: config as unknown as any
      }, { onConflict: 'id' });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration:", error);
    return { success: false, error };
  }
};
