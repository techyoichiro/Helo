import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export function useSubscription() {
  const user = useUser()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (user) {
      // サーバーからサブスクリプション状態を取得
      fetch('/api/user/subscription')
        .then(res => res.json())
        .then(data => setIsSubscribed(data.isSubscribed))
    }
  }, [user])

  return isSubscribed
}

