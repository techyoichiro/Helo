import type { Provider } from '@supabase/supabase-js';
import { subscriptionStatusEnum } from '@/server/db/schema';

export type Props = {
    title: string;
    path?: string;
    description?: string;
    ogImageUrl?: string;
    noindex?: boolean;
    removeSiteNameFromTitle?: boolean;
};

export interface ErrorResponse {
    error: string;
}

export type ApiResponse<T> = {
    data?: T;
    error?: string;
};

// サブスクリプション状態の型
export type SubscriptionStatus = typeof subscriptionStatusEnum.enumValues[number];

export interface LoginButtonProps {
    provider: Provider;
    icon: React.ReactNode;
    text: string;
    onClick: () => Promise<void>;
    isLoading: boolean;
}

export interface LoginDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onLoginSuccess: () => void
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    items: {
      href: string
      title: string
      icon: React.ReactNode
    }[]
}