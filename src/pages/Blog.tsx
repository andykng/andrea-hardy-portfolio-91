
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Clock, Calendar, User } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      id: 1,
      title: "Les meilleures pratiques en cybersécurité pour 2024",
      excerpt: "Découvrez les dernières tendances et recommandations pour sécuriser votre infrastructure...",
      author: "Andrea Hardy",
      date: "15 Mars 2024",
      readTime: "5 min",
      category: "Sécurité",
      imageUrl: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Comment optimiser son infrastructure cloud",
      excerpt: "Un guide complet pour optimiser vos ressources cloud et réduire vos coûts...",
      author: "Andrea Hardy",
      date: "20 Mars 2024",
      readTime: "8 min",
      category: "Cloud",
      imageUrl: "/placeholder.svg"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-gray-600">
              Découvrez mes articles sur la cybersécurité, le cloud et l'administration système
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
