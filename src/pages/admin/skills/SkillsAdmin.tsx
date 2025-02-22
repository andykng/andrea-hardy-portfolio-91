import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkillDialog } from "@/components/admin/skills/SkillDialog";
import { useToast } from "@/components/ui/use-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
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
import { Progress } from "@/components/ui/progress";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export default function SkillsAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isAuthenticated, loading } = useRequireAuth();

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('skills-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'skills' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
          queryClient.invalidateQueries({ queryKey: ['skills'] }); // Actualise aussi la vue publique
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isAuthenticated]);

  const handleCreate = async (formData: any) => {
    const { error } = await supabase
      .from('skills')
      .insert([formData]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la compétence",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Compétence créée avec succès",
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    const { error } = await supabase
      .from('skills')
      .update(formData)
      .eq('id', selectedSkill?.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la compétence",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Compétence modifiée avec succès",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    }
    setDeleteDialogOpen(false);
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  const openCreateDialog = () => {
    setMode("create");
    setSelectedSkill(null);
    setDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    setMode("edit");
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setDeleteDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: "bg-blue-500",
      backend: "bg-green-500",
      database: "bg-yellow-500",
      devops: "bg-purple-500",
      mobile: "bg-pink-500",
      other: "bg-gray-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des compétences</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une compétence
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills?.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Progress value={skill.level} className="h-2" />
                      <span className="text-sm text-muted-foreground w-[40px]">
                        {skill.level}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(skill)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openDeleteDialog(skill)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <SkillDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          defaultValues={selectedSkill}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement la compétence.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(selectedSkill?.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
