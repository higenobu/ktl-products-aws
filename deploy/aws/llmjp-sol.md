# llmjp-sol.com の切り替え

新EC2上でKTL Productsを配信します。トップページは同じドメインの
`/products/` に転送します。管理画面は `/products/admin/` です。

1. 新EC2に固定の公開IPを割り当て、HTTPSのTCP 443とHTTPのTCP 80を許可します。TCP 8011は旧Apacheからだけ許可したままにします。
2. 新EC2のApacheに `httpd` と `mod_ssl` を用意します。DNS切り替え前にDNS認証で `llmjp-sol.com` の証明書を取得し、更新方法も確認します。
3. アプリを更新して再ビルドし、ビルド成果物を配置します。新EC2の `/etc/ktl-products.env` に次の値を設定し、アプリを再起動します。既存のDB設定と管理者パスワードは引き継ぎます。

   ```ini
   PRODUCTS_ORIGIN=https://llm-jp.com,https://llmjp-sol.com
   ```

4. `apache-llmjp-sol.conf.example` を新EC2の `/etc/httpd/conf.d/llmjp-sol.conf` に配置します。証明書のパスを確認し、PRIVATE_IP をNext.jsが待ち受けるプライベートIPに置き換えます。`sudo httpd -t` が成功したらApacheを起動または再読み込みします。
5. 手元のPCから、DNS切り替え前に接続先だけを新EC2へ指定してテストします。

   ```sh
   curl -sSI --resolve llmjp-sol.com:443:NEW_PUBLIC_IP https://llmjp-sol.com/
   curl -fsS --resolve llmjp-sol.com:443:NEW_PUBLIC_IP -o /dev/null -w '%{http_code}\n' https://llmjp-sol.com/products/
   ```

   トップページは `302` と同じドメインの `/products/`、製品ページは `200` を期待します。
6. DNSで `llmjp-sol.com` のAレコードを新EC2の固定公開IPに変更します。旧Webサーバーを指すAAAAレコードがある場合は合わせて整理します。メールのMX・TXTレコードは既存設定を維持します。
7. ブラウザで製品ページを開き、架空の試用申込を送って管理画面で受付IDを照合します。問題があればAレコードを旧値へ戻します。
