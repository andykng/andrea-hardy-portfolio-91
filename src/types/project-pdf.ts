
export interface ProjectPDF {
  id: string;
  title: string;
  year: 1 | 2;
  path: string;
  icon?: string;
}

export interface ProjectsConfig {
  projects: ProjectPDF[];
}
