
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Cpu, 
  FolderKanban, 
  GraduationCap, 
  ArrowUp,
  ArrowDown,
  Users,
  Eye,
  BookText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardPage() {
  const { data: pageViews } = useQuery({
    queryKey: ['pageViews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, views')
        .order('views', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: experienceCount } = useQuery({
    queryKey: ['experienceCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: skillsCount } = useQuery({
    queryKey: ['skillsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: projectsCount } = useQuery({
    queryKey: ['projectsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-500">Gérez votre contenu et surveillez les statistiques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Expériences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{experienceCount || 0}</p>
                <p className="text-sm text-gray-500">Expériences professionnelles</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Compétences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{skillsCount || 0}</p>
                <p className="text-sm text-gray-500">Technologies maîtrisées</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="w-5 h-5 text-primary" />
                Blog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{0}</p>
                <p className="text-sm text-gray-500">Articles publiés</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                Projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{projectsCount || 0}</p>
                <p className="text-sm text-gray-500">Projets réalisés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Pages les plus visitées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageViews?.map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-600">{page.slug}</span>
                    <span className="font-medium">{page.views || 0} vues</span>
                  </div>
                )) || (
                  <p className="text-gray-500">Aucune vue pour le moment</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Visite",
                    item: "Page Compétences",
                    time: "À l'instant",
                  }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">
                        {activity.action}: {activity.item}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
