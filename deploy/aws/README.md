# KTL Products の EC2 配置

Amazon Linux 2023 の既存 Apache HTTPS VirtualHost に `/products/` を追加します。
Node.js 22.13 以降、npm、PostgreSQL、Apache の proxy_http が必要です。
Node アプリは 127.0.0.1:8011 で動きます。ビルドはメモリに余裕のある環境で実行できます。ビルド済みディレクトリと node_modules を移す場合は、EC2 と同じ OS・CPU アーキテクチャ・Node メジャー版を使用してください。

## 1. ファイルと DB

アーカイブを展開したディレクトリの中身を `/opt/ktl-products` に配置します。
以下の作業は EC2 の管理者アカウントで実施します。

```sh
sudo useradd --system --user-group --no-create-home --shell /sbin/nologin ktl-products
sudo chown -R ktl-products:ktl-products /opt/ktl-products
cd /opt/ktl-products
sudo -u ktl-products npm ci --cache /opt/ktl-products/.npm-cache --no-audit --no-fund
sudo -u ktl-products env NEXT_TELEMETRY_DISABLED=1 npm run build
```

既存 PostgreSQL に専用 DB・専用ロールを作ります。既に作成済みの場合は再作成不要です。
SQL ファイルは公開ディレクトリ外に置きます。

```sh
sudo -u postgres createuser --pwprompt ktl_products
sudo -u postgres createdb --owner=ktl_products ktl_products
psql -h 127.0.0.1 -U ktl_products -d ktl_products -v ON_ERROR_STOP=1 -f deploy/aws/schema.sql
```

## 2. サービス

`sudo install -m 0600 /dev/null /etc/ktl-products.env` で初回のみ設定ファイルを作成し、
`sudoedit /etc/ktl-products.env` で次を設定します。DBパスワードのURL予約文字はパーセントエンコードします。
管理者パスワードには24文字以上のランダムな値を使います。

```ini
DATABASE_URL=postgresql://ktl_products:DB_PASSWORD@127.0.0.1:5432/ktl_products
PRODUCTS_ORIGIN=https://llm-jp.com
PRODUCTS_ADMIN_PASSWORD=REPLACE_WITH_A_RANDOM_PASSWORD
```

```sh
sudo install -m 0644 deploy/aws/ktl-products.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ktl-products
curl -fsS -o /dev/null http://127.0.0.1:8011/products/
```

npm が `/usr/bin/npm` にない場合は、サービスの ExecStart と PATH を実際の配置に合わせます。
起動ログは `sudo journalctl -u ktl-products -n 50 --no-pager` で確認できます。

## 3. Apache

```sh
sudo install -m 0644 deploy/aws/apache-products.inc /etc/httpd/llmjp/
sudoedit /etc/httpd/conf.d/llmjp-web-https.conf
```

既存の `<VirtualHost *:443>` の内側で、包括的な ProxyPass があればその前に以下を1行追加します。

```apache
Include /etc/httpd/llmjp/apache-products.inc
```

```sh
sudo httpd -t && sudo systemctl reload httpd
curl -fsS -o /dev/null -w '%{http_code}\n' https://llm-jp.com/products/
curl -sS -o /dev/null -w '%{http_code}\n' https://llm-jp.com/products/admin/
```

期待値は製品ページ 200、認証なしの管理画面 401。
ブラウザで架空の申込を送り、管理画面にユーザー名 `ktl-admin` で入り、受付IDと保存内容を照合します。
フォームの利用条件と申込データの取り扱いを確認してから、見込み客に案内してください。
`/products/` は Apache をリロードした時点でアクセス可能になります。事前確認だけなら手順2まで進めます。

元に戻す場合は追加した Include だけを取り除き、`sudo httpd -t && sudo systemctl reload httpd` を実行します。
保存済み申込は PostgreSQL に残ります。
