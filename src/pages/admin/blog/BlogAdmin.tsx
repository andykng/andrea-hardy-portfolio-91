import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  BookText,
  Clock,
  Tags
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

interface BlogPost {
  id: string;
  title: string;
  status: "draft" | "published";
  category: string;
  published_at: string | null;
  read_time: number;
  views: number;
}

export default function BlogAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();

  useRealtimeSubscription({
    table: 'blog_posts',
    queryKeys: ['admin-blog-posts', 'blog-posts'],
    enabled: isAuthenticated
  });

  const { data: posts, refetch } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: isAuthenticated
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
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
          <h1 className="text-3xl font-bold">Gestion du Blog</h1>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Article
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="w-5 h-5" />
                Articles Publiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {posts.filter(p => p.status === "published").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Brouillons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {posts.filter(p => p.status === "draft").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Vues Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {posts.reduce((acc, post) => acc + post.views, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles</CardTitle>
              <div className="flex items-center gap-4">
                <Input 
                  placeholder="Rechercher un article..." 
                  className="w-64"
                />
                <Button variant="outline" size="sm">
                  <Tags className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Trier
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de publication</TableHead>
                  <TableHead>Temps de lecture</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === "published" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {post.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </TableCell>
                    <TableCell>{post.published_at}</TableCell>
                    <TableCell>{post.read_time} min</TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" onClick={() => handleDelete(post.id)} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
