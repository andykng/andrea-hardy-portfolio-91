
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-muted/10">
      <Header />
      <motion.main 
        className="flex-grow pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
