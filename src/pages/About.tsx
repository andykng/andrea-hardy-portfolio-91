
import { Layout } from "@/components/Layout";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";

export default function AboutPage() {
  const { data: sections, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start end", "end start"] 
  });

  // AR-like parallax effect on scroll
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  
  return (
    <Layout>
      <div 
        className="container mx-auto px-4 py-12 relative"
        ref={containerRef}
        style={{ position: 'relative' }} // Fix for framer-motion warning
      >
        {/* Floating logo animation */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 opacity-10 pointer-events-none"
          style={{
            scale: logoScale,
            rotate: logoRotate,
          }}
        >
          <img 
            src="https://res.cloudinary.com/drbfimvy9/image/upload/v1740674530/Logo_500x500_px_1_chmwqa.gif" 
            alt="Logo animé"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: titleY }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 relative">
            À propos de moi
            <motion.span 
              className="absolute -inset-1 rounded-lg bg-primary/5 -z-10 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            />
          </span>
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {sections?.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Card className="overflow-hidden border-primary/10 relative backdrop-blur-sm bg-white/90">
                  {/* AR-style decorative elements */}
                  <motion.div 
                    className="absolute -right-4 -top-4 w-12 h-12 rounded-full bg-primary/10"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                  <motion.div 
                    className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full bg-primary/5"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <motion.span 
                        className="inline-block bg-primary/10 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-primary font-bold"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.image_url && (
                      <div className="mb-4">
                        <img 
                          src={section.image_url} 
                          alt={section.title} 
                          className="w-full h-auto rounded-lg shadow-md" 
                        />
                      </div>
                    )}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* 3D floating particles for AR effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
