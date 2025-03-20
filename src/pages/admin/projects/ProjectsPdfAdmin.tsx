
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ProjectPDF } from "@/types/project-pdf";
import { useProjectPDFs } from "@/hooks/use-project-pdfs";
import { AlertTriangle, FileText, RefreshCw, Save, Edit2, Check, X, Settings } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectsPdfAdmin() {
  const { projects, loading, loadProjects, updateProject } = useProjectPDFs();
  const { toast } = useToast();
  const [year1Projects, setYear1Projects] = useState<ProjectPDF[]>([]);
  const [year2Projects, setYear2Projects] = useState<ProjectPDF[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectPDF | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Séparer les projets par année
  useEffect(() => {
    if (projects) {
      setYear1Projects(projects.filter(project => project.year === 1));
      setYear2Projects(projects.filter(project => project.year === 2));
    }
  }, [projects]);

  // Fonction pour rafraîchir les projets
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadProjects();
      toast({
        title: "Rafraîchissement réussi",
        description: "La liste des projets PDF a été mise à jour.",
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les projets PDF.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Gérer l'ouverture du dialogue d'édition
  const handleEdit = (project: ProjectPDF) => {
    setEditingProject({ ...project });
    setDialogOpen(true);
  };

  // Gérer la sauvegarde d'un projet
  const handleSaveProject = async () => {
    if (!editingProject) return;
    
    setSaving(true);
    
    try {
      const success = updateProject(editingProject);
      
      if (success) {
        toast({
          title: "Projet modifié",
          description: "Les modifications ont été enregistrées avec succès.",
        });
        setDialogOpen(false);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le projet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Générer le tableau des projets
  const renderProjectsTable = (projectsList: ProjectPDF[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Nom affiché</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectsList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              Aucun projet trouvé
            </TableCell>
          </TableRow>
        ) : (
          projectsList.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-mono text-xs">{project.title}</TableCell>
              <TableCell>{project.displayName || project.title}</TableCell>
              <TableCell>{project.category || "Non classé"}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Éditer
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  // Disponible uniquement si les projets sont chargés
  const isDataLoaded = !loading && projects.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projets PDF</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Chargement des projets...</p>
              </div>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Aucun projet PDF n'a été trouvé dans le système.
                </p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="year1">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="year1">Année 1</TabsTrigger>
              <TabsTrigger value="year2">Année 2</TabsTrigger>
            </TabsList>
            
            <TabsContent value="year1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Projets - Année 1
                  </CardTitle>
                  <CardDescription>
                    Liste des fichiers PDF de la première année de BTS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderProjectsTable(year1Projects)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="year2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Projets - Année 2
                  </CardTitle>
                  <CardDescription>
                    Liste des fichiers PDF de la deuxième année de BTS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderProjectsTable(year2Projects)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Dialogue d'édition */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>
              Personnalisez l'affichage et les métadonnées du projet PDF.
            </DialogDescription>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nom du fichier</Label>
                <Input
                  id="title"
                  value={editingProject.title}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Nom affiché</Label>
                <Input
                  id="displayName"
                  value={editingProject.displayName || ""}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    displayName: e.target.value
                  })}
                  placeholder="Nom affiché pour les visiteurs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select
                  value={editingProject.icon || "file-text"}
                  onValueChange={(value) => setEditingProject({
                    ...editingProject,
                    icon: value
                  })}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file-text">Document</SelectItem>
                    <SelectItem value="server">Serveur</SelectItem>
                    <SelectItem value="shield">Sécurité</SelectItem>
                    <SelectItem value="database">Base de données</SelectItem>
                    <SelectItem value="network">Réseau</SelectItem>
                    <SelectItem value="globe">Internet</SelectItem>
                    <SelectItem value="settings">Configuration</SelectItem>
                    <SelectItem value="terminal">Terminal</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="folder-open">Dossier</SelectItem>
                    <SelectItem value="hard-drive">Stockage</SelectItem>
                    <SelectItem value="share">Partage</SelectItem>
                    <SelectItem value="shield-alert">Firewall</SelectItem>
                    <SelectItem value="key">Clé</SelectItem>
                    <SelectItem value="activity">Monitoring</SelectItem>
                    <SelectItem value="save">Sauvegarde</SelectItem>
                    <SelectItem value="download">Installation</SelectItem>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="ban">Blocage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={editingProject.category || "Autre"}
                  onValueChange={(value) => setEditingProject({
                    ...editingProject,
                    category: value
                  })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serveur Web">Serveur Web</SelectItem>
                    <SelectItem value="Sécurité">Sécurité</SelectItem>
                    <SelectItem value="DNS">DNS</SelectItem>
                    <SelectItem value="Transfert de fichiers">Transfert de fichiers</SelectItem>
                    <SelectItem value="DHCP">DHCP</SelectItem>
                    <SelectItem value="Firewall & Sécurité">Firewall & Sécurité</SelectItem>
                    <SelectItem value="Windows Server">Windows Server</SelectItem>
                    <SelectItem value="Bases de données">Bases de données</SelectItem>
                    <SelectItem value="Sauvegarde">Sauvegarde</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Installation & Configuration">Installation & Configuration</SelectItem>
                    <SelectItem value="Réseaux">Réseaux</SelectItem>
                    <SelectItem value="Firewall OPNsense">Firewall OPNsense</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    description: e.target.value
                  })}
                  placeholder="Description du projet PDF"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSaveProject} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
