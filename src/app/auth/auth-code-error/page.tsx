export default function AuthCodeError() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>認証エラー</h1>
      <p>認証中に問題が発生しました。再度お試しください。</p>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        ホームに戻る
      </a>
    </div>
  );
}