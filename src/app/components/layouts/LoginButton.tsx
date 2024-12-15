import { Button } from "@/app/components/elements/ui/button";
import { Provider } from '@supabase/supabase-js';

interface LoginButtonProps {
    provider: Provider;
    icon: React.ReactNode;
    text: string;
    onClick: () => Promise<void>;
    isLoading: boolean;
}
  
export const LoginButton: React.FC<LoginButtonProps> = ({ provider, icon, text, onClick, isLoading }) => (
<Button
    variant="outline"
    disabled={isLoading}
    onClick={onClick}
    className="rounded-full py-6 flex items-center justify-center hover:bg-gray-100 border font-semibold w-[260px]"
>
    {isLoading ? (
    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
    ) : (
    <>
        {icon}
        {text}
    </>
    )}
</Button>
);
  