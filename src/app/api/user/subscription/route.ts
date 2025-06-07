import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // DBからsubscription_statusを取得
  const { data: dbUser, error: dbErr } = await supabase
    .from('users')
    .select('id, subscription_status')
    .eq('id', user.id)
    .single();
  if (dbErr || !dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ isSubscribed: dbUser.subscription_status === 'premium' });
} 