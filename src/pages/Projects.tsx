
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  animation_type?: string;
}

export default function ProjectsPage() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });

  return (
    <Layout>
      <div className="space-y-12">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Mes Projets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de mes projets les plus récents, mettant en avant
            mes compétences en développement web et en conception d'interfaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  )}
                </div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-xl font-semibold tracking-tight">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="bg-white space-y-4">
                  <p className="text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium rounded-full text-primary bg-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4">
                    {project.demo_url && (
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        onClick={() => window.open(project.demo_url, '_blank')}
                      >
                        Voir la démo
                      </Button>
                    )}
                    {project.github_url && (
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => window.open(project.github_url, '_blank')}
                      >
                        Code source
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
