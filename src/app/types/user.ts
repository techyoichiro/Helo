import type { User as SupabaseUser } from '@supabase/supabase-js';
import { users } from '@/server/db/schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 認証ユーザー情報とデータベースユーザー情報を統合した型
export type CombinedUser = Omit<SupabaseUser, 'id'> & User & {
    user_metadata?: {
        fullName?: string;
        avatarUrl?: string;
    };
};


export interface SessionUser {
    user: any
    avatarUrl?: string
    fullName?: string
    email?: string
}

export interface HeaderActionsClientProps {
    initialUser: SessionUser | null
}