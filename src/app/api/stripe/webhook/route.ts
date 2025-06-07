import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  // 環境変数の存在チェック
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Supabase or Stripe env missing' }, { status: 500 });
  }

  // Stripeクライアントを関数内で初期化
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil' as any,
  });

  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;
  let body: string;

  try {
    body = await request.text();
    if (!sig || !webhookSecret) throw new Error('Webhook secret missing');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // ここでsessionのcustomer_emailやmetadataからユーザーIDを特定する
    const userId = session.metadata?.user_id;
    if (!userId) {
      console.error('user_id not found in session metadata');
      return NextResponse.json({ error: 'user_id not found' }, { status: 400 });
    }
    // Supabaseでsubscription_statusをpremiumに更新（Service Roleキー使用）
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    const { error } = await supabase
      .from('users')
      .update({ subscription_status: 'premium' })
      .eq('id', userId);
    if (error) {
      console.error('Failed to update user:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
} 