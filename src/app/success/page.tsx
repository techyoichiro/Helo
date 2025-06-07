'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(returnTo);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, returnTo]);

  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1>決済が完了しました！</h1>
      <p>ご利用ありがとうございます。Premium特典が有効になりました。</p>
      <p>3秒後に元の画面に戻ります。</p>
      <a href={returnTo}>元の画面に戻る</a>
    </main>
  );
} 