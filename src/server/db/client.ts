import { sql, type QueryResultRow } from "@vercel/postgres"

/** 1 行取得 → 見つからなければ null */
export async function one<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T | null> {
  const { rows } = await sql<T>(strings, ...values)
  return rows[0] ?? null
}

/** 複数行取得 */
export async function many<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  const { rows } = await sql<T>(strings, ...values)
  return rows
}
