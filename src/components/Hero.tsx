
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

  return (
    <>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative bg-gradient-to-br from-accent via-background to-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bonjour, je suis Andrea Hardy
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Administratrice Système & Réseau passionnée par la sécurité et la gestion de projets IT
              </p>
            </div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              whileHover={{ scale: 1.02 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                Télécharger mon CV
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-primary/10 hover:text-primary w-full sm:w-auto">
                Me Contacter
              </Button>
            </motion.div>
          </motion.div>

          <motion.a
            href="#certifications"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-8 w-8 text-primary/60" />
          </motion.a>
        </div>
      </section>

      <section id="certifications" className="py-16 bg-gradient-to-br from-muted via-background to-accent">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Mes Certifications
          </motion.h2>
          
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
