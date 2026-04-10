import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Check your .env file.');
  }
  supabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
  // Create a dummy client to prevent export errors, though calls will fail
  supabaseClient = {
    auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) })
  } as any;
}

export const supabase = supabaseClient;

// Generic types to match the Firestore structure for easier refactor
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          uid: string;
          email: string;
          name: string;
          role: 'student' | 'landlord' | 'admin';
          phone?: string;
          bio?: string;
          university?: string;
          address?: string;
          photoURL?: string;
          created_at: string;
        };
        Insert: {
          uid: string;
          email: string;
          name: string;
          role: 'student' | 'landlord' | 'admin';
          phone?: string;
          bio?: string;
          university?: string;
          address?: string;
          photoURL?: string;
        };
      };
      hostels: {
        Row: {
          id: string;
          name: string;
          location: string;
          university: string;
          price: number;
          image: string;
          amenities: string[];
          description: string;
          landlordId: string;
          landlordName: string;
          verified: boolean;
          rating: number;
          reviewsCount: number;
          created_at: string;
        };
      };
      // ... more tables will be defined as needed
    };
  };
};

// Error handling helper similar to the Firebase one
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleSupabaseError(error: any, operationType: OperationType, path: string | null) {
  console.error(`Supabase Error [${operationType}] at [${path}]:`, error);
  throw new Error(error.message || 'Supabase operation failed');
}
