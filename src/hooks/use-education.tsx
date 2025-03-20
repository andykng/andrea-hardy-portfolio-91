
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
      // Mock data since we're not using a real database
      const mockEducation: Education[] = [
        {
          id: '1',
          title: 'BTS SIO option SISR',
          institution: 'Lycée Le Verger',
          description: 'Services Informatiques aux Organisations - Spécialité Solutions d\'Infrastructure, Systèmes et Réseaux',
          logo_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/lycee_placeholder.jpg',
          start_date: '2022-09-01',
          end_date: '2024-06-30',
          degree: 'BTS',
          created_at: '2022-09-01',
          updated_at: '2022-09-01'
        },
        {
          id: '2',
          title: 'Baccalauréat Général',
          institution: 'Lycée Georges Brassens',
          description: 'Spécialités Mathématiques et Numérique et Sciences Informatiques',
          logo_url: null,
          start_date: '2019-09-01',
          end_date: '2022-06-30',
          degree: 'Baccalauréat',
          created_at: '2019-09-01',
          updated_at: '2019-09-01'
        }
      ];
      
      return mockEducation;
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
      // Mock data since we're not using a real database
      const mockCertifications: Certification[] = [
        {
          id: '1',
          title: 'CCNA Routing and Switching',
          issuer: 'Cisco',
          date: '2023-05-15',
          expiry_date: '2026-05-15',
          credential_url: 'https://www.credly.com/',
          logo_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/cisco_placeholder.jpg',
          created_at: '2023-05-15',
          updated_at: '2023-05-15'
        },
        {
          id: '2',
          title: 'Microsoft Certified: Azure Fundamentals',
          issuer: 'Microsoft',
          date: '2023-03-10',
          expiry_date: null,
          credential_url: 'https://www.credly.com/',
          logo_url: 'https://res.cloudinary.com/drbfimvy9/image/upload/v1742487800/microsoft_placeholder.jpg',
          created_at: '2023-03-10',
          updated_at: '2023-03-10'
        }
      ];
      
      return mockCertifications;
    }
  });
};
