import { motion } from "framer-motion";
import { Code, Server, Shield, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const skills = [
  {
    title: "Systèmes & Réseaux",
    icon: Server,
    items: [
      { name: "Windows Server", level: 85 },
      { name: "Linux", level: 80 },
      { name: "Virtualisation", level: 75 },
      { name: "VLAN", level: 70 },
      { name: "DHCP/DNS", level: 85 },
    ],
  },
  {
    title: "Sécurité",
    icon: Shield,
    items: [
      { name: "Pare-feu", level: 80 },
      { name: "SSL/TLS", level: 75 },
      { name: "GPG", level: 70 },
      { name: "IAM", level: 65 },
    ],
  },
  {
    title: "Virtualisation & Cloud",
    icon: Cloud,
    items: [
      { name: "Docker", level: 85 },
      { name: "Proxmox", level: 75 },
      { name: "AWS", level: 70 },
      { name: "Azure", level: 65 },
    ],
  },
  {
    title: "Support & Projets",
    icon: Code,
    items: [
      { name: "Diagnostic d'incidents", level: 90 },
      { name: "Documentation", level: 85 },
      { name: "Gestion de projets IT", level: 80 },
    ],
  },
];

export default function SkillsPage() {
  useEffect(() => {
    const trackPageView = async () => {
      const { error } = await supabase
        .from('pages')
        .upsert({ 
          slug: 'competences',
          title: 'Compétences',
          content: 'Page des compétences',
          views: 1 
        }, {
          onConflict: 'slug',
          count: 'exact'
        });

      if (error) {
        console.error('Erreur lors du suivi de la page :', error);
      }
    };

    trackPageView();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Mes Compétences</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <skill.icon className="h-6 w-6 text-primary" />
                    <CardTitle>{skill.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skill.items.map((item, itemIndex) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.level}%` }}
                          transition={{ delay: index * 0.2 + itemIndex * 0.1, duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
