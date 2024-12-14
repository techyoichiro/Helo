"use client"

import React, { useState } from 'react';
import TopicList from '@/app/components/layouts/TopicList';
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';

function Page() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ContentWrapper>
      <div className="flex min-h-screen flex-col pt-12">
        {/* 検索ボックス */}
        <input
          type="text"
          placeholder="タグで検索"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        {/* Trend コンポーネントに searchTerm を渡す */}
        <TopicList searchTerm={searchTerm} />
      </div>
    </ContentWrapper>
  );
}

export default Page;
