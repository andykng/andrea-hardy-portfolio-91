
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect, useRef, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  // Attach Botpress chatbot
  useEffect(() => {
    // Load Botpress scripts
    const injectScript = document.createElement('script');
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/iject.js";
    injectScript.async = true;
    document.body.appendChild(injectScript);

    const botContentScript = document.createElement('script');
    botContentScript.src = "https://files.bpcontent.cloud/2025/01/12/21/20250112214312-ME7PRJYQ.js";
    botContentScript.async = true;
    document.body.appendChild(botContentScript);

    // Track mouse position for AR-like effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up scripts if needed
      document.body.removeChild(injectScript);
      document.body.removeChild(botContentScript);
    };
  }, []);

  // Calculate 3D effect based on mouse position
  const calculateParallax = (depth = 30) => {
    if (!mainRef.current) return { x: 0, y: 0 };
    
    const rect = mainRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const moveX = (mousePosition.x - centerX) / depth;
    const moveY = (mousePosition.y - centerY) / depth;
    
    return { x: moveX, y: moveY };
  };

  const parallaxEffect = calculateParallax();

  // Generate floating particles for AR effect
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-muted/10 relative overflow-hidden">
      {/* AR-style animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{
          opacity: bgOpacity,
          scale: bgScale
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-primary/5 mix-blend-overlay" />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/10 backdrop-blur-sm"
            style={{
              width: particle.size,
              height: particle.size,
              top: `${particle.y}%`,
              left: `${particle.x}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* 3D moving effect based on mouse position */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,144,255,0.1),transparent_50%)]"
          animate={{
            x: parallaxEffect.x * 2,
            y: parallaxEffect.y * 2,
          }}
          transition={{ type: "spring", damping: 15 }}
        />
      </motion.div>

      <Header />
      <motion.main 
        ref={mainRef}
        className="flex-grow pt-14 md:pt-16 pb-20 md:pb-0 min-h-[calc(100vh-4rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            x: parallaxEffect.x,
            y: parallaxEffect.y,
          }}
          transition={{ type: "spring", damping: 25 }}
        >
          {children}
        </motion.div>
      </motion.main>
      <Footer className="hidden md:block" />
      
      {/* Logo watermark for AR effect */}
      <motion.div
        className="fixed bottom-20 md:bottom-10 right-10 w-20 h-20 opacity-10 pointer-events-none"
        animate={{ 
          rotate: [0, 10, 0, -10, 0],
          scale: [1, 1.05, 1, 0.95, 1] 
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <img 
          src="https://res.cloudinary.com/drbfimvy9/image/upload/v1740674528/Logo_500x500_px_3_qaqvgc.png" 
          alt="Logo watermark"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
}
