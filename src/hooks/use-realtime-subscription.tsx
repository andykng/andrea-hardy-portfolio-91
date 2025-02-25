
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type RealtimeConfig = {
  table: string;
  queryKeys: string[];
  enabled?: boolean;
};

export const useRealtimeSubscription = ({ table, queryKeys, enabled = true }: RealtimeConfig) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, table, queryKeys, enabled]);
};
