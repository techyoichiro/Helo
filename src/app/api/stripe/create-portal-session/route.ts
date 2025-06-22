import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/lib/supabase/server';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe secret key not set' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil' as any,
  });

  try {
    const { returnTo } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabaseのusersテーブルからstripe_customer_idを取得
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
        console.error('Profile not found:', profileError);
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    let customerId = profile.stripe_customer_id;

    // customerIdがない場合は、Stripeで顧客を作成し、DBに保存する
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { user_id: user.id }
        });
        customerId = customer.id;

        await supabase
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }
    
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}${returnTo || '/'}`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
} 