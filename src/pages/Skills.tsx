
import { motion } from "framer-motion";
import { Code, Server, Shield, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger);

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const pageTitleRef = useRef(null);
  const cardsRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  // GSAP Animations
  useEffect(() => {
    // Title animation
    gsap.from(pageTitleRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animate skill cards
    cardsRefs.current.forEach((card, index) => {
      if (!card) return;
      
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        onEnter: () => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out"
          });
        },
        once: true
      });
    });

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach((bar) => {
      const level = bar.getAttribute('data-level') || "0";
      
      gsap.set(bar, { width: 0 });
      
      ScrollTrigger.create({
        trigger: bar,
        start: "top 90%",
        onEnter: () => {
          gsap.to(bar, {
            width: `${level}%`,
            duration: 1.5,
            ease: "power2.out"
          });
        },
        once: true
      });
    });

    return () => {
      // Clean up
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [skills]);

  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Reset the refs array when skills change
  useEffect(() => {
    cardsRefs.current = cardsRefs.current.slice(0, Object.keys(skillsByCategory || {}).length);
  }, [skillsByCategory]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 
          ref={pageTitleRef}
          className="text-4xl font-bold text-center mb-12 text-primary"
        >
          Mes Compétences
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skillsByCategory || {}).map(([category, skills], index) => (
            <div
              key={category}
              ref={el => cardsRefs.current[index] = el}
              className="skill-card"
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
                        <div 
                          className="h-full bg-primary skill-bar" 
                          data-level={skill.level}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
