
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TechWatchPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['tech-watch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tech_watch')
        .select('*')
        .order('publication_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Veille Technologique
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {articles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{article.title}</CardTitle>
                      <span className="text-sm text-gray-500">
                        {format(new Date(article.publication_date), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {article.category}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg mb-4" dangerouslySetInnerHTML={{ __html: article.content }} />
                    {article.source_url && (
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Lire l'article original →
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
