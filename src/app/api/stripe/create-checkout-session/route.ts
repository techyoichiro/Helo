import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/lib/supabase/server';

export async function POST(request: Request) {
  // 環境変数の存在チェック
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Supabase or Stripe env missing' }, { status: 500 });
  }

  // Stripeクライアントを関数内で初期化
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil' as any,
  });

  try {
    // POST bodyからreturnToを取得
    const { returnTo } = await request.json();
    // Supabase認証ユーザー取得
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Checkoutセッション作成
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/success?returnTo=${encodeURIComponent(returnTo || '/')}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancel?returnTo=${encodeURIComponent(returnTo || '/')}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'テスト商品',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
      },
    });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Stripeセッション作成に失敗しました' }, { status: 500 });
  }
} 