
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface SkillFormData {
  name: string;
  level: number;
  category: string;
}

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SkillFormData) => Promise<void>;
  defaultValues?: SkillFormData;
  mode: "create" | "edit";
}

export function SkillDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode,
}: SkillDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SkillFormData>(
    defaultValues || {
      name: "",
      level: 50,
      category: "frontend",
    }
  );

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

  const categories = [
    "frontend",
    "backend",
    "database",
    "devops",
    "mobile",
    "other"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter une compétence" : "Modifier la compétence"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Nom de la compétence</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label>
                Niveau ({formData.level}%)
              </label>
              <Slider
                value={[formData.level]}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, level: value[0] }))
                }
                max={100}
                step={5}
                className="py-4"
              />
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
