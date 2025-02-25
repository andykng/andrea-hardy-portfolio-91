
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

interface TechWatchFormData {
  title: string;
  content: string;
  category: string;
  source_url?: string;
  publication_date: string;
}

interface TechWatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TechWatchFormData) => Promise<void>;
  defaultValues?: Partial<TechWatchFormData>;
  mode: "create" | "edit";
}

export function TechWatchDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode
}: TechWatchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TechWatchFormData>({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
    category: defaultValues?.category || "développement",
    source_url: defaultValues?.source_url || "",
    publication_date: defaultValues?.publication_date || new Date().toISOString().split('T')[0]
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
            {mode === "create" ? "Ajouter un article" : "Modifier l'article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                <option value="intelligence artificielle">Intelligence Artificielle</option>
                <option value="tendances">Tendances</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="publication_date">Date de publication</Label>
              <Input
                id="publication_date"
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, publication_date: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="source_url">URL de la source</Label>
              <Input
                id="source_url"
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, source_url: e.target.value }))}
                placeholder="https://..."
              />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
