# サブスクリプション機能（Premium）要件・タスク分析

## サービス概要
- 技術ブログをブックマーク管理するサービス
- ブックマークはフォルダ分け可能

## サブスクリプションによる機能分岐
- フォルダ作成数に上限あり（無料ユーザー）
- Premiumサブスクリプションでフォルダ上限解除

## UI/UX要件
### 1. Premium未加入ユーザー
- 設定画面（/dashboard/settings など）に「Premiumにアップグレード」ボタンを表示
- ボタン押下でモーダル表示
  - モーダルは左右2分割
    - 左側：Premiumでできることリスト（イラスト付き、例：フォルダ無制限、優先サポート等）
    - 右側：Stripe決済ボタン
- モーダルは閉じることができる

### 2. Premium加入ユーザー
- 設定画面に「Premium」バッジや特典説明を表示
- アップグレードボタンは非表示

## 必要な実装タスク
1. サブスクリプション状態（premium or not）の判定ロジック
2. 設定画面にPremiumアップグレードボタンの表示制御
3. モーダルUIの新規実装
   - 左：できることリスト＋イラスト
   - 右：Stripe決済ボタン
4. Stripe Checkout連携（決済成功時にpremiumフラグを付与）
5. 決済完了・キャンセル時の画面（/success, /cancel）
6. Premium状態の永続化（DB or Supabaseユーザー属性）
7. UX観点
   - アップグレードのメリットが直感的に伝わる説明・イラスト
   - 決済前後のフィードバック（ローディング、成功/失敗メッセージ）
   - モーダルの閉じやすさ、誤操作防止

## 補足
- Stripe決済はモーダル右側に埋め込み or Checkoutリダイレクト型どちらも可
- イラストはSVGやアイコンで仮実装もOK
- サブスクリプション状態はサーバーサイドで検証し、フロントに反映

---

この内容をもとに、各パーツ・API・UIコンポーネントの設計・実装を進めていく。 