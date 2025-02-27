
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './use-realtime-subscription';

export interface Education {
  id: string;
  title: string;
  institution: string;
  description: string | null;
  logo_url: string | null;
  start_date: string;
  end_date: string | null;
  degree: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useEducation = (options?: { adminMode?: boolean }) => {
  const { adminMode = false } = options || {};
  
  // Active la souscription en temps réel
  useRealtimeSubscription({
    table: 'education',
    queryKeys: ['education', adminMode ? 'admin' : 'public']
  });

  return useQuery({
    queryKey: ['education', adminMode ? 'admin' : 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching education:', error);
        throw error;
      }
      
      return data as Education[];
    }
  });
};

export const useCertifications = (options?: { adminMode?: boolean }) => {
  const { adminMode = false } = options || {};
  
  // Active la souscription en temps réel
  useRealtimeSubscription({
    table: 'certifications',
    queryKeys: ['certifications', adminMode ? 'admin' : 'public']
  });

  return useQuery({
    queryKey: ['certifications', adminMode ? 'admin' : 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching certifications:', error);
        throw error;
      }
      
      return data as Certification[];
    }
  });
};
