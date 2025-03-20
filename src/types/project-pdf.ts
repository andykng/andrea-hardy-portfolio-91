
export interface ProjectPDF {
  id: string;
  title: string;
  year: 1 | 2;
  path: string;
  icon?: string;
  category?: string;
  displayName?: string;  // Champ pour permettre de renommer l'affichage
  description?: string;  // Description optionnelle
}

export interface ProjectsConfig {
  projects: ProjectPDF[];
}

// This type matches the structure in the Supabase table
export interface ProjectsConfigTable {
  id: number;
  config: ProjectsConfig;
  created_at: string;
  updated_at: string;
}
