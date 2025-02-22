import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
  animation_type?: string;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  defaultValues?: ProjectFormData;
  mode: "create" | "edit";
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode,
}: ProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(
    defaultValues || {
      title: "",
      description: "",
      image_url: "",
      github_url: "",
      demo_url: "",
      technologies: [],
      animation_type: "fade-up",
    }
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.storage
        .from('projects')
        .upload(`project-${Date.now()}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(data.path);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter un projet" : "Modifier le projet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Titre du projet</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="image">Image du projet</label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-accent">
                      <ImagePlus className="w-5 h-5" />
                      <span>Choisir une image</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="github_url">URL GitHub (optionnel)</label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, github_url: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="demo_url">URL Démo (optionnel)</label>
              <Input
                id="demo_url"
                value={formData.demo_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, demo_url: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="technologies">Technologies (séparées par des virgules)</label>
              <Input
                id="technologies"
                value={formData.technologies.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technologies: e.target.value.split(",").map(t => t.trim()),
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="animation_type">Type d'animation</label>
              <select
                id="animation_type"
                value={formData.animation_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    animation_type: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="fade-up">Fade Up</option>
                <option value="fade-down">Fade Down</option>
                <option value="slide-in-right">Slide Right</option>
                <option value="scale-in">Scale In</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Enregistrement..."
                : mode === "create"
                ? "Créer"
                : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
