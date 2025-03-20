
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProjectPDFs, saveProjectsConfig } from "@/hooks/use-project-pdfs";
import { ProjectPDF } from "@/types/project-pdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  File,
  FileText, 
  BookOpen, 
  Book, 
  Archive, 
  FolderOpen, 
  Folder,
  FileCode,
  Server,
  Shield,
  Wifi,
  Database,
  Lock,
  Network,
  Save
} from "lucide-react";

// Icônes disponibles
const availableIcons = [
  { name: "fileText", icon: <FileText className="h-5 w-5" />, label: "Document texte" },
  { name: "fileCode", icon: <FileCode className="h-5 w-5" />, label: "Code" },
  { name: "server", icon: <Server className="h-5 w-5" />, label: "Serveur" },
  { name: "database", icon: <Database className="h-5 w-5" />, label: "Base de données" },
  { name: "network", icon: <Network className="h-5 w-5" />, label: "Réseau" },
  { name: "shield", icon: <Shield className="h-5 w-5" />, label: "Sécurité" },
  { name: "lock", icon: <Lock className="h-5 w-5" />, label: "Chiffrement" },
  { name: "wifi", icon: <Wifi className="h-5 w-5" />, label: "WiFi" },
  { name: "bookOpen", icon: <BookOpen className="h-5 w-5" />, label: "Documentation" },
  { name: "book", icon: <Book className="h-5 w-5" />, label: "Guide" },
  { name: "archive", icon: <Archive className="h-5 w-5" />, label: "Archive" },
  { name: "folder", icon: <Folder className="h-5 w-5" />, label: "Dossier" },
  { name: "folderOpen", icon: <FolderOpen className="h-5 w-5" />, label: "Dossier ouvert" },
  { name: "file", icon: <File className="h-5 w-5" />, label: "Fichier" },
];

export default function ProjectsPdfAdmin() {
  const { projects: initialProjects, loading, error } = useProjectPDFs();
  const [projects, setProjects] = useState<ProjectPDF[]>([]);
  const [activeTab, setActiveTab] = useState<string>("year1");
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const handleIconChange = (projectId: string, iconName: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, icon: iconName } : project
    ));
  };

  const handleSave = async () => {
    const result = await saveProjectsConfig(projects);
    
    if (result.success) {
      toast({
        title: "Modifications enregistrées",
        description: "Les icônes des documentations ont été mises à jour avec succès.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour obtenir l'icône correspondant au nom
  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : <FileText className="h-5 w-5" />;
  };

  const year1Projects = projects.filter(p => p.year === 1);
  const year2Projects = projects.filter(p => p.year === 2);

  // Obtenir un dégradé de couleur en fonction de l'année
  const getGradientByYear = (year: number) => {
    return year === 1 
      ? "from-blue-500/20 to-blue-600/10" 
      : "from-primary/20 to-primary/10";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestion des Documentations PDF</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Une erreur est survenue lors du chargement des documentations: {error.message}</p>
              <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Documentations PDF</h1>
            <p className="text-muted-foreground">
              Personnalisez les icônes associées à chaque documentation technique
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>

        <Tabs defaultValue="year1" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="year1">Année 1</TabsTrigger>
            <TabsTrigger value="year2">Année 2</TabsTrigger>
          </TabsList>
          
          <TabsContent value="year1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {year1Projects.length === 0 ? (
                <p>Aucune documentation pour l'année 1</p>
              ) : (
                year1Projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradientByYear(project.year)} flex items-center justify-center`}>
                            {getIconComponent(project.icon || 'fileText')}
                          </div>
                          <span className="truncate">{project.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 truncate">
                          {project.path}
                        </p>
                        <Select
                          value={project.icon || 'fileText'}
                          onValueChange={(value) => handleIconChange(project.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une icône" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center gap-2">
                                  {icon.icon}
                                  <span>{icon.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="year2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {year2Projects.length === 0 ? (
                <p>Aucune documentation pour l'année 2</p>
              ) : (
                year2Projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradientByYear(project.year)} flex items-center justify-center`}>
                            {getIconComponent(project.icon || 'fileText')}
                          </div>
                          <span className="truncate">{project.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 truncate">
                          {project.path}
                        </p>
                        <Select
                          value={project.icon || 'fileText'}
                          onValueChange={(value) => handleIconChange(project.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une icône" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center gap-2">
                                  {icon.icon}
                                  <span>{icon.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
