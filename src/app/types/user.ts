import type { User as SupabaseUser } from '@supabase/supabase-js';
import { users } from '@/server/db/schema';

// 既存の型定義
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 認証ユーザー情報とデータベースユーザー情報を統合した型
export type CombinedUser = Omit<SupabaseUser, 'id'> & User & {
    user_metadata?: {
        fullName?: string;
        avatarUrl?: string;
    };
};

// SessionUser インターフェースの修正
export interface SessionUser {
    avatarUrl?: string | null;
    fullName?: string | null;
    email?: string | null;
    providers?: string[];
}

export interface HeaderActionsClientProps {
    initialUser: SessionUser | null;
}

export interface ProfileClientProps {
    initialUser: SessionUser | null;
    count?: number;
}