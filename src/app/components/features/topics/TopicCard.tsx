import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/app/components/common/card';
import Image from 'next/image';
import Link from 'next/link';
import { TopicCardProps } from "@/app/types/article"
import { usePathname, useRouter } from 'next/navigation';

const TopicCard: React.FC<TopicCardProps> = ({ name, path, logo }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === `/search/${path}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/search/${path}?name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}`);
  };

  return (
    <Link 
      href={`/search/${path}?name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}`} 
      passHref
      onClick={handleClick}
    >
      <Card 
        className={`
          w-full px-1 py-4 
          transition-all duration-200 ease-in-out
          cursor-pointer
          ${isActive 
            ? 'bg-orange-50 border-orange-200 shadow-md scale-[1.02]' 
            : 'hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01]'
          }
          focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
        `}
      >
        <CardHeader className="flex items-center justify-center">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={40}
            height={40}
            className={`
              block rounded-full max-w-full h-[40px] w-[40px] aspect-square
              transition-transform duration-200
              ${isActive ? 'scale-110' : 'group-hover:scale-105'}
            `}
          />
        </CardHeader>
        <CardContent>
          <CardTitle 
            className={`
              text-xs font-normal w-full mt-[0.2rem] overflow-hidden text-ellipsis whitespace-nowrap
              transition-colors duration-200
              ${isActive ? 'text-orange-600' : 'text-gray-700'}
            `}
          >
            {name}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TopicCard;

