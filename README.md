# GoodNotes Viewer

VS Code でGoodNotesのPDFノートを閲覧するための拡張機能です。

## 特徴

- サイドバーからGoodNotesのバックアップPDFをツリー表示
- PDFをクリックしてVS Code内でプレビュー
- ファイル監視による自動更新（PDFが更新されると自動でリフレッシュ）
- Google認証不要（ローカルフォルダを直接参照）

## 前提条件

1. **GoodNotes**の自動バックアップをGoogle Driveに設定していること
2. **Google Drive for Desktop**をインストールし、バックアップフォルダを同期していること

### GoodNotesの自動バックアップ設定

1. iPadでGoodNotesアプリを開く
2. 設定（歯車アイコン）→「自動バックアップ」
3. 「Google Drive」を選択してログイン
4. バックアップ形式を「PDF」に設定
5. バックアップ先フォルダを確認（デフォルトは「GoodNotes」フォルダ）

### Google Drive for Desktopのインストール

1. [Google Drive for Desktop](https://www.google.com/drive/download/)をダウンロード
2. インストールしてGoogleアカウントでログイン
3. 同期モードは「ストリーミング」（デフォルト）でOK
   - ストリーミングモードなら、ローカルの容量をほとんど消費しません

## インストール

### VSIXファイルからインストール

1. VS Codeを開く
2. `Cmd+Shift+P`（Windows: `Ctrl+Shift+P`）でコマンドパレットを開く
3. 「Extensions: Install from VSIX...」を選択
4. `goodnotes-viewer-x.x.x.vsix`ファイルを選択

## 使い方

### Step 1: 拡張機能を開く

VS Codeのサイドバー（左端）に「GoodNotes」アイコン（ノートブック型）が表示されます。
クリックしてGoodNotesパネルを開きます。

### Step 2: フォルダを設定

1. 「フォルダを設定」をクリック
2. フォルダ選択ダイアログが開く
3. Google Drive for Desktopの同期フォルダ内にあるGoodNotesバックアップフォルダを選択

#### フォルダの場所（参考）

| OS | 一般的なパス |
|----|------------|
| macOS | `~/Library/CloudStorage/GoogleDrive-<メール>/My Drive/GoodNotes` |
| Windows | `G:\My Drive\GoodNotes` または `C:\Users\<名前>\Google Drive\GoodNotes` |

※ GoodNotesの自動バックアップ設定によってフォルダ名は異なる場合があります

### Step 3: PDFを閲覧

1. ツリーにフォルダとPDFファイルが表示される
2. フォルダをクリックして展開
3. PDFファイルをクリックするとVS Code内でプレビュー表示

### Step 4: 自動更新を活用

- GoodNotesでノートを編集すると、自動バックアップ → クラウド同期 → ローカル同期
- 数分以内にVS Code側のツリーも自動更新されます
- 手動でツリーを更新したい場合は、ツリー上部（「NOTES」の右側）のリフレッシュボタンをクリック

## コマンド一覧

コマンドパレット（`Cmd+Shift+P` / `Ctrl+Shift+P`）から実行できます。

| コマンド | 説明 |
|---------|------|
| `GoodNotes: Set Folder` | バックアップフォルダを設定 |
| `GoodNotes: Refresh` | ツリーを手動更新 |
| `GoodNotes: Clear Settings` | 設定をクリア（フォルダ設定をリセット） |

## 右クリックメニュー

ツリー内のPDFファイルを右クリックすると、以下の操作ができます。

| メニュー | 説明 |
|---------|------|
| ファイルをコピー | PDFファイル自体をクリップボードにコピー（Finder等に貼り付け可能） |
| パスをコピー | ファイルのフルパスをクリップボードにコピー |
| 名前を付けて保存... | PDFを別の場所に保存 |

## 同期の仕組み

```
iPad (GoodNotes)
    ↓ 自動バックアップ（PDF形式）
Google Drive (クラウド)
    ↓ Google Drive for Desktop（自動同期）
ローカルPC
    ↓ この拡張機能
VS Code で閲覧
```

## トラブルシューティング

### PDFが表示されない

- VS CodeにPDF表示機能がない場合は、[vscode-pdf](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)などの拡張機能をインストールしてください

### ツリーが更新されない

- 「GoodNotes: Refresh」コマンドで手動更新を試してください
- Google Drive for Desktopの同期が完了しているか確認してください

### フォルダが見つからない

- Google Drive for Desktopがインストールされ、同期が有効になっているか確認してください
- 「GoodNotes: Set Folder」で正しいフォルダを再設定してください

## 作者

**asterisk3157** - [GitHub](https://github.com/asterisk3157)

## ライセンス

MIT License
