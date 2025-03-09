
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Loader2, SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMobile } from "@/hooks/use-mobile";

interface AIAssistantProps {
  articleContent?: string;
  articleTitle?: string;
}

export function AIAssistant({ articleContent, articleTitle }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une question",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke("deepseek-assistant", {
        body: {
          prompt,
          article: articleContent ? `Titre: ${articleTitle}\n\nContenu: ${articleContent}` : null
        }
      });
      
      if (error) throw error;
      
      setResponse(data.response);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'assistant IA:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec l'assistant IA. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const predefinedQuestions = [
    "Peux-tu résumer cet article en 3 points clés ?",
    "Génère un résumé de projet basé sur cet article",
    "Quelles compétences seraient utiles pour travailler avec cette technologie ?",
    "Comment cette technologie s'intègre-t-elle dans les tendances actuelles ?"
  ];
  
  const handlePredefinedQuestion = (question: string) => {
    setPrompt(question);
  };

  return (
    <Card className="mt-8 bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AssistProTech - Assistant IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea 
              placeholder="Posez une question sur cet article ou demandez une analyse de compétences..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] border-blue-200 focus:border-blue-400"
            />
            
            {!isMobile && (
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => handlePredefinedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
        
        {response && (
          <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="font-medium text-blue-700 mb-2">Réponse :</h3>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
