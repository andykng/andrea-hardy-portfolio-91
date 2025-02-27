
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './use-realtime-subscription';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  read_time: number | null;
  status: "draft" | "published";
  views: number | null;
  slug: string;
}

export const useBlogPosts = (options?: { 
  adminMode?: boolean, 
  limit?: number,
  category?: string
}) => {
  const { adminMode = false, limit, category } = options || {};
  
  // Active la souscription en temps réel
  useRealtimeSubscription({
    table: 'blog_posts',
    queryKeys: ['blog-posts', adminMode ? 'admin' : 'public', limit, category]
  });

  return useQuery({
    queryKey: ['blog-posts', adminMode ? 'admin' : 'public', limit, category],
    queryFn: async () => {
      console.log('Fetching blog posts with options:', options);
      
      let query = supabase
        .from('blog_posts')
        .select('*');
      
      // Filtre selon que l'on est en mode admin ou visiteur
      if (!adminMode) {
        query = query.eq('status', 'published');
      }
      
      // Filtrage par catégorie si spécifiée
      if (category) {
        query = query.eq('category', category);
      }
      
      // Tri par date de publication décroissante
      query = query.order('published_at', { ascending: false });
      
      // Limite le nombre de résultats si spécifié
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      console.log('Blog posts fetched:', data?.length);
      return data as BlogPost[];
    }
  });
};
