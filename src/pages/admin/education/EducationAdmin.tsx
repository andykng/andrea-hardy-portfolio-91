
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useEducation, useCertifications, Education, Certification } from "@/hooks/use-education";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash,
  Award,
  Calendar,
  Building,
  Check
} from "lucide-react";
import { EducationDialog } from "@/components/admin/education/EducationDialog";
import { CertificationDialog } from "@/components/admin/education/CertificationDialog";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function EducationAdmin() {
  const { toast } = useToast();
  const { data: educations = [], refetch: refetchEducation, isLoading: isEducationLoading } = useEducation({ adminMode: true });
  const { data: certifications = [], refetch: refetchCertifications, isLoading: isCertificationLoading } = useCertifications({ adminMode: true });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [deleteMode, setDeleteMode] = useState<"education" | "certification">("education");

  // Filtrer les formations et certifications selon le terme de recherche
  const filteredEducations = educations.filter(education => 
    education.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    education.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (education.description && education.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCertifications = certifications.filter(certification => 
    certification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certification.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers pour les formations
  const openCreateEducationDialog = () => {
    setMode("create");
    setSelectedEducation(null);
    setEducationDialogOpen(true);
  };

  const openEditEducationDialog = (education: Education) => {
    setMode("edit");
    setSelectedEducation(education);
    setEducationDialogOpen(true);
  };

  const openDeleteEducationDialog = (education: Education) => {
    setDeleteMode("education");
    setSelectedEducation(education);
    setDeleteDialogOpen(true);
  };

  const handleCreateEducation = async (data: Partial<Education>) => {
    try {
      const { error } = await supabase
        .from('education')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Formation ajoutée avec succès",
        description: "La formation a été ajoutée à votre parcours",
      });
      refetchEducation();
      setEducationDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateEducation = async (data: Partial<Education>) => {
    if (!selectedEducation) return;

    try {
      const { error } = await supabase
        .from('education')
        .update(data)
        .eq('id', selectedEducation.id);

      if (error) throw error;

      toast({
        title: "Formation mise à jour",
        description: "Les modifications ont été enregistrées",
      });
      refetchEducation();
      setEducationDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEducation = async () => {
    if (!selectedEducation) return;

    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', selectedEducation.id);

      if (error) throw error;

      toast({
        title: "Formation supprimée",
        description: "La formation a été retirée de votre parcours",
      });
      refetchEducation();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handlers pour les certifications
  const openCreateCertificationDialog = () => {
    setMode("create");
    setSelectedCertification(null);
    setCertificationDialogOpen(true);
  };

  const openEditCertificationDialog = (certification: Certification) => {
    setMode("edit");
    setSelectedCertification(certification);
    setCertificationDialogOpen(true);
  };

  const openDeleteCertificationDialog = (certification: Certification) => {
    setDeleteMode("certification");
    setSelectedCertification(certification);
    setDeleteDialogOpen(true);
  };

  const handleCreateCertification = async (data: Partial<Certification>) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Certification ajoutée avec succès",
        description: "La certification a été ajoutée à votre parcours",
      });
      refetchCertifications();
      setCertificationDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCertification = async (data: Partial<Certification>) => {
    if (!selectedCertification) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .update(data)
        .eq('id', selectedCertification.id);

      if (error) throw error;

      toast({
        title: "Certification mise à jour",
        description: "Les modifications ont été enregistrées",
      });
      refetchCertifications();
      setCertificationDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCertification = async () => {
    if (!selectedCertification) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', selectedCertification.id);

      if (error) throw error;

      toast({
        title: "Certification supprimée",
        description: "La certification a été retirée de votre parcours",
      });
      refetchCertifications();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (deleteMode === "education") {
      handleDeleteEducation();
    } else {
      handleDeleteCertification();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parcours de Formation</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre parcours académique et vos certifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formations
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={openCreateEducationDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une formation
              </Button>
            </div>
            
            {isEducationLoading ? (
              <div className="space-y-4">
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
            ) : filteredEducations.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucune formation trouvée</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {searchTerm 
                    ? "Aucune formation ne correspond à votre recherche." 
                    : "Commencez par ajouter votre première formation pour présenter votre parcours académique."}
                </p>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Effacer la recherche
                  </Button>
                ) : (
                  <Button onClick={openCreateEducationDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une formation
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEducations.map((education, i) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {education.title}
                            {education.degree && (
                              <Badge variant="outline" className="ml-2">
                                {education.degree}
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditEducationDialog(education)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openDeleteEducationDialog(education)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{education.institution}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(education.start_date), 'MMM yyyy', { locale: fr })} - 
                              {education.end_date 
                                ? ` ${format(new Date(education.end_date), 'MMM yyyy', { locale: fr })}`
                                : " Présent"}
                            </span>
                          </div>
                        </div>
                        {education.description && (
                          <p className="text-sm text-muted-foreground">
                            {education.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={openCreateCertificationDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une certification
              </Button>
            </div>
            
            {isCertificationLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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
            ) : filteredCertifications.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucune certification trouvée</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {searchTerm 
                    ? "Aucune certification ne correspond à votre recherche." 
                    : "Commencez par ajouter votre première certification pour mettre en valeur vos compétences."}
                </p>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Effacer la recherche
                  </Button>
                ) : (
                  <Button onClick={openCreateCertificationDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une certification
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertifications.map((certification, i) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {certification.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditCertificationDialog(certification)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openDeleteCertificationDialog(certification)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{certification.issuer}</span>
                        </div>
                        {certification.date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(certification.date), 'MMM yyyy', { locale: fr })}
                              {certification.expiry_date && ` - Expire: ${format(new Date(certification.expiry_date), 'MMM yyyy', { locale: fr })}`}
                            </span>
                          </div>
                        )}
                        {certification.credential_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => window.open(certification.credential_url!, "_blank")}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Vérifier
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <EducationDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        mode={mode}
        education={selectedEducation}
        onSubmit={mode === "create" ? handleCreateEducation : handleUpdateEducation}
      />

      <CertificationDialog
        open={certificationDialogOpen}
        onOpenChange={setCertificationDialogOpen}
        mode={mode}
        certification={selectedCertification}
        onSubmit={mode === "create" ? handleCreateCertification : handleUpdateCertification}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement {deleteMode === "education" ? "cette formation" : "cette certification"} de votre parcours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
