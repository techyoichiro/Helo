"use client"

import React, { useEffect, useState } from 'react';
import TopicCard from './TopicCard';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client'

interface TrendProps {
  searchTerm: string;
}

interface Topic {
  name: string;
  path: string;
  logoUrl: string;
}

// データベースの型定義
interface IconRecord {
  name: string;
  path: string;
  url: string;
}

const Trend: React.FC<TrendProps> = ({ searchTerm }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from('topics')
        .select('name, path, url');

      if (error) {
        console.error("Error fetching topics:", error);
        setLoading(false);
        return;
      }

      // データベースの型からTopicの型に変換
      const formattedTopics: Topic[] = (data as unknown as IconRecord[])?.map(icon => ({
        name: icon.name,
        path: icon.path,
        logoUrl: icon.url
      })) || [];

      setTopics(formattedTopics);
      setLoading(false);
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 items-center">Trend</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:gap-6">
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.path} path={topic.path} name={topic.name} logo={topic.logoUrl} />
        ))}
      </div>
    </>
  );
};

export default Trend;