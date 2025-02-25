
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
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Experience } from "@/types/experience";

interface ExperienceTableProps {
  experiences: Experience[] | undefined;
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
}

export function ExperienceTable({ experiences, onEdit, onDelete }: ExperienceTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between">
        <CardTitle>Liste des Expériences</CardTitle>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Trier par date
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
              {experiences?.map((exp) => (
                <TableRow key={exp.id}>
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(exp)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onDelete(exp)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
