
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderKanban, Plus } from "lucide-react";

interface ProjectsEmptyStateProps {
  searchTerm: string;
  clearSearch: () => void;
  openCreateDialog: () => void;
}

export function ProjectsEmptyState({ 
  searchTerm, 
  clearSearch, 
  openCreateDialog 
}: ProjectsEmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FolderKanban className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {searchTerm 
          ? "Aucun projet ne correspond à votre recherche." 
          : "Commencez par ajouter votre premier projet pour le présenter dans votre portfolio."}
      </p>
      {searchTerm ? (
        <Button variant="outline" onClick={clearSearch}>
          Effacer la recherche
        </Button>
      ) : (
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un projet
        </Button>
      )}
    </Card>
  );
}
