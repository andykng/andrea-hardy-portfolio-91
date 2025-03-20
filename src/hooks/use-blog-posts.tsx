
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
      
      // Mock data since we're not using a real database
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Introduction à la cybersécurité',
          excerpt: 'Les bases de la cybersécurité pour les débutants',
          content: '<p>Cet article présente les concepts fondamentaux de la cybersécurité...</p>',
          author: 'Andrea Hardy',
          category: 'Cybersécurité',
          image_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/cybersecurity.jpg',
          published_at: '2023-05-15',
          created_at: '2023-05-10',
          updated_at: '2023-05-15',
          read_time: 5,
          status: 'published',
          views: 120,
          slug: 'introduction-a-la-cybersecurite'
        },
        {
          id: '2',
          title: 'Configurer un serveur Linux sécurisé',
          excerpt: 'Guide étape par étape pour sécuriser votre serveur Linux',
          content: '<p>Dans ce tutoriel, nous allons voir comment configurer un serveur Linux sécurisé...</p>',
          author: 'Andrea Hardy',
          category: 'Linux',
          image_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/linux-server.jpg',
          published_at: '2023-06-20',
          created_at: '2023-06-15',
          updated_at: '2023-06-20',
          read_time: 10,
          status: 'published',
          views: 85,
          slug: 'configurer-serveur-linux-securise'
        }
      ];

      // Filter by category if specified
      let filteredPosts = [...mockPosts];
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      // Filter by status if not admin
      if (!adminMode) {
        filteredPosts = filteredPosts.filter(post => post.status === 'published');
      }
      
      // Limit results if specified
      if (limit && limit > 0) {
        filteredPosts = filteredPosts.slice(0, limit);
      }
      
      console.log('Blog posts fetched:', filteredPosts.length);
      return filteredPosts;
    }
  });
};
