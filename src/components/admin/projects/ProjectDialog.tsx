
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/hooks/use-projects";
import { X, Plus, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  project: Project | null;
  onSubmit: (data: Partial<Project>) => Promise<void>;
}

export function ProjectDialog({
  open,
  onOpenChange,
  mode,
  project,
  onSubmit,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>(
    mode === "edit" && project
      ? { ...project }
      : {
          title: "",
          description: "",
          technologies: [],
          github_url: "",
          demo_url: "",
          image_url: "",
        }
  );
  const [loading, setLoading] = useState(false);
  const [newTechnology, setNewTechnology] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTechnology = () => {
    if (!newTechnology.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      technologies: [...(prev.technologies || []), newTechnology.trim()],
    }));
    setNewTechnology("");
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: (prev.technologies || []).filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageFile(null);
      return;
    }
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `projects/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return formData.image_url || null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const imageUrl = await uploadImage();
      const dataToSubmit = { ...formData, image_url: imageUrl };
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter un projet" : "Modifier le projet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du projet *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Mon Super Projet"
              value={formData.title || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez votre projet..."
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">URL GitHub</Label>
              <Input
                id="github_url"
                name="github_url"
                placeholder="https://github.com/username/project"
                value={formData.github_url || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo_url">URL Démo</Label>
              <Input
                id="demo_url"
                name="demo_url"
                placeholder="https://my-project.com"
                value={formData.demo_url || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Technologies utilisées</Label>
            <div className="flex gap-2">
              <Input
                id="new-tech"
                placeholder="Ajouter une technologie"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddTechnology}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.technologies || []).map((tech, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  {tech}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full hover:bg-secondary/20"
                    onClick={() => handleRemoveTechnology(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {(formData.technologies || []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune technologie ajoutée
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image du projet</Label>
            <div className="flex flex-col gap-4">
              {formData.image_url && (
                <div className="relative w-full aspect-video overflow-hidden rounded-md">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Glissez-déposez ou cliquez pour télécharger
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou GIF (max. 4MB)
                  </p>
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label htmlFor="image">
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                  >
                    Sélectionner un fichier
                  </Button>
                </label>
                {imageFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {imageFile.name}
                  </p>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full mt-2">
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  {mode === "create" ? "Création..." : "Enregistrement..."}
                </div>
              ) : mode === "create" ? (
                "Créer le projet"
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
