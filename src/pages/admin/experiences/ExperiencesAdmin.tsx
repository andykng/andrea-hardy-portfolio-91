
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  ArrowUpDown
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | "present";
  type: "fulltime" | "contract" | "internship";
  description: string;
}

export default function ExperiencesAdminPage() {
  const experiences: Experience[] = [
    {
      id: 1,
      title: "Administratrice Système Senior",
      company: "TechCorp",
      location: "Paris, France",
      startDate: "2022-01",
      endDate: "present",
      type: "fulltime",
      description: "Gestion de l'infrastructure cloud et on-premise..."
    },
    {
      id: 2,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Lyon, France",
      startDate: "2020-03",
      endDate: "2021-12",
      type: "fulltime",
      description: "Mise en place de pipelines CI/CD..."
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Expériences</h1>
            <p className="text-gray-500 mt-1">Gérez votre parcours professionnel</p>
          </div>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Expérience
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Total Expériences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{experiences.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Entreprises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(experiences.map(e => e.company)).size}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Villes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(experiences.map(e => e.location)).size}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Années d'exp.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
            </CardContent>
          </Card>
        </div>

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
                  {experiences.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.title}</TableCell>
                      <TableCell>{exp.company}</TableCell>
                      <TableCell>{exp.location}</TableCell>
                      <TableCell>
                        {exp.startDate} - {exp.endDate === "present" ? "Présent" : exp.endDate}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          exp.type === "fulltime" 
                            ? "bg-green-100 text-green-700"
                            : exp.type === "contract"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {exp.type === "fulltime" ? "CDI" : 
                           exp.type === "contract" ? "Freelance" : "Stage"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
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
      </div>
    </AdminLayout>
  );
}
