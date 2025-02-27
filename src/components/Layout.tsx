
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect, useRef, useState } from "react";
import { useMedia } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const isMobile = useMedia("(max-width: 768px)");
  
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  // Réduire l'effet de scale sur mobile pour plus de stabilité
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1.01 : 1.05]);

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

    // Track mouse position for AR-like effects - seulement sur desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up scripts if needed
      if (document.body.contains(injectScript)) {
        document.body.removeChild(injectScript);
      }
      if (document.body.contains(botContentScript)) {
        document.body.removeChild(botContentScript);
      }
    };
  }, [isMobile]);

  // Calculate 3D effect based on mouse position - réduit sur mobile
  const calculateParallax = (depth = isMobile ? 100 : 30) => {
    if (!mainRef.current || isMobile) return { x: 0, y: 0 };
    
    const rect = mainRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const moveX = (mousePosition.x - centerX) / depth;
    const moveY = (mousePosition.y - centerY) / depth;
    
    return { x: moveX, y: moveY };
  };

  const parallaxEffect = calculateParallax();

  // Generate floating particles for AR effect - réduit sur mobile
  const particles = Array.from({ length: isMobile ? 5 : 15 }, (_, i) => ({
    id: i,
    size: Math.random() * (isMobile ? 5 : 10) + (isMobile ? 3 : 5),
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/20 to-white relative overflow-hidden">
      {/* AR-style animated background elements - réduit sur mobile */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{
          opacity: bgOpacity,
          scale: bgScale
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-50 mix-blend-overlay" />
        
        {/* Floating particles - moins nombreux sur mobile */}
        {!isMobile && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-200/30 backdrop-blur-sm"
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
        
        {/* 3D moving effect based on mouse position - désactivé sur mobile */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,144,255,0.15),transparent_60%)]"
            animate={{
              x: parallaxEffect.x * 2,
              y: parallaxEffect.y * 2,
            }}
            transition={{ type: "spring", damping: 15 }}
          />
        )}
      </motion.div>

      <Header />
      <motion.main 
        ref={mainRef}
        className="flex-grow pt-14 md:pt-16 pb-20 md:pb-0 min-h-[calc(100vh-4rem)]"
        initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isMobile ? 0.3 : 0.5 }}
        style={{
          perspective: isMobile ? "500px" : "1000px",
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            x: isMobile ? 0 : parallaxEffect.x,
            y: isMobile ? 0 : parallaxEffect.y,
          }}
          transition={{ type: "spring", damping: 25 }}
        >
          {children}
        </motion.div>
      </motion.main>
      <Footer className="hidden md:block" />
      
      {/* Logo watermark for AR effect - plus petit et moins visible sur mobile */}
      {!isMobile && (
        <motion.div
          className="fixed bottom-20 md:bottom-10 right-10 w-16 md:w-20 h-16 md:h-20 opacity-10 pointer-events-none"
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
      )}
    </div>
  );
}
