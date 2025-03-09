import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface BlogAIGeneratorProps {
  onSelect: (content: string) => void;
  onSelectTitle?: (title: string) => void;
  onSelectExcerpt?: (excerpt: string) => void;
}

export function BlogAIGenerator({ onSelect, onSelectTitle, onSelectExcerpt }: BlogAIGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("développement");
  const [generationType, setGenerationType] = useState<"full" | "excerpt" | "title">("full");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Sujet requis",
        description: "Veuillez entrer un sujet pour générer du contenu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContent("");
    setError(null);

    try {
      console.log("Envoi de la requête de génération avec les paramètres:", { topic, category, type: generationType });
      
      const response = await fetch("https://nxwrldqcewwaamrsvlon.supabase.co/functions/v1/deepseek-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          category,
          type: generationType
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur HTTP:", response.status, errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data || !data.content) {
        console.error("Réponse invalide:", data);
        throw new Error("Format de réponse invalide");
      }

      console.log("Contenu généré avec succès, longueur:", data.content.length);
      setGeneratedContent(data.content);

      toast({
        title: "Contenu généré avec succès",
        description: "Vous pouvez maintenant utiliser ce contenu pour votre article",
      });
    } catch (error: any) {
      console.error("Erreur lors de la génération du contenu:", error);
      setError(error.message || "Une erreur inconnue est survenue");
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContent = () => {
    if (generationType === "full") {
      onSelect(generatedContent);
    } else if (generationType === "excerpt" && onSelectExcerpt) {
      onSelectExcerpt(generatedContent);
    } else if (generationType === "title" && onSelectTitle) {
      const firstTitle = generatedContent.split('\n')[0].replace(/^\d+\.\s*/, '');
      onSelectTitle(firstTitle);
    }

    toast({
      title: "Contenu appliqué",
      description: "Le contenu généré a été ajouté à l'éditeur",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copié",
      description: "Le contenu a été copié dans le presse-papiers",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Assistant IA - Générateur de contenu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Sujet de l'article</Label>
            <Input
              id="topic"
              placeholder="Exemple: Les dernières avancées en intelligence artificielle"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="développement">Développement</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="sécurité">Sécurité</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de génération</Label>
              <Select value={generationType} onValueChange={(value: "full" | "excerpt" | "title") => setGenerationType(value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Article complet</SelectItem>
                  <SelectItem value="excerpt">Extrait</SelectItem>
                  <SelectItem value="title">Titres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Erreur lors de la génération</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer du contenu
                </>
              )}
            </Button>
          </div>

          {generatedContent && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  {generationType === "full" ? "Article complet" : generationType === "excerpt" ? "Extrait" : "Suggestions de titres"}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUseContent}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Utiliser
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-md bg-white border border-purple-200 max-h-[400px] overflow-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
