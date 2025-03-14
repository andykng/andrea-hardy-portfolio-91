
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const Hero = () => {
  const certifications = [
    {
      title: "AWS Cloud Practitioner",
      image: "/aws-cert.png",
      date: "2024"
    },
    {
      title: "Azure Administrator",
      image: "/azure-cert.png",
      date: "2023"
    },
    {
      title: "CompTIA Security+",
      image: "/comptia-cert.png",
      date: "2023"
    }
  ];

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const certTitleRef = useRef(null);
  const chevronRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    // Main title animation
    gsap.from(titleRef.current, {
      duration: 1.2,
      opacity: 0,
      y: 50,
      ease: "power3.out",
    });

    // Subtitle text reveal animation
    gsap.to(subtitleRef.current, {
      duration: 2,
      text: {
        value: "Administratrice Système & Réseau passionnée par la sécurité et la gestion de projets IT"
      },
      ease: "none",
      delay: 0.5
    });

    // CTA buttons animation
    gsap.from(ctaRef.current?.children, {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: "back.out(1.7)",
      delay: 1
    });

    // Chevron animation
    gsap.to(chevronRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut"
    });

    // Certifications title reveal on scroll
    ScrollTrigger.create({
      trigger: certTitleRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.from(certTitleRef.current, {
          duration: 0.8,
          opacity: 0,
          y: 30,
          ease: "power2.out",
        });
      }
    });

    // Parallax effect on hero section
    ScrollTrigger.create({
      trigger: heroSectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(heroSectionRef.current, {
          y: progress * 100,
          ease: "none",
          duration: 0.1
        });
      }
    });

    return () => {
      // Clean up animations on component unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([titleRef.current, subtitleRef.current, ctaRef.current, chevronRef.current, certTitleRef.current]);
    };
  }, []);

  return (
    <>
      <section ref={heroSectionRef} className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative bg-gradient-to-br from-accent via-background to-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div 
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg hover:border-primary/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Andrea Hardy"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="space-y-4">
              <h1 
                ref={titleRef}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Bonjour, je suis Andrea Hardy
              </h1>
              <p 
                ref={subtitleRef}
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto min-h-[3rem]"
              ></p>
            </div>
            <div 
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                Télécharger mon CV
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-primary/10 hover:text-primary w-full sm:w-auto">
                Me Contacter
              </Button>
            </div>
          </div>

          <a
            ref={chevronRef}
            href="#certifications"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          >
            <ChevronDown className="h-8 w-8 text-primary/60" />
          </a>
        </div>
      </section>

      <section id="certifications" className="py-16 bg-gradient-to-br from-muted via-background to-accent">
        <div className="container mx-auto px-4">
          <h2 
            ref={certTitleRef}
            className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Mes Certifications
          </h2>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {certifications.map((cert, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <motion.div 
                    className="h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-xl overflow-hidden shadow-lg bg-white h-full border border-primary/10">
                      <div className="relative aspect-video">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-primary">{cert.title}</h3>
                        <p className="text-gray-600">{cert.date}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary" />
              <CarouselNext className="bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary" />
            </div>
          </Carousel>
        </div>
      </section>
    </>
  );
};
