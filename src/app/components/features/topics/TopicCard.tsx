import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/app/components/common/card';
import Image from 'next/image';
import Link from 'next/link';
import { TopicCardProps } from "@/app/types/article"

const TopicCard: React.FC<TopicCardProps> = ({ name, path, logo }) => {
  return (
    <Link href={`/search/${path}?name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}`} passHref>
      <Card className="w-full px-1 py-4 hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
        <CardHeader className="flex items-center justify-center">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="block rounded-full max-w-full h-[40px] w-[40px] aspect-square"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xs font-normal w-full mt-[0.2rem] overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TopicCard;

