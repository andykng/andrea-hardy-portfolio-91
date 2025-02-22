
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectDialog } from "@/components/admin/projects/ProjectDialog";
import { useToast } from "@/components/ui/use-toast";
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

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  demo_url: string;
  technologies: string[];
  animation_type?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsAdminPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });

  const handleCreate = async (formData: any) => {
    const { error } = await supabase
      .from('projects')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      });
      refetch();
    }
  };

  const handleUpdate = async (formData: any) => {
    const { error } = await supabase
      .from('projects')
      .update(formData)
      .eq('id', selectedProject.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le projet",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Projet modifié avec succès",
      });
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      });
      refetch();
    }
    setDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setMode("create");
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const openEditDialog = (project: any) => {
    setMode("edit");
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const openDeleteDialog = (project: any) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Gestion des projets
          </h1>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un projet
          </Button>
        </div>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Animation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/30">
                  <TableCell>
                    {project.image_url && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform hover:scale-110"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {project.animation_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-purple-500/10 hover:text-purple-500"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => openDeleteDialog(project)}
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

        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedProject}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Cette action est irréversible. Cela supprimera définitivement le projet
                et son contenu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-muted hover:bg-muted/90">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={() => handleDelete(selectedProject?.id)}
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
