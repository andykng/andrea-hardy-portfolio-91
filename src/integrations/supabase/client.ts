
// Supabase client placeholder
// This file is kept for compatibility but does not connect to any database

export const supabase = {
  auth: {
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ error: null }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
};
