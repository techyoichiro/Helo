import { users } from '@/server/db/schema'

export interface Variables {
  user: typeof users.$inferSelect
  /** プレミアムかどうか */
  isSubscribed?: boolean
}