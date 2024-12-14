import { Context, Next } from 'hono'
import { createSupabaseClient } from '@/app/lib/utils/supabase/client'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

const supabase = createSupabaseClient();

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader) {
    console.log('Authorization header is missing')
    return c.json({ error: 'Unauthorized: Missing token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    console.log('Token is missing from Authorization header')
    return c.json({ error: 'Unauthorized: Invalid token format' }, 401)
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error) {
      console.error('Error verifying token:', error)
      return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }

    if (!user) {
      console.log('User not found for the given token')
      return c.json({ error: 'User not found' }, 404)
    }

    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id))
    if (!dbUser) {
      console.log(`User not found in database for id: ${user.id}`)
      return c.json({ error: 'User not found in database' }, 404)
    }

    c.set('user', dbUser)
    console.log(`User authenticated: ${user.id}`)
    await next()
  } catch (error) {
    console.error('Unexpected error in authMiddleware:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function subscriptionMiddleware(c: Context, next: Next) {
  const user = c.get('user')
  if (!user) {
    console.log('User not found in subscription middleware')
    return c.json({ error: 'User not found' }, 404)
  }

  const isSubscribed = user.subscriptionStatus === 'active'
  c.set('isSubscribed', isSubscribed)
  console.log(`User subscription status: ${isSubscribed ? 'Active' : 'Inactive'}`)
  await next()
}

