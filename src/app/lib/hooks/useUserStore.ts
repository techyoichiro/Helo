import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client'
import { CombinedUser } from '@/app/types/types';

const supabase = createSupabaseClient();

interface UserStore {
  user: CombinedUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  setUser: (user: CombinedUser | null) => void;
  setSession: (session: Session | null) => void;
  fetchUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error: authError } = await supabase.auth.getSession();

      if (authError) throw authError;

      const authUser = data?.session?.user || null;
      const session = data?.session || null;

      if (authUser && session) {
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (dbError) throw dbError;

        if (dbUser) {
          const combinedUser: CombinedUser = {
            ...authUser,
            ...dbUser,
            user_metadata: {
              ...authUser.user_metadata,
              fullName: authUser.user_metadata?.full_name || dbUser.fullName,
              avatarUrl: authUser.user_metadata?.avatar_url || dbUser.avatarUrl,
            },
            createdAt: new Date(dbUser.createdAt),
            updatedAt: new Date(dbUser.updatedAt),
          };
          set({ user: combinedUser, session, loading: false });
        } else {
          throw new Error('User not found in database');
        }
      } else {
        set({ user: null, session: null, loading: false });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({
        user: null,
        session: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (error) {
      console.error("Error logging out:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  },
}));
