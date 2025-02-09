import React from 'react';
import { FaGoogle, FaGithub, FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';

interface BadgeProps {
    provider: string;
}

export const Badge: React.FC<BadgeProps> = ({ provider }) => {
    const getProviderIcon = (providerName: string) => {
        switch (providerName) {
            case 'google':
                return <FaGoogle className="h-4 w-4 mr-1" />;
            case 'github':
                return <FaGithub className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    const getProviderColor = (providerName: string) => {
        switch (providerName) {
            case 'google':
                return 'bg-orange-100 text-orange-700';
            case 'github':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <span className={`flex px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(provider)}`}>
            {getProviderIcon(provider)}
            {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </span>
    );
};
