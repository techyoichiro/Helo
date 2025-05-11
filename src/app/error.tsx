"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // エラー発生時のログなど
    console.error(error);
  }, [error]);

  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1>エラーが発生しました</h1>
      <p>{error.message}</p>
      <button onClick={reset} style={{ marginTop: 20 }}>
        再試行
      </button>
    </div>
  );
} 