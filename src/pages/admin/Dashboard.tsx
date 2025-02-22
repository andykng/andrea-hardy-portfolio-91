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

export default function DashboardPage() {
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">24</p>
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
                <p className="text-2xl font-bold">6</p>
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
                <p className="text-2xl font-bold">12</p>
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
                {[
                  { page: "À propos", views: 1234 },
                  { page: "Blog", views: 856 },
                  { page: "Compétences", views: 642 },
                  { page: "Projets", views: 435 },
                ].map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-600">{page.page}</span>
                    <span className="font-medium">{page.views} vues</span>
                  </div>
                ))}
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
                    action: "Publication",
                    item: "Article: Les tendances DevOps 2024",
                    time: "Il y a 2h",
                  },
                  {
                    action: "Mise à jour",
                    item: "Page À propos",
                    time: "Il y a 3h",
                  },
                  {
                    action: "Création",
                    item: "Nouveau projet: Portfolio v2",
                    time: "Il y a 5h",
                  },
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
