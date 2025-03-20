
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
        const year1Response = await fetch('/project année 1/');
        if (!year1Response.ok) throw new Error("Impossible de charger les projets de l'année 1");
        const year1Text = await year1Response.text();
        
        // Parser le HTML pour trouver les liens PDF
        const year1Parser = new DOMParser();
        const year1Doc = year1Parser.parseFromString(year1Text, 'text/html');
        const year1Files = Array.from(year1Doc.querySelectorAll('a'))
          .filter(a => a.href.endsWith('.pdf'))
          .map(a => {
            const filename = a.href.split('/').pop() || '';
            const id = `year1_${filename}`;
            
            // Chercher si le projet existe déjà dans la configuration
            const existingProject = config.projects.find(p => p.id === id);
            
            return {
              id,
              title: formatTitle(filename),
              year: 1 as const,
              path: `/project année 1/${filename}`,
              icon: existingProject?.icon || 'file'
            };
          });

        // Liste des projets de l'année 2
        const year2Response = await fetch('/project année 2/');
        if (!year2Response.ok) throw new Error("Impossible de charger les projets de l'année 2");
        const year2Text = await year2Response.text();
        
        // Parser le HTML pour trouver les liens PDF
        const year2Parser = new DOMParser();
        const year2Doc = year2Parser.parseFromString(year2Text, 'text/html');
        const year2Files = Array.from(year2Doc.querySelectorAll('a'))
          .filter(a => a.href.endsWith('.pdf'))
          .map(a => {
            const filename = a.href.split('/').pop() || '';
            const id = `year2_${filename}`;
            
            // Chercher si le projet existe déjà dans la configuration
            const existingProject = config.projects.find(p => p.id === id);
            
            return {
              id,
              title: formatTitle(filename),
              year: 2 as const,
              path: `/project année 2/${filename}`,
              icon: existingProject?.icon || 'file'
            };
          });

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
        config: config as any
      }, { onConflict: 'id' });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration:", error);
    return { success: false, error };
  }
};
