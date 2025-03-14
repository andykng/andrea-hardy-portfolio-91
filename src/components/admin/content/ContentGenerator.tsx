
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContent {
  content: string;
  title?: string;
  excerpt?: string;
}

export function ContentGenerator() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("développement");
  const [contentType, setContentType] = useState("blog");
  const [generationType, setGenerationType] = useState("full");
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState<"blog" | "tech-watch">("blog");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [finalContent, setFinalContent] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [debug, setDebug] = useState<any>(null);

  // Function to generate a slug from a title
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Remove consecutive hyphens
      .trim();                  // Trim leading/trailing spaces
  };

  const handleGenerate = async () => {
    if (!subject) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Generating content for subject:", subject);
      
      const response = await fetch("https://nxwrldqcewwaamrsvlon.supabase.co/functions/v1/deepseek-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
        },
        body: JSON.stringify({
          contentType,
          prompt: subject,
          topic: subject,
          category,
          type: generationType,
          options: {
            temperature: 0.7,
            max_tokens: 2000,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Generated content:", data);
      
      setGeneratedContent({
        content: data.content || "",
        title: data.title || "",
        excerpt: data.excerpt || "",
      });
      
      setFinalContent(data.content || "");
      setTitle(data.title || subject);
      setExcerpt(data.excerpt || "");
      setDebug(data);

    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la génération du contenu: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!finalContent || !title) {
      toast({
        title: "Erreur",
        description: "Le contenu et le titre sont requis",
        variant: "destructive",
      });
      return;
    }

    try {
      if (destination === "blog") {
        const slug = generateSlug(title);
        console.log("Publishing to blog with slug:", slug);
        
        const { data, error } = await supabase.from("blog_posts").insert({
          title,
          content: finalContent,
          excerpt: excerpt || undefined,
          category,
          status: "published",
          published_at: new Date().toISOString(),
          read_time: Math.ceil(finalContent.split(" ").length / 200), // ~200 words per minute
          slug, // Add the required slug field
        });

        console.log("Insert result:", { data, error });

        if (error) throw error;
      } else {
        // Tech watch
        console.log("Publishing to tech watch");
        const { error } = await supabase.from("tech_watch").insert({
          title,
          content: finalContent,
          category,
          publication_date: new Date().toISOString().split("T")[0],
        });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `Contenu publié dans ${destination === "blog" ? "le blog" : "la veille technologique"}`,
      });

      // Reset form
      setSubject("");
      setGeneratedContent(null);
      setFinalContent("");
      setTitle("");
      setExcerpt("");
    } catch (error) {
      console.error("Error publishing content:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la publication: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de contenu IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Sujet de l'article</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Entrez le sujet de l'article"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="développement">Développement</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="sécurité">Sécurité</SelectItem>
                    <SelectItem value="intelligence artificielle">Intelligence Artificielle</SelectItem>
                    <SelectItem value="tendances">Tendances</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content-type">Type de contenu</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Article de blog</SelectItem>
                    <SelectItem value="product-description">Description de produit</SelectItem>
                    <SelectItem value="social-media">Post réseaux sociaux</SelectItem>
                    <SelectItem value="seo-metadata">Métadonnées SEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="generation-type">Type de génération</Label>
                <Select value={generationType} onValueChange={setGenerationType}>
                  <SelectTrigger id="generation-type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Article complet</SelectItem>
                    <SelectItem value="excerpt">Extrait</SelectItem>
                    <SelectItem value="title">Titre uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !subject}
              className="mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                "Générer du contenu"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Contenu généré</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              {contentType === "blog" && (
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Extrait</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Extrait de l'article"
                    className="h-20"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={finalContent}
                  onChange={(e) => setFinalContent(e.target.value)}
                  placeholder="Contenu de l'article"
                  className="min-h-[300px]"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full">
              <Label htmlFor="destination">Destination</Label>
              <Tabs 
                value={destination} 
                onValueChange={(value) => setDestination(value as "blog" | "tech-watch")}
                className="w-full mt-2"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="tech-watch">Veille Technologique</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button className="w-full" onClick={handlePublish}>
              Publier
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {debug && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de débogage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[200px]">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
