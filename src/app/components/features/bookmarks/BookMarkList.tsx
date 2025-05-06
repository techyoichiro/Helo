'use server'

import { fetchFolders } from '@/app/lib/api/bookmark'
import BookmarkListClient from '@/app/components/features/bookmarks/BookmarkListClient'
import { BookmarkDTO, SessionProp } from '@/app/types/bookmark'

interface Props {
  items: BookmarkDTO[]
  session: SessionProp
}

export default async function BookmarkList({ items, session }: Props) {
  return (
    <BookmarkListClient
      initialItems={items}
      session={session}
    />
  )
}
