import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useProjects } from "@/hooks/use-projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Search, SlidersHorizontal, Code, FileText, BookOpen } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectPDFs } from "@/hooks/use-project-pdfs";
import { icons } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const { projects: pdfProjects, loading: pdfLoading } = useProjectPDFs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [contentTab, setContentTab] = useState<"projects" | "pdfs">("projects");

  // Extraire toutes les technologies uniques de tous les projets
  const allTechnologies = [...new Set(
    projects.flatMap(project => project.technologies || [])
  )].sort();

  // Filtrer les projets par terme de recherche et technologie
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = 
      !activeTech || 
      (project.technologies && project.technologies.includes(activeTech));
    
    return matchesSearch && matchesTech;
  });

  // Filtrer les projets PDF par terme de recherche et année
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const filteredPdfProjects = pdfProjects.filter(project => {
    const matchesSearch = 
      !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = 
      !selectedYear || 
      project.year === selectedYear;
    
    return matchesSearch && matchesYear;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTech(null);
    setSelectedYear(null);
  };

  // Fonction pour afficher la bonne icône Lucide
  const LucideIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = icons[iconName as keyof typeof icons] || FileText;
    return <IconComponent className="h-6 w-6" />;
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
            Mes Projets
          </h1>
          <p className="text-lg text-muted-foreground">
            Découvrez une sélection de mes projets les plus récents, mettant en avant
            mes compétences en développement web et en conception d'interfaces.
          </p>
        </motion.div>

        {/* Onglets pour choisir entre projets web et PDF */}
        <Tabs 
          defaultValue="projects" 
          className="w-full" 
          onValueChange={(value) => setContentTab(value as "projects" | "pdfs")}
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Projets Web
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Documentation BTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 justify-between items-center"
            >
              <div className="relative w-full md:w-auto flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un projet..."
                  className="pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtrer
                      {activeTech && <Badge variant="secondary" className="ml-2">{activeTech}</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Technologies</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-y-auto">
                      {allTechnologies.map((tech) => (
                        <DropdownMenuItem
                          key={tech}
                          className="flex items-center cursor-pointer"
                          onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                        >
                          <div className="flex-1">{tech}</div>
                          {activeTech === tech && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </DropdownMenuItem>
                      ))}
                    </div>
                    {(activeTech || searchTerm) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={resetFilters} className="text-primary">
                          Réinitialiser les filtres
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Tabs defaultValue="grid" className="w-[180px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="grid" 
                      onClick={() => setViewMode("grid")}
                      className="flex items-center gap-2"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2h4v4H2V2zm7 0h4v4H9V2zm-7 7h4v4H2V9zm7 0h4v4H9V9z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      Grille
                    </TabsTrigger>
                    <TabsTrigger 
                      value="list" 
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-2"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3h11v1H2V3zm0 4h11v1H2V7zm0 4h11v1H2v-1z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      Liste
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>

            {isLoading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-8`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
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
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucun projet trouvé</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {searchTerm || activeTech
                    ? "Aucun projet ne correspond à vos critères de recherche."
                    : "De nouveaux projets seront bientôt ajoutés."}
                </p>
                {(searchTerm || activeTech) && (
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className={`${
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "space-y-6"
              }`}>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {project.image_url ? (
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                              <Code className="h-10 w-10 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="bg-white">
                          <CardTitle className="text-xl font-semibold tracking-tight">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white space-y-4 flex-grow">
                          <p className="text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className="px-2 py-1 text-xs font-medium rounded-full border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                                onClick={() => setActiveTech(tech)}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-3 pt-4 mt-auto">
                            {project.demo_url && (
                              <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                                onClick={() => window.open(project.demo_url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Démo
                              </Button>
                            )}
                            {project.github_url && (
                              <Button
                                variant="outline"
                                className="flex-1 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                                onClick={() => window.open(project.github_url, '_blank')}
                              >
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative overflow-hidden">
                            {project.image_url ? (
                              <img
                                src={project.image_url}
                                alt={project.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center h-full">
                                <Code className="h-10 w-10 text-primary/40" />
                              </div>
                            )}
                          </div>
                          <div className="md:w-2/3 p-6">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-muted-foreground mb-4">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies?.map((tech, techIndex) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="px-2 py-1 text-xs font-medium rounded-full border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                                  onClick={() => setActiveTech(tech)}
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              {project.demo_url && (
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white"
                                  onClick={() => window.open(project.demo_url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Démo
                                </Button>
                              )}
                              {project.github_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                                  onClick={() => window.open(project.github_url, '_blank')}
                                >
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pdfs" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 justify-between items-center"
            >
              <div className="relative w-full md:w-auto flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtrer par année
                      {selectedYear && <Badge variant="secondary" className="ml-2">Année {selectedYear}</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Année</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer"
                      onClick={() => setSelectedYear(selectedYear === 1 ? null : 1)}
                    >
                      <div className="flex-1">Année 1</div>
                      {selectedYear === 1 && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer"
                      onClick={() => setSelectedYear(selectedYear === 2 ? null : 2)}
                    >
                      <div className="flex-1">Année 2</div>
                      {selectedYear === 2 && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </DropdownMenuItem>
                    {(selectedYear || searchTerm) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={resetFilters} className="text-primary">
                          Réinitialiser les filtres
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Tabs defaultValue="grid" className="w-[180px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="grid" 
                      onClick={() => setViewMode("grid")}
                      className="flex items-center gap-2"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2h4v4H2V2zm7 0h4v4H9V2zm-7 7h4v4H2V9zm7 0h4v4H9V9z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      Grille
                    </TabsTrigger>
                    <TabsTrigger 
                      value="list" 
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-2"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3h11v1H2V3zm0 4h11v1H2V7zm0 4h11v1H2v-1z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      Liste
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>

            {pdfLoading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-8`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
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
            ) : filteredPdfProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucun document trouvé</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {searchTerm || selectedYear
                    ? "Aucun document ne correspond à vos critères de recherche."
                    : "De nouveaux documents seront bientôt ajoutés."}
                </p>
                {(searchTerm || selectedYear) && (
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className={`${
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "space-y-6"
              }`}>
                {filteredPdfProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                        <div className="bg-primary/5 p-6 flex items-center justify-center">
                          <LucideIcon iconName={project.icon} />
                        </div>
                        <CardHeader className="bg-white">
                          <CardTitle className="text-xl font-semibold tracking-tight">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white space-y-4 flex-grow">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-primary/5 text-primary">
                              Année {project.year}
                            </Badge>
                          </div>
                          <div className="flex gap-3 pt-4 mt-auto">
                            <Button
                              className="flex-1 bg-primary hover:bg-primary/90 text-white"
                              onClick={() => window.open(project.path, '_blank')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Voir le PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/6 p-6 bg-primary/5 flex items-center justify-center">
                            <LucideIcon iconName={project.icon} />
                          </div>
                          <div className="md:w-5/6 p-6">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="bg-primary/5 text-primary">
                                Année {project.year}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white"
                              onClick={() => window.open(project.path, '_blank')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Voir le PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
