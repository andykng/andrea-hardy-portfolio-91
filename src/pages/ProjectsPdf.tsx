
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useProjectPDFs } from "@/hooks/use-project-pdfs";
import { 
  File, Book, FileText, ExternalLink, 
  Server, Shield, Database, Network, Globe, Settings, Terminal,
  Code, FolderOpen, HardDrive, Share, ShieldAlert, Key, Activity,
  Save, Download, Laptop, AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Composant pour l'icône dynamique
const DynamicIcon = ({ iconName, className = "h-5 w-5" }) => {
  const IconMap = {
    'file-text': FileText,
    'server': Server,
    'shield': Shield,
    'database': Database,
    'network': Network,
    'globe': Globe,
    'settings': Settings,
    'terminal': Terminal,
    'code': Code,
    'folder-open': FolderOpen,
    'hard-drive': HardDrive,
    'share': Share,
    'shield-alert': ShieldAlert,
    'key': Key,
    'activity': Activity,
    'save': Save,
    'download': Download,
    'windows': Laptop, // Changed from Windows to Laptop
    'ban': AlertCircle,
  };

  const IconComponent = IconMap[iconName] || FileText;
  return <IconComponent className={className} />;
};

export default function ProjectsPdf() {
  const { projects, loading, loadProjects, generateAndSaveProjectsConfig } = useProjectPDFs();
  const [year1Projects, setYear1Projects] = useState([]);
  const [year2Projects, setYear2Projects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Si les projets sont vides après le chargement, les générer automatiquement
    if (!loading && projects.length === 0) {
      console.log("Aucun projet trouvé, génération automatique...");
      generateAndSaveProjectsConfig();
    }
  }, [loading, projects.length, generateAndSaveProjectsConfig]);
  
  useEffect(() => {
    if (projects) {
      const year1 = projects.filter(project => project.year === 1);
      const year2 = projects.filter(project => project.year === 2);
      
      // Extraction des catégories uniques
      const uniqueCategories = [...new Set(projects.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      // Filtrage des projets
      const filteredYear1 = filterProjects(year1);
      const filteredYear2 = filterProjects(year2);
      
      setYear1Projects(filteredYear1);
      setYear2Projects(filteredYear2);
    }
  }, [projects, searchTerm, selectedCategory]);
  
  // Fonction pour filtrer les projets
  const filterProjects = (projectsList) => {
    return projectsList.filter(project => {
      const matchesSearch = (
        (project.displayName || project.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Fonction pour rafraîchir manuellement les projets
  const handleRefresh = () => {
    generateAndSaveProjectsConfig();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">Documentation BTS</h1>
          <p className="text-lg text-muted-foreground">
            Explorez la documentation technique développée au cours de mon BTS SIO option SISR
          </p>
          
          {/* Bouton de rafraîchissement visible uniquement quand il n'y a pas de projets */}
          {!loading && projects.length === 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleRefresh} className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Initialiser les documents
              </Button>
            </div>
          )}
        </motion.div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="year1" className="max-w-6xl mx-auto">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="year1" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Année 1
              </TabsTrigger>
              <TabsTrigger value="year2" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Année 2
              </TabsTrigger>
            </TabsList>

            <TabsContent value="year1">
              <div className="grid grid-cols-1 gap-4">
                {year1Projects.length === 0 ? (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">Aucun document trouvé pour cette année</p>
                  </div>
                ) : (
                  year1Projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center"
                    >
                      <div className="bg-primary/10 p-3 rounded-md text-primary mr-4">
                        <DynamicIcon iconName={project.icon || 'file-text'} className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{project.displayName || project.title}</h3>
                        {project.description && (
                          <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                        )}
                        {project.category && (
                          <Badge variant="outline" className="mt-2">
                            {project.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="ml-4"
                      >
                        <a href={project.path} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="year2">
              <div className="grid grid-cols-1 gap-4">
                {year2Projects.length === 0 ? (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">Aucun document trouvé pour cette année</p>
                  </div>
                ) : (
                  year2Projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center"
                    >
                      <div className="bg-primary/10 p-3 rounded-md text-primary mr-4">
                        <DynamicIcon iconName={project.icon || 'file-text'} className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{project.displayName || project.title}</h3>
                        {project.description && (
                          <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                        )}
                        {project.category && (
                          <Badge variant="outline" className="mt-2">
                            {project.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="ml-4"
                      >
                        <a href={project.path} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
