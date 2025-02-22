
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";

const Index = () => {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Header />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Education />
      </main>
    </div>
  );
};

export default Index;
