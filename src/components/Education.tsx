
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

const education = [
  {
    title: "BTS Services Info aux Organisations",
    institution: "Institution",
    period: "2021 - 2023",
  },
  {
    title: "Classe Préparatoire",
    institution: "UCAC-ICAM",
    period: "2020 - 2021",
  },
];

const certifications = [
  "AWS Cloud Computing",
  "ANSSI SecNum Académie",
  "PIX",
];

export const Education = () => {
  return (
    <section id="formation" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Formation</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="animate-fade-up">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{edu.title}</CardTitle>
                      <p className="text-primary font-medium">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500">{edu.period}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div>
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {certifications.map((cert) => (
                    <li key={cert} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-gray-600">{cert}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
