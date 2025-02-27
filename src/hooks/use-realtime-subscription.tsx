
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type RealtimeConfig = {
  table: string;
  queryKeys: (string | number | undefined)[];
  enabled?: boolean;
  events?: Array<'INSERT' | 'UPDATE' | 'DELETE'>;
};

export const useRealtimeSubscription = ({ 
  table, 
  queryKeys, 
  enabled = true,
  events = ['INSERT', 'UPDATE', 'DELETE']
}: RealtimeConfig) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Filtrage des clés non définies
    const filteredKeys = queryKeys.filter(key => key !== undefined) as string[];
    
    console.log(`[Realtime] Setting up subscription for ${table} with keys:`, filteredKeys);

    const channel = supabase
      .channel(`${table}-changes-${filteredKeys.join('-')}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table 
        },
        (payload) => {
          console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);
          
          // Entraîner une revalidation pour toutes les clés de requête concernées
          filteredKeys.forEach(key => {
            if (key) {
              queryClient.invalidateQueries({ queryKey: [key] });
            }
          });
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status for ${table}:`, status);
      });

    return () => {
      console.log(`[Realtime] Unsubscribing from ${table}`);
      supabase.removeChannel(channel);
    };
  }, [queryClient, table, JSON.stringify(queryKeys), enabled]);
};
