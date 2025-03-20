
import { useEffect } from 'react';

// This is a mock implementation since we're not using Supabase realtime
export const useRealtimeSubscription = (options: { 
  table: string;
  queryKeys: any[];
}) => {
  useEffect(() => {
    // No-op since we don't have real-time functionality without DB
    return () => {};
  }, [options.table, JSON.stringify(options.queryKeys)]);
};
