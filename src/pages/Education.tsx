
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, School, Calendar, Clock, Building, ExternalLink, User, CheckCircle, FileText, Badge } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useEducation, useCertifications } from "@/hooks/use-education";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

        <Tabs defaultValue="education" className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="education" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                Parcours
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Compétences
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="education">
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
                          <BadgeComponent className="self-start mt-2" variant="outline">
                            {education.degree}
                          </BadgeComponent>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certifications">
            {isCertificationLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : certifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Aucune certification disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-primary">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-4 mb-4">
                            {certification.logo_url ? (
                              <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-white border">
                                <img
                                  src={certification.logo_url}
                                  alt={certification.title}
                                  className="w-14 h-14 object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                                <Award className="h-8 w-8 text-primary" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-lg">{certification.title}</h3>
                              <p className="text-sm text-muted-foreground">{certification.issuer}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-auto">
                            {certification.date && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary/70" />
                                <span>Obtenue en {formatDate(certification.date)}</span>
                              </div>
                            )}
                            
                            {certification.expiry_date && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary/70" />
                                <span>Expire en {formatDate(certification.expiry_date)}</span>
                              </div>
                            )}
                            
                            {certification.credential_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                                onClick={() => window.open(certification.credential_url!, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Vérifier le certificat
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Mes compétences professionnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Infrastructure & Réseau</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Administration de serveurs Windows/Linux</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Mise en place et gestion de services réseau</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Configuration de pare-feu et sécurité réseau</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Déploiement et gestion d'Active Directory</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Solutions de sauvegarde et de restauration</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Développement & Web</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Développement d'applications web</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Conception et optimisation de bases de données</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Intégration d'APIs et services tiers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Développement frontend moderne</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Tests et déploiement continu</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
