
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useProjectPDFs } from "@/hooks/use-project-pdfs";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  File, 
  FileText, 
  BookOpen, 
  Book, 
  Archive, 
  FolderOpen, 
  Folder, 
  Download, 
  Eye, 
  FileCode,
  Server,
  Shield,
  Wifi,
  Database,
  Lock,
  Network
} from "lucide-react";

export default function ProjectsPdfPage() {
  const { projects, loading, error } = useProjectPDFs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fonction pour obtenir l'icône correspondant au nom
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      file: <File className="h-5 w-5" />,
      fileText: <FileText className="h-5 w-5" />,
      fileCode: <FileCode className="h-5 w-5" />,
      bookOpen: <BookOpen className="h-5 w-5" />,
      book: <Book className="h-5 w-5" />,
      archive: <Archive className="h-5 w-5" />,
      folder: <Folder className="h-5 w-5" />,
      folderOpen: <FolderOpen className="h-5 w-5" />,
      server: <Server className="h-5 w-5" />,
      shield: <Shield className="h-5 w-5" />,
      wifi: <Wifi className="h-5 w-5" />,
      database: <Database className="h-5 w-5" />,
      lock: <Lock className="h-5 w-5" />,
      network: <Network className="h-5 w-5" />,
    };
    
    return iconMap[iconName] || <FileText className="h-5 w-5" />;
  };

  // Filtrer les projets selon le terme de recherche
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer selon l'année
  const year1Projects = filteredProjects.filter(p => p.year === 1);
  const year2Projects = filteredProjects.filter(p => p.year === 2);
  
  // Déterminer les projets à afficher selon l'onglet actif
  const displayedProjects = 
    activeTab === "all" ? filteredProjects : 
    activeTab === "year1" ? year1Projects : 
    year2Projects;

  // Obtenir un dégradé de couleur en fonction de l'année
  const getGradientByYear = (year: number) => {
    return year === 1 
      ? "from-blue-500/20 to-blue-600/10" 
      : "from-primary/20 to-primary/10";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 space-y-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">
            Documentation BTS
          </h1>
          <p className="text-lg text-muted-foreground">
            Consultez mes documentations techniques réalisées pendant mes deux années de BTS SIO option SISR
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 justify-between items-center"
        >
          <div className="relative w-full md:w-auto flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une documentation..."
              className="pl-9 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="year1">Année 1</TabsTrigger>
              <TabsTrigger value="year2">Année 2</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              Une erreur est survenue lors du chargement des projets
            </div>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchTerm 
                ? "Aucune documentation ne correspond à votre recherche." 
                : "Aucune documentation disponible."}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Réinitialiser la recherche
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-primary">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientByYear(project.year)} flex items-center justify-center text-primary`}>
                        {getIconComponent(project.icon || 'fileText')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{project.title}</h3>
                        <div className="flex items-center mb-2">
                          <span className={`text-sm px-2 py-0.5 rounded-full ${project.year === 1 ? 'bg-blue-100 text-blue-700' : 'bg-primary/10 text-primary/90'}`}>
                            BTS {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(project.path, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Consulter
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={project.path} download>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
