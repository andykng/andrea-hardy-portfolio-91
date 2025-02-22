
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Expérience Professionnelle</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="animate-fade-up">
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
          ))}
        </div>
      </div>
    </section>
  );
};
