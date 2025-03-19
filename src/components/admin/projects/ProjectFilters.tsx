
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredCount: number;
}

export function ProjectFilters({
  searchTerm,
  setSearchTerm,
  filteredCount
}: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un projet..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="text-muted-foreground">
        {filteredCount} projet{filteredCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
