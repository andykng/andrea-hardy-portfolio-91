
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentGenerator } from "@/components/admin/content/ContentGenerator";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function ContentAdminPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Générateur de contenu IA</h1>
          <p className="text-gray-500">
            Utilisez l'intelligence artificielle pour générer rapidement du contenu pour votre blog
            ou votre veille technologique
          </p>
        </div>

        <ContentGenerator />
      </div>
    </AdminLayout>
  );
}
