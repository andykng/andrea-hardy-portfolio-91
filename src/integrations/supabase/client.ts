
// Supabase client placeholder
// This file is kept for compatibility but does not connect to any database

export const supabase = {
  auth: {
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, options: { ascending: boolean } = { ascending: false }) => 
        Promise.resolve({ data: [], error: null }),
      eq: (column: string, value: any) => 
        Promise.resolve({ data: [], error: null }),
      limit: (num: number) =>
        Promise.resolve({ data: [], error: null }),
      single: () =>
        Promise.resolve({ data: null, error: null })
    }),
    insert: (data: any) => Promise.resolve({ error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    }),
    upsert: (data: any, options: any = {}) => Promise.resolve({ error: null })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any) => Promise.resolve({ error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } })
    })
  },
  // Mock the channel functionality
  channel: (name: string) => ({
    on: () => ({
      subscribe: () => ({})
    })
  }),
  removeChannel: () => Promise.resolve(),
  // Mock functions property
  functions: {
    invoke: (name: string, options: any = {}) => Promise.resolve({ data: null, error: null })
  }
};
