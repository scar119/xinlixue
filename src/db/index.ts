import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

/**
 * 创建数据库连接
 *
 * 开发环境: 使用本地 PostgreSQL 或 Neon
 * 生产环境: 使用 Neon Serverless
 */

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// 使用 Neon Serverless Driver (HTTP)
const neonConnection = neon(connectionString, {
  fetchOptions: {
    cache: 'no-store',
  },
})

export const db = drizzle(neonConnection, { schema })

/**
 * 数据库查询辅助函数
 *
 * 注意: Neon HTTP driver 不支持事务
 * 如果需要事务功能，请使用 neon/ws (WebSocket) driver
 */
export async function transaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  // Neon HTTP driver 不支持事务，直接执行
  // TODO: 如需事务支持，改用 @neondatabase/serverless 的 WebSocket 模式
  return await callback(db)
}
