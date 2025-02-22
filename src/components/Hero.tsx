
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
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Andrea Hardy"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Bonjour, je suis <span className="text-primary">Andrea Hardy</span>
            </h1>
            <p className="text-xl text-gray-600">
              Administratrice Système & Réseau passionnée par la sécurité et la gestion de projets IT
            </p>
            <motion.div 
              className="flex gap-4 justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Button size="lg">Télécharger mon CV</Button>
              <Button variant="outline" size="lg">Me Contacter</Button>
            </motion.div>
          </motion.div>
          <motion.a
            href="#certifications"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </motion.a>
        </div>
      </section>

      <section id="certifications" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Mes Certifications
          </motion.h2>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {certifications.map((cert, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="p-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{cert.title}</h3>
                        <p className="text-gray-600">{cert.date}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </>
  );
};
