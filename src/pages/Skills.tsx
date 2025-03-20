
import { motion } from "framer-motion";
import { Code, Server, Shield, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateSkillBars, staggeredPageLoad, revealTextOnScroll } from "@/lib/animations";
import { TechGrid } from "@/components/TechGrid";

// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger);

export default function SkillsPage() {
  const pageTitleRef = useRef(null);
  const pageDescriptionRef = useRef(null);
  const cardsRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      // Mock data since we're not using a real database
      return [
        { id: '1', name: 'HTML/CSS', level: 90, category: 'frontend' },
        { id: '2', name: 'JavaScript', level: 85, category: 'frontend' },
        { id: '3', name: 'React', level: 80, category: 'frontend' },
        { id: '4', name: 'Tailwind CSS', level: 85, category: 'frontend' },
        { id: '5', name: 'Node.js', level: 75, category: 'backend' },
        { id: '6', name: 'Express', level: 80, category: 'backend' },
        { id: '7', name: 'MongoDB', level: 70, category: 'backend' },
        { id: '8', name: 'SQL', level: 75, category: 'backend' },
        { id: '9', name: 'Docker', level: 65, category: 'devops' },
        { id: '10', name: 'CI/CD', level: 60, category: 'devops' },
        { id: '11', name: 'Git', level: 85, category: 'devops' },
        { id: '12', name: 'Linux', level: 80, category: 'devops' },
        { id: '13', name: 'Cryptographie', level: 70, category: 'security' },
        { id: '14', name: 'Firewall', level: 75, category: 'security' },
        { id: '15', name: 'Pentesting', level: 65, category: 'security' }
      ];
    }
  });

  // GSAP Animations
  useEffect(() => {
    // Utilisons les fonctions d'animation améliorées
    if (pageTitleRef.current) {
      revealTextOnScroll(pageTitleRef.current, { 
        y: 30,
        duration: 0.8,
        start: "top 90%" 
      });
    }

    if (pageDescriptionRef.current) {
      gsap.from(pageDescriptionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out"
      });
    }

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

    // Animate skill bars using our utility function
    animateSkillBars('.skill-card');

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
    if (skillsByCategory) {
      cardsRefs.current = cardsRefs.current.slice(0, Object.keys(skillsByCategory || {}).length);
    }
  }, [skillsByCategory]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 
          ref={pageTitleRef}
          className="text-4xl font-bold text-center mb-6 text-primary"
        >
          Mes Compétences
        </h1>
        
        <p
          ref={pageDescriptionRef}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          Découvrez les compétences techniques que j'ai acquises au cours de ma formation et de mes expériences professionnelles.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {skillsByCategory && Object.entries(skillsByCategory).map(([category, skills], index) => (
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

        {/* Intégration de la grille de technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-primary">
            Outils et technologies maîtrisés
          </h2>
          <TechGrid />
        </motion.div>
      </div>
    </Layout>
  );
}
