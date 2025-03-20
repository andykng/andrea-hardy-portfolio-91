
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { AIAssistant } from "@/components/tech-watch/AIAssistant";
import { useMobile } from "@/hooks/use-mobile";

export default function TechWatchPage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const isMobile = useMobile();
  
  const { data: articles, isLoading } = useQuery({
    queryKey: ['tech-watch'],
    queryFn: async () => {
      // Mock data since we're not using a real database
      return [
        {
          id: '1',
          title: 'Les dernières tendances en cybersécurité',
          content: '<p>Une analyse des tendances actuelles en matière de cybersécurité, notamment la montée des attaques de ransomware et les mesures de protection recommandées.</p>',
          category: 'Cybersécurité',
          publication_date: '2023-06-15',
          source_url: 'https://example.com/cyber-trends'
        },
        {
          id: '2',
          title: 'L\'impact de l\'IA sur les métiers de l\'informatique',
          content: '<p>Comment l\'intelligence artificielle transforme les métiers de l\'informatique et quelles compétences développer pour rester pertinent dans ce contexte.</p>',
          category: 'Intelligence Artificielle',
          publication_date: '2023-05-20',
          source_url: 'https://example.com/ai-it-jobs'
        },
        {
          id: '3',
          title: 'Virtualisation et conteneurisation : les bonnes pratiques',
          content: '<p>Un guide des meilleures pratiques pour la mise en œuvre de solutions de virtualisation et de conteneurisation dans un environnement d\'entreprise.</p>',
          category: 'Virtualisation',
          publication_date: '2023-04-10',
          source_url: 'https://example.com/virtualization-best-practices'
        }
      ];
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 overflow-x-hidden">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
        >
          Veille Technologique
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {articles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.1 : index * 0.1, duration: isMobile ? 0.3 : 0.5 }}
                className="w-full"
                onClick={() => setSelectedArticle(article)}
              >
                <Card className={`border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300 ${selectedArticle?.id === article.id ? 'ring-2 ring-blue-400' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <CardTitle className="text-xl text-blue-700">{article.title}</CardTitle>
                      <span className="text-sm text-blue-500 font-medium whitespace-nowrap">
                        {format(new Date(article.publication_date), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 mt-2">
                      {article.category}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-lg max-w-none mb-4 prose-headings:text-blue-700 prose-a:text-blue-600" 
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                    {article.source_url && (
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center border-b border-blue-300 pb-0.5 transition-colors"
                      >
                        Lire l'article original →
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {selectedArticle && (
              <AIAssistant 
                articleContent={selectedArticle.content} 
                articleTitle={selectedArticle.title}
              />
            )}
            
            {!selectedArticle && articles && articles.length > 0 && (
              <Card className="border-blue-200 bg-blue-50 shadow-md p-4 text-center">
                <p className="text-blue-700">Sélectionnez un article ci-dessus pour utiliser l'assistant IA</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
