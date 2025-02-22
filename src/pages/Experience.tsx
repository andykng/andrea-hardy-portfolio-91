import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

const experiences = [
  {
    title: "Chargé de clientèle",
    company: "La Poste",
    period: "2023",
    description:
      "Accueil et conseil aux clients sur les services postaux, bancaires et colis. Gestion des opérations quotidiennes et résolution des problèmes clients.",
  },
  {
    title: "Stagiaire Administrateur Système & Réseau",
    company: "DGFIP",
    period: "2022",
    description:
      "Administration des pare-feux Fortinet, traitement des demandes d'ouverture de flux, maintenance et surveillance du réseau.",
  },
  {
    title: "Technicien Informatique",
    company: "LARENN",
    period: "2021",
    description:
      "Support technique utilisateurs, gestion du réseau, sécurisation des données, maintenance du parc informatique.",
  },
];

export default function ExperiencePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Mon Expérience</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{exp.title}</CardTitle>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-500">{exp.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{exp.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
