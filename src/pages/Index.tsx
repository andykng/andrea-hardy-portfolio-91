
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Github, 
  LinkedinIcon, 
  Mail, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  Download 
} from "lucide-react";
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
      {/* Hero Section with blob background */}
      <section className="relative overflow-hidden pt-20 pb-12 md:py-32">
        <div className="absolute inset-0 -z-10">
          <svg viewBox="0 0 1000 1000" className="opacity-30 md:opacity-20">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1e90ff", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "#64b5f6", stopOpacity: 0.2 }} />
              </linearGradient>
              <clipPath id="shape">
                <path d="M833.4,457.3c-7.1,133.8-62.2,205.8-176.8,267.7c-76.9,41.7-153,93.6-221.5,154.7 c-68.5,61.1-149.1,102.3-220.7,106.2C138.1,991.2,72,959.3,33.1,907C-39.6,820.2,15.4,740.9,34.2,659.2 c36.3-157.5,38.2-335.6,130.3-431c51.3-53,108.3-83.8,171.3-97.3c75.2-16.2,185.3,6.4,268.9,48.5c122.6,61.8,113.1,190.8,188.5,361.9 C818.4,585.8,838.3,379.4,833.4,457.3z"/>
              </clipPath>
            </defs>
            <g clipPath="url(#shape)">
              <path fill="url(#grad)" d="M833.4,457.3c-7.1,133.8-62.2,205.8-176.8,267.7c-76.9,41.7-153,93.6-221.5,154.7 c-68.5,61.1-149.1,102.3-220.7,106.2C138.1,991.2,72,959.3,33.1,907C-39.6,820.2,15.4,740.9,34.2,659.2 c36.3-157.5,38.2-335.6,130.3-431c51.3-53,108.3-83.8,171.3-97.3c75.2-16.2,185.3,6.4,268.9,48.5c122.6,61.8,113.1,190.8,188.5,361.9 C818.4,585.8,838.3,379.4,833.4,457.3z"/>
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto md:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div 
                className="inline-block bg-primary/10 text-primary font-medium px-4 py-2 rounded-full text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Administrateur Systèmes & Réseaux | Développeur IA-Assisté
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Créer des expériences web et des infrastructure <span className="text-primary">exceptionnelles</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
               Administrateur systèmes et réseaux passionné, j’ai une approche unique du développement : je ne code qu’avec l’assistance de l’IA. Cette méthode me permet d’optimiser mon efficacité, d’explorer rapidement de nouvelles technologies et de créer des applications modernes et performantes. Toujours en quête d’innovation, j’allie automatisation, sécurité et performance pour concevoir des infrastructures robustes et adaptées aux besoins actuels.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <Button
                  size="lg"
                  className="min-w-[160px] bg-primary hover:bg-primary/90 relative overflow-hidden group"
                  onClick={() => navigate('/contact')}
                >
                  <span className="relative z-10 flex items-center transition-transform group-hover:translate-x-1">
                    Me contacter
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-primary/30 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[160px] border-primary text-primary hover:bg-primary/10 flex items-center"
                  onClick={() => navigate('/projets')}
                >
                  <span>Voir mes projets</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-w-[160px] text-primary hover:bg-primary/5"
                  onClick={() => window.open('/cv.pdf', '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Télécharger CV</span>
                </Button>
              </div>
              
              <div className="flex justify-center md:justify-start gap-6 pt-8">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <Github className="w-5 h-5 text-gray-700" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/andrea-h-702a97188/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <LinkedinIcon className="w-5 h-5 text-gray-700" />
                </a>
                <a 
                  href="mailto:andrea.hardy@andreahardy.fr"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <Mail className="w-5 h-5 text-gray-700" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 space-y-24 pb-20">
        {/* Projets récents */}
        <section className="space-y-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold pb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Projets Récents
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez mes dernières réalisations et les technologies utilisées
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {latestProjects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-primary/10 relative">
                  {project.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full bg-white/90 border-white text-gray-800 hover:bg-white"
                            onClick={() => navigate(`/projets/${project.id}`)}
                          >
                            <span>Voir le projet</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 group"
              onClick={() => navigate('/projets')}
            >
              <span className="flex items-center">
                Voir tous les projets
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
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
            <h2 className="text-2xl md:text-3xl font-bold pb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Compétences Principales
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les technologies que j'utilise au quotidien pour créer des applications web modernes
            </p>
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
                <Card className="border-primary/10 hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{skill.name}</h3>
                      <span className="text-sm font-bold text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {skill.category} - {skill.name}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 group"
              onClick={() => navigate('/competences')}
            >
              <span className="flex items-center">
                Voir toutes mes compétences
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
