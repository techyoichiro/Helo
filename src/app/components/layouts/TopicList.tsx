"use client"

import React, { useEffect, useState } from 'react';
import TopicCard from './TopicCard';
import { createClient } from '@/app/lib/utils/supabase/client'
import { Topic, TrendProps, IconRecord } from '@/app/types/types'

const TopicList: React.FC<TrendProps> = ({ searchTerm }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      const supabase = createClient();

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

export default TopicList;

