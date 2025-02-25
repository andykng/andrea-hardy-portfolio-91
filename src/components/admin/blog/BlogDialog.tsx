
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
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";

interface BlogPostFormData {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  status: "draft" | "published";
  read_time?: number;
  image_url?: string;
}

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  defaultValues?: Partial<BlogPostFormData>;
  mode: "create" | "edit";
}

export function BlogDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode
}: BlogDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
    excerpt: defaultValues?.excerpt || "",
    category: defaultValues?.category || "développement",
    status: defaultValues?.status || "draft",
    read_time: defaultValues?.read_time || 5,
    image_url: defaultValues?.image_url || ""
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

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un article" : "Modifier l'article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 py-4">
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
              <Label>Image de couverture</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={handleImageUpload}
                isUploading={isUploading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="développement">Développement</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="sécurité">Sécurité</option>
                  <option value="cloud">Cloud</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="read_time">Temps de lecture (minutes)</Label>
              <Input
                id="read_time"
                type="number"
                min="1"
                value={formData.read_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, read_time: parseInt(e.target.value) }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
