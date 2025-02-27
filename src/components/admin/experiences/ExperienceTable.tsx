
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown, Pencil, Trash2, Eye } from "lucide-react";
import { Experience } from "@/types/experience";
import { useState } from "react";

interface ExperienceTableProps {
  experiences: Experience[] | undefined;
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
  onView?: (experience: Experience) => void;
}

export function ExperienceTable({ experiences, onEdit, onDelete, onView }: ExperienceTableProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortedExperiences, setSortedExperiences] = useState<Experience[] | undefined>(experiences);

  // Trier les expériences par date lorsque la liste change ou que la direction de tri change
  useState(() => {
    if (!experiences) return;
    
    const sorted = [...experiences].sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    setSortedExperiences(sorted);
  });

  const handleSort = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc";
    setSortDirection(newDirection);
    
    if (!experiences) return;
    
    const sorted = [...experiences].sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return newDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    setSortedExperiences(sorted);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between">
        <CardTitle>Liste des Expériences</CardTitle>
        <Button variant="outline" size="sm" onClick={handleSort}>
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Trier par date {sortDirection === "desc" ? "(↓)" : "(↑)"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences && experiences.length > 0 ? (
                experiences.map((exp) => (
                  <TableRow key={exp.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{exp.title}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.location}</TableCell>
                    <TableCell>
                      {format(new Date(exp.start_date), 'dd/MM/yyyy', { locale: fr })} - {
                        exp.end_date 
                          ? format(new Date(exp.end_date), 'dd/MM/yyyy', { locale: fr })
                          : "Présent"
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        exp.type === 'CDI' ? "bg-green-100 text-green-700" :
                        exp.type === 'CDD' ? "bg-blue-100 text-blue-700" :
                        exp.type === 'Stage' ? "bg-yellow-100 text-yellow-700" :
                        exp.type === 'Freelance' ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {exp.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onView(exp)}
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit(exp)}
                          title="Modifier"
                          className="hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(exp)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucune expérience trouvée. Ajoutez votre première expérience professionnelle.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
