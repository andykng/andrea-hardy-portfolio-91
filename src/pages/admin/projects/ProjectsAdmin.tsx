
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProjects, Project } from "@/hooks/use-projects";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Github, 
  ExternalLink, 
  Edit, 
  Trash, 
  Image, 
  Code,
  X,
  FileText,
  Folder
} from "lucide-react";
import { ProjectDialog } from "@/components/admin/projects/ProjectDialog";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
import { Progress } from "@/components/ui/progress";
import { fadeInOnScroll } from "@/lib/animations";
import { useEffect, useRef } from "react";

// Structure des dossiers pour les PDF
const PDF_FOLDERS = {
  'year1': 'Projets BTS 1ère Année',
  'year2': 'Projets BTS 2ème Année',
  'other': 'Documents Externes'
};

// Updated ProjectInsert type to include pdf fields
type ProjectInsert = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  technologies?: string[] | null;
  github_url?: string | null;
  demo_url?: string | null;
  pdf_url?: string | null;
  pdf_folder?: string | null;
}

export default function ProjectsAdmin() {
  const { toast } = useToast();
  const { data: projects = [], refetch, isLoading } = useProjects({ adminMode: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<string>("year1");
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
        demo_url: data.demo_url || null,
        pdf_url: data.pdf_url || null,
        pdf_folder: data.pdf_folder || null
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, project: Project) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    
    if (fileExt !== 'pdf') {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }
    
    setPdfUploading(true);
    setUploadProgress(0);
    
    try {
      const folder = selectedFolder;
      const filePath = `projects/${folder}/${Date.now()}_${file.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Mettez à jour le projet avec l'URL du PDF
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          pdf_url: publicUrl,
          pdf_folder: folder
        })
        .eq('id', project.id);
      
      if (updateError) throw updateError;
      
      setUploadProgress(100);
      setTimeout(() => {
        setPdfUploading(false);
        setUploadProgress(0);
      }, 1000);
      
      toast({
        title: "PDF téléversé avec succès",
        description: "Le document a été associé au projet",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur lors du téléversement",
        description: error.message,
        variant: "destructive",
      });
      setPdfUploading(false);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(PDF_FOLDERS).map(([key, name]) => (
            <Card 
              key={key} 
              className={`cursor-pointer transition-all ${selectedFolder === key ? 'border-primary' : ''}`}
              onClick={() => setSelectedFolder(key)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-full p-2 ${selectedFolder === key ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Folder className={`h-5 w-5 ${selectedFolder === key ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-medium">{name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {key === 'year1' && 'PDF des projets de 1ère année'}
                    {key === 'year2' && 'PDF des projets de 2ème année'}
                    {key === 'other' && 'Documents supplémentaires'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-muted-foreground">
            {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {searchTerm 
                ? "Aucun projet ne correspond à votre recherche." 
                : "Commencez par ajouter votre premier projet pour le présenter dans votre portfolio."}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Effacer la recherche
              </Button>
            ) : (
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un projet
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                ref={el => projectsRef.current[i] = el}
              >
                <Card className="group overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <Image className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-red-600"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* PDF Upload Section */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Document PDF</p>
                        <label htmlFor={`pdf-upload-${project.id}`}>
                          <div className="cursor-pointer text-xs text-primary hover:underline">
                            {project.pdf_url ? 'Remplacer' : 'Ajouter'}
                          </div>
                          <input
                            type="file"
                            id={`pdf-upload-${project.id}`}
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handlePdfUpload(e, project)}
                            disabled={pdfUploading}
                          />
                        </label>
                      </div>
                      
                      {project.pdf_url ? (
                        <div className="mt-2 flex items-center justify-between bg-secondary/10 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-xs truncate max-w-[150px]">
                              {project.pdf_url.split('/').pop()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => window.open(project.pdf_url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : pdfUploading ? (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center mt-1">Téléversement {uploadProgress}%</p>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Aucun document associé</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-4 pt-2">
                    <div className="flex space-x-2">
                      {project.github_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => window.open(project.github_url, "_blank")}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => window.open(project.demo_url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.pdf_folder === 'year1' && 'BTS 1ère Année'}
                      {project.pdf_folder === 'year2' && 'BTS 2ème Année'}
                      {project.pdf_folder === 'other' && 'Document Externe'}
                      {!project.pdf_folder && 'Non catégorisé'}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
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
        pdfFolders={PDF_FOLDERS}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement ce projet de votre portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
