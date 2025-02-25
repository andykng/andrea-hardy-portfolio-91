
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function TechWatchAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  
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
      return data;
    }
  });

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
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion de la veille technologique</h1>
          <Button>
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
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(article.id)}
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
      </div>
    </AdminLayout>
  );
}
