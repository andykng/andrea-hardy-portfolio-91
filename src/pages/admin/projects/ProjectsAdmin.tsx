
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import { useState } from "react";
import { ProjectDialog } from "@/components/admin/projects/ProjectDialog";
import { DeleteConfirmation } from "@/components/admin/DeleteConfirmation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
}

export default function ProjectsAdminPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  useRealtimeSubscription({
    table: 'projects',
    queryKeys: ['admin-projects', 'projects']
  });

  const { data: projects, refetch } = useQuery({
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

  const handleCreate = async (formData: Omit<Project, 'id'>) => {
    const { error } = await supabase
      .from('projects')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Succès",
      description: "Projet créé avec succès",
    });
    refetch();
  };

  const handleUpdate = async (formData: Partial<Project>) => {
    if (!selectedProject) return;

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
      throw error;
    }

    toast({
      title: "Succès",
      description: "Projet modifié avec succès",
    });
    refetch();
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', selectedProject.id);

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Projets</h1>
            <p className="text-gray-500 mt-1">Gérez vos projets et réalisations</p>
          </div>
          <Button onClick={() => {
            setMode("create");
            setSelectedProject(null);
            setDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.image_url && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setMode("edit");
                      setSelectedProject(project);
                      setDialogOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProject(project);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedProject ?? undefined}
          mode={mode}
        />

        <DeleteConfirmation
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Supprimer le projet ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce projet ?"
        />
      </div>
    </AdminLayout>
  );
}
