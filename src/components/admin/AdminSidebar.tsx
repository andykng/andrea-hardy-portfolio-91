
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  Cpu, 
  FolderKanban,
  GraduationCap,
  Settings,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const AdminSidebar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
    { icon: Briefcase, label: "Expériences", path: "/admin/experiences" },
    { icon: Cpu, label: "Compétences", path: "/admin/skills" },
    { icon: FolderKanban, label: "Projets", path: "/admin/projects" },
    { icon: GraduationCap, label: "Formation", path: "/admin/education" },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  ];

  return (
    <aside className="w-full md:w-64 space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Administration</h2>
          <p className="text-sm text-gray-500">Gérez votre contenu</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Se déconnecter
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-2">
          <h3 className="font-medium">Statistiques rapides</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Projets</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Compétences</p>
              <p className="text-2xl font-bold text-primary">24</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
