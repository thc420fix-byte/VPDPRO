# VPD PRO - Grow Environment Monitor

シングルHTMLファイルで動作するグロウ環境モニタリングアプリ。

---

## ファイル構成

| ファイル | 説明 |
|---|---|
| `index.html` | アプリ本体（これ1つで完結） |
| `VPD_PRO.zip` | index.html の圧縮バックアップ |

---

## 主な機能

### Monitor タブ
- ステージ管理（Clone / Veg / Flower Early / Flower Late / Flush / Dry）
- スタート日付の記録と経過日数・週数の自動計算
- Temp / Humidity / PPFD の入力と目標範囲表示
- Air VPD / Leaf VPD のリアルタイム計算
- Light ON / Light OFF / Leaf VPD / CO₂ モード切り替え
- VPD 高すぎ・低すぎ警告と調整アドバイス

### Feeding タブ
- 肥料名・水量・添加量・希釈率の記録
- pH / Input EC / Runoff EC の入力
- ステージ別の EC・pH 目標値表示

### Analysis タブ
- 給水履歴のグラフ表示

### Reference タブ
- ステージ別の環境目安表（°C / %RH / kPa / μmol / EC / pH）
- VPD Reference Chart（温度×湿度マトリクス）
- 土壌 / CO₂ 表示切り替え

---

## 使い方

1. `index.html` をブラウザで開く
2. テントを追加（`+` ボタン）
3. Monitor タブでステージを選択し、スタート日付を設定
4. 各値を入力して VPD を確認

> データは IndexedDB に自動保存されます（ブラウザのストレージ）。

---

## 動作環境

- モダンブラウザ（Chrome / Safari / Firefox）
- サーバー不要・オフライン動作可能
