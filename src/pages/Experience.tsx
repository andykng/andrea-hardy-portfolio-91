
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "Chargé de clientèle",
    company: "La Poste",
    period: "2023",
    location: "Rennes, France",
    description:
      "Accueil et conseil aux clients sur les services postaux, bancaires et colis. Gestion des opérations quotidiennes et résolution des problèmes clients.",
  },
  {
    title: "Stagiaire Administrateur Système & Réseau",
    company: "DGFIP",
    period: "2022",
    location: "Paris, France",
    description:
      "Administration des pare-feux Fortinet, traitement des demandes d'ouverture de flux, maintenance et surveillance du réseau.",
  },
  {
    title: "Technicien Informatique",
    company: "LARENN",
    period: "2021",
    location: "Rennes, France",
    description:
      "Support technique utilisateurs, gestion du réseau, sécurisation des données, maintenance du parc informatique.",
  },
];

export default function ExperiencePage() {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const timelineRef = useRef(null);
  const experienceRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Setup GSAP animations
  useEffect(() => {
    // Title animation
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: "power2.out"
    });

    // Description animation with text reveal
    gsap.from(descriptionRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out"
    });

    // Timeline line animation
    gsap.from(timelineRef.current, {
      height: 0,
      duration: 1.5,
      ease: "power2.inOut"
    });

    // Experience items animation
    experienceRefs.current.forEach((exp, index) => {
      if (!exp) return;
      
      const isEven = index % 2 === 0;
      const direction = isEven ? 1 : -1;
      
      ScrollTrigger.create({
        trigger: exp,
        start: "top 80%",
        onEnter: () => {
          // Dot animation
          const dot = exp.querySelector('.timeline-dot');
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            ease: "back.out(1.7)"
          });
          
          // Date marker animation
          const dateMarker = exp.querySelector('.date-marker');
          gsap.from(dateMarker, {
            opacity: 0,
            x: 20 * direction,
            duration: 0.7,
            delay: 0.3,
            ease: "power2.out"
          });
          
          // Card animation
          const card = exp.querySelector('.experience-card');
          gsap.from(card, {
            opacity: 0,
            x: 50 * direction,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out"
          });
        },
        once: true
      });
    });

    return () => {
      // Clean up animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 
          ref={titleRef}
          className="text-4xl font-bold text-center mb-6 text-primary"
        >
          Mon Expérience Professionnelle
        </h1>
        
        <p 
          ref={descriptionRef}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          Découvrez mon parcours professionnel et les compétences acquises au fil de mes expériences.
        </p>
        
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div 
            ref={timelineRef}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -ml-px md:ml-0 z-0"
          ></div>
          
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={el => experienceRefs.current[index] = el}
              className={`mb-12 relative z-10 flex flex-col ${
                index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary shadow-lg transform -translate-x-1/2 z-20 timeline-dot"></div>
              
              {/* Date Marker */}
              <div className={`md:w-1/2 px-4 mb-4 md:mb-0 flex ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              } date-marker`}>
                <div className="flex items-center justify-center h-12 px-4 bg-primary/10 rounded-full text-primary font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {exp.period}
                </div>
              </div>
              
              {/* Experience Card */}
              <div className="md:w-1/2 px-4">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/10 overflow-hidden experience-card">
                  <div className="h-1 bg-primary w-full"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-primary">{exp.title}</CardTitle>
                    <div className="text-lg font-medium">{exp.company}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
