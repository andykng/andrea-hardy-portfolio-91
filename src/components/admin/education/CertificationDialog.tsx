
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
import { Certification } from "@/hooks/use-education";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  certification: Certification | null;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
}

export function CertificationDialog({
  open,
  onOpenChange,
  mode,
  certification,
  onSubmit,
}: CertificationDialogProps) {
  const [formData, setFormData] = useState<Partial<Certification>>(
    mode === "edit" && certification
      ? { ...certification }
      : {
          title: "",
          issuer: "",
          date: new Date().toISOString().split('T')[0],
          expiry_date: "",
          credential_url: "",
          logo_url: "",
        }
  );
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setLogoFile(null);
      return;
    }
    setLogoFile(e.target.files[0]);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return formData.logo_url || null;

    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `certifications/${Date.now()}.${fileExt}`;
      
      // Suppression de onUploadProgress qui n'est pas supporté
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return formData.logo_url || null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const logoUrl = await uploadLogo();
      const dataToSubmit = { ...formData, logo_url: logoUrl };
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
            {mode === "create" ? "Ajouter une certification" : "Modifier la certification"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la certification *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Certification AWS, Google..."
              value={formData.title || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Émetteur *</Label>
            <Input
              id="issuer"
              name="issuer"
              placeholder="AWS, Google, Microsoft..."
              value={formData.issuer || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date d'obtention *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date ? formData.date.split('T')[0] : ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Date d'expiration</Label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
                value={formData.expiry_date ? formData.expiry_date.split('T')[0] : ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide si la certification n'expire pas
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_url">URL de vérification</Label>
            <Input
              id="credential_url"
              name="credential_url"
              placeholder="https://example.com/verify/credential"
              value={formData.credential_url || ""}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lien pour vérifier l'authenticité de la certification
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo de la certification</Label>
            <div className="flex flex-col gap-4">
              {formData.logo_url && (
                <div className="relative w-24 h-24 overflow-hidden rounded-md">
                  <img
                    src={formData.logo_url}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Glissez-déposez ou cliquez pour télécharger
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou SVG (max. 2MB)
                  </p>
                </div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <label htmlFor="logo">
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                  >
                    Sélectionner un fichier
                  </Button>
                </label>
                {logoFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {logoFile.name}
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
                  {mode === "create" ? "Ajout en cours..." : "Mise à jour..."}
                </div>
              ) : mode === "create" ? (
                "Ajouter la certification"
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
