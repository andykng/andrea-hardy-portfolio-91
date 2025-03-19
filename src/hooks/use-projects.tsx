
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
  pdf_url: string | null;
  pdf_folder: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = (options?: { 
  adminMode?: boolean, 
  limit?: number,
  folder?: string
}) => {
  const { adminMode = false, limit, folder } = options || {};
  
  // Active la souscription en temps réel
  useRealtimeSubscription({
    table: 'projects',
    queryKeys: ['projects', adminMode ? 'admin' : 'public', limit, folder]
  });

  return useQuery({
    queryKey: ['projects', adminMode ? 'admin' : 'public', limit, folder],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filtrer par dossier si nécessaire
      if (folder) {
        query = query.eq('pdf_folder', folder);
      }
      
      // Limiter le nombre de résultats si nécessaire
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      return data as Project[];
    }
  });
};
