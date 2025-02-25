
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExperienceDialog } from "@/components/admin/experiences/ExperienceDialog";
import { useState } from "react";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  start_date: string;
  end_date?: string;
  skills: string[];
}

export default function ExperiencesAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  useRealtimeSubscription({
    table: 'experiences',
    queryKeys: ['admin-experiences', 'experiences'],
    enabled: isAuthenticated
  });

  const { data: experiences, refetch } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as Experience[];
    },
    enabled: isAuthenticated
  });

  const handleCreate = async (formData: Omit<Experience, 'id'>) => {
    const { error } = await supabase
      .from('experiences')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'expérience",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Expérience créée avec succès",
    });
    refetch();
  };

  const handleUpdate = async (formData: Partial<Experience>) => {
    if (!selectedExperience) return;

    const { error } = await supabase
      .from('experiences')
      .update(formData)
      .eq('id', selectedExperience.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'expérience",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Expérience modifiée avec succès",
    });
    refetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Expérience supprimée avec succès",
      });
      refetch();
    }
    setDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setMode("create");
    setSelectedExperience(null);
    setDialogOpen(true);
  };

  const openEditDialog = (experience: Experience) => {
    setMode("edit");
    setSelectedExperience(experience);
    setDialogOpen(true);
  };

  const openDeleteDialog = (experience: Experience) => {
    setSelectedExperience(experience);
    setDeleteDialogOpen(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Expériences</h1>
            <p className="text-gray-500 mt-1">Gérez votre parcours professionnel</p>
          </div>
          <Button size="lg" onClick={openCreateDialog}>
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
              <p className="text-3xl font-bold">{experiences?.length || 0}</p>
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
                {experiences ? new Set(experiences.map(e => e.company)).size : 0}
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
                {experiences ? new Set(experiences.map(e => e.location)).size : 0}
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
                            onClick={() => openEditDialog(exp)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => openDeleteDialog(exp)}
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

        <ExperienceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedExperience}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement cette expérience.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => selectedExperience && handleDelete(selectedExperience.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
