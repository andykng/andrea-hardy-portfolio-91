
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AboutSectionDialog } from "@/components/admin/about/AboutSectionDialog";
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

export default function AboutAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  
  useRealtimeSubscription({
    table: 'about',
    queryKeys: ['admin-about', 'about'],
    enabled: isAuthenticated
  });

  const { data: sections, isLoading, refetch } = useQuery({
    queryKey: ['admin-about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated
  });

  const handleCreate = async (formData: any) => {
    const { error } = await supabase
      .from('about')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la section",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Section créée avec succès",
      });
      refetch();
      setDialogOpen(false);
    }
  };

  const handleUpdate = async (formData: any) => {
    const { error } = await supabase
      .from('about')
      .update(formData)
      .eq('id', selectedSection.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la section",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Section modifiée avec succès",
      });
      refetch();
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('about')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la section",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Section supprimée avec succès",
      });
      refetch();
    }
    setDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setMode("create");
    setSelectedSection(null);
    setDialogOpen(true);
  };

  const openEditDialog = (section: any) => {
    setMode("edit");
    setSelectedSection(section);
    setDialogOpen(true);
  };

  const openDeleteDialog = (section: any) => {
    setSelectedSection(section);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion de la page À propos</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une section
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordre</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections?.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.order_index}</TableCell>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell>{section.section}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(section)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openDeleteDialog(section)}
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

        <AboutSectionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedSection}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement la section
                et son contenu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(selectedSection?.id)}
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
