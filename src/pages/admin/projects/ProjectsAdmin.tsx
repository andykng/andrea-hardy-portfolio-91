
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProjects, Project } from "@/hooks/use-projects";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fadeInOnScroll } from "@/lib/animations";
import { useEffect } from "react";
import { ProjectDialog } from "@/components/admin/projects/ProjectDialog";
import { DeleteConfirmation } from "@/components/admin/DeleteConfirmation";
import { ProjectCard } from "@/components/admin/projects/ProjectCard";
import { ProjectFilters } from "@/components/admin/projects/ProjectFilters";
import { ProjectsEmptyState } from "@/components/admin/projects/ProjectsEmptyState";
import { ProjectsLoadingState } from "@/components/admin/projects/ProjectsLoadingState";

// Define ProjectInsert type to match the Project interface structure without ID and timestamps
type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

export default function ProjectsAdmin() {
  const { toast } = useToast();
  const { data: projects = [], refetch, isLoading } = useProjects({ adminMode: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const projectsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Utiliser GSAP pour animer les éléments
  useEffect(() => {
    if (projects.length > 0 && !isLoading) {
      // Animer les cartes de projets au chargement
      const projectElements = projectsRef.current.filter(ref => ref !== null);
      fadeInOnScroll(projectElements);
    }
  }, [projects, isLoading]);

  // Filtrer les projets selon le terme de recherche
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.technologies && project.technologies.some(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const openCreateDialog = () => {
    setMode("create");
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setMode("edit");
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const clearSearch = () => setSearchTerm("");

  const handleCreate = async (data: Partial<Project>) => {
    try {
      // Vérification des champs obligatoires
      if (!data.title) {
        throw new Error("Le titre du projet est obligatoire");
      }

      // Cast to the correct type for insertion
      const projectData: ProjectInsert = {
        title: data.title,
        description: data.description || null,
        image_url: data.image_url || null,
        technologies: data.technologies || null,
        github_url: data.github_url || null,
        demo_url: data.demo_url || null
      };

      const { error } = await supabase
        .from('projects')
        .insert(projectData);

      if (error) throw error;

      toast({
        title: "Projet créé avec succès",
        description: "Le projet a été ajouté à votre portfolio",
      });
      refetch();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: Partial<Project>) => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', selectedProject.id);

      if (error) throw error;

      toast({
        title: "Projet mis à jour",
        description: "Les modifications ont été enregistrées",
      });
      refetch();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', selectedProject.id);

      if (error) throw error;

      toast({
        title: "Projet supprimé",
        description: "Le projet a été retiré de votre portfolio",
      });
      refetch();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Projets</h1>
            <p className="text-muted-foreground mt-1">
              Ajoutez et gérez les projets affichés dans votre portfolio
            </p>
          </div>
          <Button onClick={openCreateDialog} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un projet
          </Button>
        </div>

        <ProjectFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredCount={filteredProjects.length}
        />

        {isLoading ? (
          <ProjectsLoadingState />
        ) : filteredProjects.length === 0 ? (
          <ProjectsEmptyState 
            searchTerm={searchTerm}
            clearSearch={clearSearch}
            openCreateDialog={openCreateDialog}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                refetch={refetch}
                forwardedRef={el => projectsRef.current[i] = el}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={mode}
        project={selectedProject}
        onSubmit={mode === "create" ? handleCreate : handleUpdate}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Êtes-vous sûr ?"
        description="Cette action est irréversible. Cela supprimera définitivement ce projet de votre portfolio."
      />
    </AdminLayout>
  );
}
