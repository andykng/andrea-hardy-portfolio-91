
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
