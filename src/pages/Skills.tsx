
import { motion } from "framer-motion";
import { Code, Server, Shield, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SkillsPage() {
  const queryClient = useQueryClient();

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Configuration de la synchronisation en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('public-skills-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'skills' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['skills'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Suivi des vues de page
  useEffect(() => {
    const trackPageView = async () => {
      const { data: currentPage } = await supabase
        .from('pages')
        .select('views')
        .eq('slug', 'competences')
        .single();

      const currentViews = currentPage?.views || 0;

      await supabase
        .from('pages')
        .upsert({ 
          slug: 'competences',
          title: 'Compétences',
          content: 'Page des compétences',
          views: currentViews + 1 
        }, {
          onConflict: 'slug'
        });
    };

    trackPageView();
  }, []);

  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Mes Compétences</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skillsByCategory || {}).map(([category, skills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {category === 'frontend' && <Code className="h-6 w-6 text-primary" />}
                    {category === 'backend' && <Server className="h-6 w-6 text-primary" />}
                    {category === 'devops' && <Cloud className="h-6 w-6 text-primary" />}
                    {category === 'security' && <Shield className="h-6 w-6 text-primary" />}
                    <CardTitle className="capitalize">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills?.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
