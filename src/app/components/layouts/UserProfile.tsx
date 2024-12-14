'use client'

import { User } from '@/app/types/types';

interface UserProfileProps {
  user: User | null | undefined;
}

export default function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return <div>ユーザーが見つかりません。</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <img src={user.avatarUrl} alt={`${user.fullName}のアバター`} />
      <p>ニックネーム: {user.nickname || 'なし'}</p>
      <p>サブスクリプション: {user.subscriptionStatus === 'premium' ? 'プレミアム' : '無料'}</p>
      <p>登録日: {user.createdAt.toLocaleDateString()}</p>
    </div>
  );
}
