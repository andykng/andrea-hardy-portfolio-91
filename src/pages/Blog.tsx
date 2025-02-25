
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Clock, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
  read_time: number;
  status: "draft" | "published";
}

export default function BlogPage() {
  useRealtimeSubscription({
    table: 'blog_posts',
    queryKeys: ['blog-posts']
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <motion.div 
            className="text-center space-y-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez mes articles sur le développement web, la cybersécurité et les dernières technologies
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    {post.image_url ? (
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/5 to-muted relative">
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow">
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt || post.content}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author || "Admin"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time} min
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {posts?.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BookText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">Aucun article pour le moment</h3>
              <p className="text-muted-foreground mt-2">
                Les articles seront bientôt disponibles.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
