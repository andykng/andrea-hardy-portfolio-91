
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, School, Calendar, Clock, Building, ExternalLink, User, CheckCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useEducation, useCertifications } from "@/hooks/use-education";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EducationPage() {
  const { data: educations = [], isLoading: isEducationLoading } = useEducation();
  const { data: certifications = [], isLoading: isCertificationLoading } = useCertifications();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy', { locale: fr });
    } catch (error) {
      return '';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">Formation</h1>
          <p className="text-lg text-muted-foreground">
            Mon parcours académique et mes certifications professionnelles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <motion.div
            className="md:col-span-7 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Parcours académique</h2>
              </div>
              <p className="text-muted-foreground">Mon cursus de formation et diplômes</p>
            </div>

            {isEducationLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : educations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Aucune formation disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {educations.map((education, index) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="relative flex items-start group"
                  >
                    <div className="absolute left-0 md:left-1/2 ml-1 md:-ml-3 h-6 w-6 rounded-full bg-primary group-hover:scale-110 transition-transform" />
                    
                    <div className="flex-1 ml-10 md:ml-0 md:mr-10 md:text-right">
                      <div className="flex flex-col p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-primary">
                        <div className="font-bold text-lg mb-1">{education.title}</div>
                        <div className="flex flex-col md:items-end gap-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{education.institution}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(education.start_date)} - 
                              {education.end_date 
                                ? ` ${formatDate(education.end_date)}`
                                : " Présent"}
                            </span>
                          </div>
                        </div>
                        {education.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {education.description}
                          </p>
                        )}
                        {education.degree && (
                          <Badge className="self-start mt-2" variant="outline">
                            {education.degree}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="md:col-span-5 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Certifications</h2>
              </div>
              <p className="text-muted-foreground">Mes certifications professionnelles</p>
            </div>

            {isCertificationLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : certifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Aucune certification disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {certifications.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center p-4">
                        <div className="mr-4 flex-shrink-0">
                          {certification.logo_url ? (
                            <div className="w-14 h-14 rounded overflow-hidden flex items-center justify-center bg-white">
                              <img
                                src={certification.logo_url}
                                alt={certification.title}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded bg-primary/10 flex items-center justify-center">
                              <Award className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{certification.title}</h3>
                          <p className="text-sm text-muted-foreground">{certification.issuer}</p>
                          {certification.date && (