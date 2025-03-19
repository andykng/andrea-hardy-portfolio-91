
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  pdfFolders: Record<string, string>;
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredCount: number;
}

export function ProjectFilters({
  pdfFolders,
  selectedFolder,
  setSelectedFolder,
  searchTerm,
  setSearchTerm,
  filteredCount
}: ProjectFiltersProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(pdfFolders).map(([key, name]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all ${selectedFolder === key ? 'border-primary' : ''}`}
            onClick={() => setSelectedFolder(key)}
          >
            <div className="p-4 flex items-center gap-3">
              <div className={`rounded-full p-2 ${selectedFolder === key ? 'bg-primary/20' : 'bg-muted'}`}>
                <Folder className={`h-5 w-5 ${selectedFolder === key ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-xs text-muted-foreground">
                  {key === 'year1' && 'PDF des projets de 1ère année'}
                  {key === 'year2' && 'PDF des projets de 2ème année'}
                  {key === 'other' && 'Documents supplémentaires'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
    </>
  );
}
