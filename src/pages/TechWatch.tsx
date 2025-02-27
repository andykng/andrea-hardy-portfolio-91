
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
      <div className="container mx-auto px-4 py-8 md:py-12 overflow-x-hidden">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300">
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
          </div>
        )}
      </div>
    </Layout>
  );
}
