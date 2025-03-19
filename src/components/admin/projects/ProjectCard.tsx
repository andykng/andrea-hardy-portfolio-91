
import { Project } from "@/hooks/use-projects";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Github, 
  ExternalLink, 
  Edit, 
  Trash, 
  Image,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  selectedFolder: string;
  pdfUploading: boolean;
  uploadProgress: number;
  setPdfUploading: (state: boolean) => void;
  setUploadProgress: (progress: number) => void;
  refetch: () => void;
  forwardedRef: React.Ref<HTMLDivElement>;
}

export function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
  selectedFolder,
  pdfUploading,
  uploadProgress,
  setPdfUploading,
  setUploadProgress,
  refetch,
  forwardedRef
}: ProjectCardProps) {
  const { toast } = useToast();

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Update the project with the PDF URL
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      ref={forwardedRef}
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
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-red-600"
              onClick={() => onDelete(project)}
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
                  onChange={handlePdfUpload}
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
  );
}
