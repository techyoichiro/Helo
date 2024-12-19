"use client"

import React, { useState } from 'react';
import TopicList from '@/app/components/layouts/TopicList';
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';
import { Input } from '@/app/components/elements/ui/input';

function Page() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ContentWrapper>
      <div className="flex min-h-screen flex-col pt-12">
        {/* 検索ボックス */}
        <Input
          type="text"
          placeholder="タグで検索"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-6 w-full px-4 py-2 border-gray-300 rounded-md focus:border-orange-300"
        />
        {/* Trend コンポーネントに searchTerm を渡す */}
        <TopicList searchTerm={searchTerm} />
      </div>
    </ContentWrapper>
  );
}

export default Page;
