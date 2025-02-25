
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import { useRequireAuth } from "@/hooks/use-require-auth";
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
import { Experience } from "@/types/experience";
import { ExperienceStats } from "@/components/admin/experiences/ExperienceStats";
import { ExperienceTable } from "@/components/admin/experiences/ExperienceTable";

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

        <ExperienceStats experiences={experiences} />
        
        <ExperienceTable
          experiences={experiences}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

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
