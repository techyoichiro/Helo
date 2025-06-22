'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: '2文字以上で入力してください。' })
    .max(50, { message: '50文字以内で入力してください。' })
})

export async function updateProfile(data: { name: string }) {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const parsedData = profileSchema.parse(data)

  const { error } = await supabase.auth.updateUser({
    data: {
      name: parsedData.name
    }
  })

  if (error) {
    throw error
  }

  revalidatePath('/dashboard/settings')

  return { success: true }
} 