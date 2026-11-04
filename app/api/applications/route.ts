import { database } from '../../../lib/postgres';
import { InputError, parseApplication } from '../../../lib/validation';

function result(data: unknown, status: number) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== process.env.PRODUCTS_ORIGIN) {
    return result({ error: 'ページを開き直して送信してください。' }, 403);
  }
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return result({ error: '送信形式を確認してください。' }, 415);
  }

  const reader = request.body?.getReader();
  if (!reader) return result({ error: '入力が空です。' }, 400);
  try {
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) {
        await reader.cancel();
        return result({ error: '入力内容が長すぎます。' }, 413);
      }
      chunks.push(value);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return result({ error: '入力内容を確認してください。' }, 400);
    }
    const input = parseApplication(payload);
    const db = database();
    const { rows } = await db.query<{ id: string }>(
      `INSERT INTO ktl_product_applications
         (id, name, email, company, product, purpose, deployment, team_size, notes, consent_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING RETURNING id`,
      [input.requestId, input.name, input.email, input.company, input.product,
       input.purpose, input.deployment, input.teamSize, input.notes, 'aws-v1'],
    );
    return result({ id: input.requestId }, rows.length ? 201 : 200);
  } catch (error) {
    if (error instanceof InputError) return result({ error: error.message }, 400);
    return result({ error: '保存できませんでした。時間をおいて再試行してください。' }, 503);
  }
}
