
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function ImageUpload({ value, onChange, isUploading }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Upload en cours..." : "Choisir une image"}
        </Button>
      </div>

      {value && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={value}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
