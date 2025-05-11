"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopicList from '@/app/components/features/topics/TopicList';
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';
import { Input } from '@/app/components/common/input';

function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <ContentWrapper>
      <div className="flex min-h-screen flex-col pt-12">
        {/* 検索ボックス */}
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="タグで検索"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-6 w-full px-4 py-2 border-gray-300 rounded-md focus:border-orange-300"
          />
        </form>

        {/* Topic リスト */}
        <TopicList searchTerm={searchTerm} />
      </div>
    </ContentWrapper>
  );
}

export default Page;
