
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
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
  defaultValues?: Project;
  mode: "create" | "edit";
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode
}: ProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Project>({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    image_url: defaultValues?.image_url || "",
    github_url: defaultValues?.github_url || "",
    demo_url: defaultValues?.demo_url || "",
    technologies: defaultValues?.technologies || [],
  });

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
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter un projet" : "Modifier le projet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
              <Input
                id="technologies"
                value={formData.technologies.join(", ")}
                onChange={(e) => setFormData((prev) => ({ 
                  ...prev, 
                  technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                }))}
                placeholder="React, TypeScript, Tailwind..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="github_url">URL GitHub</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="demo_url">URL de la démo</Label>
              <Input
                id="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, demo_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
