'use client';

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/common/avatar";
import { LucideUser } from 'lucide-react';
import { HeaderActionsClientProps } from '@/app/types/user';
import { Badge } from "@/app/components/common/badge";

export function ProfileClient({ initialUser }: HeaderActionsClientProps) {
    const [user] = useState(initialUser?.user || null);

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.fullName;
    const providers = initialUser?.providers || [];

    return (
        <div className="flex flex-col items-start p-4">
            <div className="flex items-center">
                <Avatar className="h-16 w-16">
                    {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="プロフィール" />
                    ) : (
                        <AvatarFallback>
                            <LucideUser className="h-8 w-8" />
                        </AvatarFallback>
                    )}
                </Avatar>
                {fullName && (
                    <span className="ml-4 text-xl font-semibold">
                        {fullName}
                    </span>
                )}
            </div>
            {providers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">連携済み:</span>
                    {providers.map(provider => (
                        <Badge key={provider} provider={provider} />
                    ))}
                </div>
            )}
        </div>
    );
}
