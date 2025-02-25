
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
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
import { TechWatchDialog } from "@/components/admin/tech-watch/TechWatchDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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

interface TechWatch {
  id: string;
  title: string;
  content: string;
  category: string;
  publication_date: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export default function TechWatchAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TechWatch | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  useRealtimeSubscription({
    table: 'tech_watch',
    queryKeys: ['admin-tech-watch', 'tech-watch'],
    enabled: isAuthenticated
  });

  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['admin-tech-watch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tech_watch')
        .select('*')
        .order('publication_date', { ascending: false });
      
      if (error) throw error;
      return data as TechWatch[];
    },
    enabled: isAuthenticated
  });

  const handleCreate = async (formData: Omit<TechWatch, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('tech_watch')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Article créé avec succès",
    });
    refetch();
  };

  const handleUpdate = async (formData: Partial<TechWatch>) => {
    const { error } = await supabase
      .from('tech_watch')
      .update(formData)
      .eq('id', selectedArticle?.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'article",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Article modifié avec succès",
    });
    refetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('tech_watch')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
      refetch();
    }
    setDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setMode("create");
    setSelectedArticle(null);
    setDialogOpen(true);
  };

  const openEditDialog = (article: TechWatch) => {
    setMode("edit");
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const openDeleteDialog = (article: TechWatch) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion de la veille technologique</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un article
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles?.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    {format(new Date(article.publication_date), 'dd/MM/yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(article)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openDeleteDialog(article)}
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

        <TechWatchDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedArticle}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement cet article.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => selectedArticle && handleDelete(selectedArticle.id)}
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
