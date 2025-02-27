
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
  Tags,
  Search
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { BlogDialog } from "@/components/admin/blog/BlogDialog";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useBlogPosts, BlogPost } from "@/hooks/use-blog-posts";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export default function BlogAdminPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Récupérer tous les posts en mode admin (incluant les brouillons)
  const { data: posts = [], refetch, isLoading } = useBlogPosts({ adminMode: true });

  // Filtrer les posts selon le terme de recherche
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async (formData: Partial<BlogPost>) => {
    // Vérification que les champs requis sont présents
    if (!formData.title || !formData.content) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont requis",
        variant: "destructive",
      });
      return;
    }

    // Génération du slug à partir du titre
    const slug = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { error } = await supabase
      .from('blog_posts')
      .insert([{
        title: formData.title,
        content: formData.content,
        slug,
        status: formData.status || 'draft',
        category: formData.category,
        read_time: formData.read_time,
        excerpt: formData.excerpt,
        image_url: formData.image_url,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }]);

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
    setDialogOpen(false);
    refetch();
  };

  const handleUpdate = async (formData: Partial<BlogPost>) => {
    if (!selectedPost) return;

    const updates = {
      ...formData,
      published_at: formData.status === 'published' && !selectedPost.published_at 
        ? new Date().toISOString() 
        : selectedPost.published_at
    };

    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', selectedPost.id);

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
    setDialogOpen(false);
    refetch();
  };

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
    setDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setMode("create");
    setSelectedPost(null);
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setMode("edit");
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const openDeleteDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const publishPost = async (post: BlogPost) => {
    if (post.status === 'published') return;
    
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', post.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier l'article",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Article publié avec succès",
      });
      refetch();
    }
  };

  const unpublishPost = async (post: BlogPost) => {
    if (post.status === 'draft') return;
    
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        status: 'draft'
      })
      .eq('id', post.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre l'article en brouillon",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Article mis en brouillon avec succès",
      });
      refetch();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion du Blog</h1>
          <Button size="lg" onClick={openCreateDialog}>
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
                {posts.reduce((acc, post) => acc + (post.views || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Articles</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher un article..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm 
                          ? "Aucun article ne correspond à votre recherche." 
                          : "Aucun article n'a été créé pour le moment."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          {post.category ? (
                            <Badge variant="outline">{post.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={post.status === "published" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}>
                            {post.status === "published" ? "Publié" : "Brouillon"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {post.published_at 
                            ? format(new Date(post.published_at), 'dd/MM/yyyy', { locale: fr }) 
                            : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {post.read_time ? `${post.read_time} min` : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>{post.views || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/blog/${post.slug}`)}>
                                  Voir
                                </DropdownMenuItem>
                                {post.status === 'draft' ? (
                                  <DropdownMenuItem onClick={() => publishPost(post)}>
                                    Publier
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => unpublishPost(post)}>
                                    Dépublier
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(post)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => openDeleteDialog(post)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <BlogDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedPost}
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
                onClick={() => selectedPost && handleDelete(selectedPost.id)}
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
