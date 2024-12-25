import { Context, Next } from 'hono'
import { createClient } from '@/app/lib/utils/supabase/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader) {
    return c.json({ error: 'Unauthorized: Missing token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return c.json({ error: 'Unauthorized: Invalid token format' }, 401)
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error) {
      console.error('Error verifying token:', error)
      return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id))
    if (!dbUser) {
      return c.json({ error: 'User not found in database' }, 404)
    }

    c.set('user', dbUser)
    await next()
  } catch (error) {
    console.error('Unexpected error in authMiddleware:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function subscriptionMiddleware(c: Context, next: Next) {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const isSubscribed = user.subscriptionStatus === 'active'
  c.set('isSubscribed', isSubscribed)
  await next()
}

