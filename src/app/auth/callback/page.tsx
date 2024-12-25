import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    try {
      await supabase.auth.exchangeCodeForSession(code)
      return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
      console.error('Error:', error)
      return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}

