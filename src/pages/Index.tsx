
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Github, LinkedinIcon, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();
  
  const { data: latestProjects } = useQuery({
    queryKey: ['latest-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: skills } = useQuery({
    queryKey: ['featured-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 space-y-24">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-12rem)] flex flex-col justify-center">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Développeur Full Stack
              <span className="text-primary"> React & Node.js</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Passionné par le développement web et la création d'expériences numériques exceptionnelles
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="min-w-[160px] bg-primary hover:bg-primary/90"
                onClick={() => navigate('/contact')}
              >
                Me contacter
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[160px] border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate('/projets')}
              >
                Voir mes projets
              </Button>
            </div>
            <div className="flex justify-center gap-6 pt-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Github className="w-5 h-5" />
                </Button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <LinkedinIcon className="w-5 h-5" />
                </Button>
              </a>
              <a href="mailto:contact@example.com">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Mail className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Projets récents */}
        <section className="space-y-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary">Projets Récents</h2>
            <p className="text-muted-foreground mt-2">Découvrez mes dernières réalisations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProjects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 border-primary/10">
                  {project.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/projets')}
            >
              Voir tous les projets
            </Button>
          </div>
        </section>

        {/* Compétences */}
        <section className="space-y-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary">Compétences Principales</h2>
            <p className="text-muted-foreground mt-2">Les technologies que j'utilise au quotidien</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills?.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-primary/10">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-primary">{skill.name}</h3>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/competences')}
            >
              Voir toutes mes compétences
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
