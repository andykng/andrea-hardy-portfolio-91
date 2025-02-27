
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Clock, Calendar, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogPosts, BlogPost } from "@/hooks/use-blog-posts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: posts, isLoading } = useBlogPosts({ category: selectedCategory || undefined });
  
  // Extraire les catégories uniques des articles
  const categories = [...new Set((posts || []).map(post => post.category))].filter(Boolean) as string[];

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

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

          {/* Filtrage par catégorie */}
          {categories.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(null)}
                className="rounded-full"
              >
                Tous
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category)}
                  className="rounded-full"
                >
                  <Tag className="w-3 h-3 mr-2" />
                  {category}
                </Button>
              ))}
            </motion.div>
          )}

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
                        {post.category && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="backdrop-blur-sm">
                              {post.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/5 to-muted relative">
                        {post.category && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="backdrop-blur-sm">
                              {post.category}
                            </Badge>
                          </div>
                        )}
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
                          {post.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.read_time} min
                            </span>
                          )}
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
                {selectedCategory 
                  ? `Aucun article trouvé dans la catégorie "${selectedCategory}".`
                  : "Les articles seront bientôt disponibles."
                }
              </p>
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedCategory(null)}
                >
                  Voir tous les articles
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
