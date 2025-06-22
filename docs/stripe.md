# API・Webhook仕様書

## 1. 概要

本ドキュメントは、アプリケーションが提供するAPIエンドポイントおよび、外部サービスから受け取るWebhookの仕様について定義する。

### 1.1. 基本方針
- **認証**: クライアントからのリクエストは、Supabaseが発行したJWTを `Authorization: Bearer <TOKEN>` ヘッダーに含めることで認証する。サーバーサイドでRLSが適用される。
- **リクエスト/レスポンス形式**: JSON形式を基本とする。
- **エラーハンドリング**: HTTPステータスコードを用いて処理結果を示す。エラー時には、以下の形式で詳細を返す。
  ```json
  {
    "error": {
      "message": "エラー内容の簡潔な説明",
      "details": "（任意）技術的な詳細"
    }
  }
  ```

---

## 2. Webhook: Stripe

### `POST /api/stripe/webhook`

Stripeからのイベント通知を受け取り、ユーザーのサブスクリプション状態を更新するためのWebhookエンドポイント。

- **メソッド**: `POST`
- **認証**: Stripeからのリクエストであることを確認するため、リクエストヘッダーに含まれる `Stripe-Signature` を検証する必要がある。検証用のシークレットは環境変数 `STRIPE_WEBHOOK_SECRET` に設定する。

#### 受け取る主要なイベント

| イベントタイプ (`event.type`) | 説明 | 実行される処理 |
| :--- | :--- | :--- |
| `checkout.session.completed` | Stripe Checkoutでの支払いが正常に完了した時に送信される。 | 1. `event.data.object.client_reference_id` から `user_id` を取得する。<br>2. `event.data.object.customer` から `stripe_customer_id` を取得する。<br>3. `public.users` テーブルを更新し、`stripe_customer_id` と `subscription_status` を `'premium'` に設定する。 |
| `customer.subscription.deleted` | ユーザーがStripeの顧客ポータルでサブスクリプションをキャンセルした（期間終了を待たずに即時解約、または期間終了後に更新されなかった）時に送信される。 | 1. `event.data.object.customer` から `stripe_customer_id` を検索し、対応する `user_id` を特定する。<br>2. `public.users` テーブルを更新し、`subscription_status` を `'free'` に設定する。 |
| `customer.subscription.updated` | サブスクリプションのプラン変更や支払い状況の更新があった場合に送信される。 | （将来的なプラン多様化のためにハンドリングを考慮するが、初期実装では`deleted`イベントで十分） |

---

## 3. APIエンドポイント: Stripe

### `POST /api/stripe/create-portal-session`

認証済みユーザーが自身のサブスクリプションを管理（支払い方法の変更、キャンセルなど）するためのStripe顧客ポータルへのリダイレクトURLを生成するAPI。

- **メソッド**: `POST`
- **認証**: 必須（ログインユーザーのみが呼び出し可能）。RLSにより、`users`テーブルから自身の情報しか取得できない。

#### リクエストボディ
不要。

#### 処理フロー
1. リクエストヘッダーのJWTから `user_id` を取得する。
2. `user_id` を元に `public.users` テーブルから `stripe_customer_id` を取得する。
3. `stripe_customer_id` が存在しない場合は、エラー（HTTP 400）を返す。
4. Stripeの `billingPortal.sessions.create` APIを呼び出し、`customer` に `stripe_customer_id` を、`return_url` にアプリケーションの設定画面のURLを指定する。
5. Stripeから返された顧客ポータルセッションのURL (`session.url`) をクライアントに返す。

#### 成功レスポンス (HTTP 200)
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

#### エラーレスポンス (HTTP 400/500)
```json
{
  "error": {
    "message": "Stripeの顧客IDが見つかりません。"
  }
}
``` 