
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './use-realtime-subscription';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  technologies: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = (options?: { 
  adminMode?: boolean, 
  limit?: number
}) => {
  const { adminMode = false, limit } = options || {};
  
  // Active la souscription en temps réel
  useRealtimeSubscription({
    table: 'projects',
    queryKeys: ['projects', adminMode ? 'admin' : 'public', limit]
  });

  return useQuery({
    queryKey: ['projects', adminMode ? 'admin' : 'public', limit],
    queryFn: async () => {
      // Mock data since we're not using a real database
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Portfolio personnel',
          description: 'Mon portfolio personnel développé avec React et Tailwind CSS',
          image_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/portfolio_placeholder.jpg',
          technologies: ['React', 'TypeScript', 'Tailwind CSS'],
          github_url: 'https://github.com/example/portfolio',
          demo_url: 'https://example.com',
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        },
        {
          id: '2',
          title: 'Application de gestion',
          description: 'Une application de gestion pour petites entreprises',
          image_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/app_placeholder.jpg',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
          github_url: 'https://github.com/example/management-app',
          demo_url: null,
          created_at: '2022-12-01',
          updated_at: '2022-12-01'
        }
      ];
      
      return mockProjects;
    }
  });
};
