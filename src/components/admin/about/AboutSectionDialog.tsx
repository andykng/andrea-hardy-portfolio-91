
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
import { ImageUpload } from "../blog/ImageUpload";

interface AboutSection {
  id?: string;
  title: string;
  content: string;
  section: string;
  order_index: number;
  image_url?: string;
}

interface AboutSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AboutSection) => Promise<void>;
  defaultValues?: Partial<AboutSection>;
  mode: "create" | "edit";
}

export function AboutSectionDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode,
}: AboutSectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<AboutSection>({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
    section: defaultValues?.section || "",
    order_index: defaultValues?.order_index || 0,
    image_url: defaultValues?.image_url || "",
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
      const filePath = `about/${fileName}`;

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
      <DialogContent className="sm:max-w-[625px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter une section" : "Modifier la section"}
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
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Ordre</Label>
              <Input
                id="order"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  order_index: parseInt(e.target.value),
                }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Image (optionnelle)</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={handleImageUpload}
                isUploading={isUploading}
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Aperçu" 
                    className="max-h-40 rounded-md object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px]"
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
