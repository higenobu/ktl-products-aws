import { createHash, timingSafeEqual } from 'node:crypto';
import { database } from '../../lib/postgres';
import { deploymentLabels, productLabels, purposeLabels } from '../../lib/catalog';

const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

function hash(value: string) {
  return createHash('sha256').update(value).digest();
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export async function GET(request: Request) {
  const password = process.env.PRODUCTS_ADMIN_PASSWORD;
  if (!password || password.length < 24) {
    return new Response('管理画面の設定が必要です。', { status: 503, headers });
  }
  const expected = 'Basic ' + Buffer.from('ktl-admin:' + password).toString('base64');
  if (!timingSafeEqual(hash(request.headers.get('authorization') ?? ''), hash(expected))) {
    return new Response('管理者ログインが必要です。', {
      status: 401,
      headers: { ...headers, 'WWW-Authenticate': 'Basic realm="KTL Products", charset="UTF-8"' },
    });
  }

  try {
    const { rows } = await database().query(
      `SELECT id, created_at, name, email, company, product, purpose, deployment, team_size, notes
         FROM ktl_product_applications ORDER BY created_at DESC, id DESC LIMIT 100`,
    );
    const body = rows.map(row => {
      const date = new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Tokyo',
      }).format(row.created_at);
      const values = [date, row.id, row.name, row.email, row.company, productLabels[row.product],
        purposeLabels[row.purpose], deploymentLabels[row.deployment], row.team_size, row.notes];
      return '<tr>' + values.map(value => '<td>' + escapeHtml(value) + '</td>').join('') + '</tr>';
    }).join('');
    return new Response(`<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>KTL 試用申込一覧</title><style>
body{font:16px system-ui,sans-serif;margin:2rem;color:#163c2f;background:#f5f7f1}
main{overflow:auto}table{border-collapse:collapse;background:white}th,td{border:1px solid #cdd7cd;padding:.6rem;text-align:left;vertical-align:top}
td{white-space:pre-wrap;overflow-wrap:anywhere}th{min-width:6rem}th:last-child{min-width:14rem}
</style><main><h1>試用申込一覧</h1><p>最新100件・日本時間</p>
${body ? '<table><thead><tr><th>受付日時</th><th>受付ID</th><th>名前</th><th>メール</th><th>所属</th><th>製品</th><th>希望</th><th>配置先</th><th>人数</th><th>相談内容</th></tr></thead><tbody>' + body + '</tbody></table>' : '<p>申込はまだありません。</p>'}</main></html>`,
      { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'" } });
  } catch {
    return new Response('申込一覧を読み込めませんでした。', { status: 503, headers });
  }
}
