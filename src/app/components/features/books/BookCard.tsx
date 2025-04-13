"use client";

import React from "react";
import Image from "next/image";

type Book = {
  id: number;
  title: string;
  coverImageUrl: string;
  tags: string[];
  amazonLink: string;
};

export default function BookCard({ book }: { book: Book }) {
  const { title, coverImageUrl, tags, amazonLink } = book;

  return (
    // カード全体をアンカーリンクでラップ
    <a
      href={amazonLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-4 w-full md:w-[calc(50%-0.5rem)] border border-gray-300 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex items-stretch">
        <div className="flex-1 p-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-gray-600 text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* タイトル */}
          <h2 className="text-base font-medium mb-2 line-clamp-3">{title}</h2>
        </div>

        {/* 表紙画像 */}
        {coverImageUrl && (
          <div className="relative w-36 h-36 sm:w-40 sm:h-40">
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </a>
  );
}
