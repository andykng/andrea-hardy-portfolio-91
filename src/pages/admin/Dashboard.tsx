
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
  Eye
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Expériences",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Briefcase,
    },
    {
      title: "Total Compétences",
      value: "24",
      change: "+5",
      trend: "up",
      icon: Cpu,
    },
    {
      title: "Total Projets",
      value: "12",
      change: "+3",
      trend: "up",
      icon: FolderKanban,
    },
    {
      title: "Total Formations",
      value: "4",
      change: "0",
      trend: "neutral",
      icon: GraduationCap,
    },
  ];

  const activities = [
    {
      type: "update",
      item: "Compétence React",
      date: "Il y a 2 heures",
    },
    {
      type: "create",
      item: "Projet Portfolio",
      date: "Il y a 3 heures",
    },
    {
      type: "delete",
      item: "Ancienne expérience",
      date: "Il y a 1 jour",
    },
  ];

  const visitors = [
    { page: "Accueil", views: 1234 },
    { page: "Projets", views: 856 },
    { page: "Compétences", views: 642 },
    { page: "Expériences", views: 435 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-8 h-8 text-primary" />
                    <div className={`flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-gray-600"
                    }`}>
                      {stat.change}
                      {stat.trend === "up" && <ArrowUp className="w-4 h-4" />}
                      {stat.trend === "down" && <ArrowDown className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "create" ? "bg-green-500" :
                      activity.type === "update" ? "bg-blue-500" :
                      "bg-red-500"
                    }`} />
                    <div>
                      <p className="font-medium">{activity.item}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Pages les plus visitées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors.map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-600">{page.page}</span>
                    <span className="font-medium">{page.views} vues</span>
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
