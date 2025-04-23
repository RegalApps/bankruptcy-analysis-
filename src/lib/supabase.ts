// Local-only stub that replaces Supabase
// This file provides mock implementations of Supabase functions
// to keep the app running without any external dependencies

// Import local document storage for data operations
import { localDocumentStorage } from '@/utils/documentOperations';

// Mock user for auth
const MOCK_USER = {
  id: 'local-user-123',
  email: 'local@example.com',
  user_metadata: {
    full_name: 'Local User',
    avatar_url: null
  }
};

// Create a stub Supabase client
export const supabase = {
  // Auth methods
  auth: {
    getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
    getSession: async () => ({ data: { session: { user: MOCK_USER } }, error: null }),
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: { user: MOCK_USER, session: { user: MOCK_USER } }, error: null }),
    signInWithPassword: async () => ({ data: { user: MOCK_USER, session: { user: MOCK_USER } }, error: null }),
    resend: async () => ({ error: null }),
    onAuthStateChange: (callback) => {
      // Immediately trigger with "SIGNED_IN" state
      setTimeout(() => callback('SIGNED_IN', { user: MOCK_USER }), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },

  // Database operations
  from: (table) => ({
    select: (query) => ({
      eq: (field, value) => ({
        single: async () => {
          if (table === 'documents') {
            const doc = localDocumentStorage.find(d => d.id === value);
            return { data: doc || null, error: null };
          }
          return { data: null, error: null };
        },
        maybeSingle: async () => {
          if (table === 'documents') {
            const doc = localDocumentStorage.find(d => d.id === value);
            return { data: doc || null, error: null };
          }
          return { data: null, error: null };
        },
        limit: (n) => ({
          order: () => ({
            limit: () => ({
              range: () => ({
                then: (callback) => Promise.resolve().then(() => callback({ 
                  data: table === 'documents' ? localDocumentStorage : [], 
                  error: null 
                }))
              })
            })
          })
        })
      }),
      order: () => ({
        limit: () => ({
          range: () => ({
            then: (callback) => Promise.resolve().then(() => callback({ 
              data: table === 'documents' ? localDocumentStorage : [], 
              error: null 
            }))
          })
        })
      }),
      or: () => ({
        limit: () => ({
          maybeSingle: async () => ({ data: null, error: null })
        })
      }),
      limit: () => ({
        order: () => ({
          then: (callback) => Promise.resolve().then(() => callback({ 
            data: table === 'documents' ? localDocumentStorage : [], 
            error: null 
          }))
        })
      }),
      // Handle any table with empty results but no error
      then: (callback) => Promise.resolve().then(() => callback({ 
        data: [], 
        error: null 
      })),
      // Add support for ilike method
      ilike: (field, value) => ({
        limit: (n) => ({
          then: (callback) => Promise.resolve().then(() => callback({ 
            data: [], 
            error: null 
          }))
        }),
        maybeSingle: async () => ({ data: null, error: null })
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: async () => {
          if (table === 'documents' && Array.isArray(data)) {
            localDocumentStorage.push(...data);
            return { data: data[0], error: null };
          }
          return { data: null, error: null };
        }
      }),
      // Handle direct then call on insert
      then: (callback) => Promise.resolve().then(() => callback({ 
        data: null, 
        error: null 
      }))
    }),
    update: (data) => ({
      eq: (field, value) => ({
        then: (callback) => Promise.resolve().then(() => callback({ data: null, error: null }))
      }),
      // Handle direct then call on update
      then: (callback) => Promise.resolve().then(() => callback({ 
        data: null, 
        error: null 
      }))
    }),
    delete: () => ({
      eq: (field, value) => ({
        then: (callback) => Promise.resolve().then(() => callback({ data: null, error: null }))
      })
    }),
    // Handle upsert operation
    upsert: (data) => ({
      then: (callback) => Promise.resolve().then(() => callback({ 
        data: null, 
        error: null 
      }))
    })
  }),

  // Storage operations
  storage: {
    from: (bucket) => ({
      upload: async () => ({ data: { path: 'local-storage-path' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'local-file-url' } }),
      download: async () => ({ data: null, error: null }),
      remove: async () => ({ data: null, error: null })
    }),
    listBuckets: async () => ({ data: [{ name: 'avatars' }, { name: 'documents' }], error: null }),
    createBucket: async () => ({ error: null })
  },

  // Functions
  functions: {
    invoke: async (functionName, options) => {
      console.log(`Mock function invoke: ${functionName}`, options);
      return { data: null, error: null };
    }
  },

  // Realtime subscriptions
  channel: (name) => ({
    on: () => ({
      subscribe: () => {}
    })
  })
};
