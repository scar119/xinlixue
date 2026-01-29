import { db } from './index'
import { theories } from './schema'
import { eq, sql } from 'drizzle-orm'

/**
 * 清理 theories 表中的重复文章
 * 保留每个 title 的第一条记录（创建时间最早的）
 */
export async function cleanupDuplicateTheories() {
  console.log('开始清理重复的文章...')

  // 查找重复的 title
  const duplicates = await db.execute(sql`
    SELECT title, COUNT(*) as count
    FROM theories
    GROUP BY title
    HAVING COUNT(*) > 1
  `)

  if (duplicates.rows.length === 0) {
    console.log('✅ 没有发现重复文章')
    return
  }

  console.log(`发现 ${duplicates.rows.length} 个重复的文章:`)
  duplicates.rows.forEach((row: any) => {
    console.log(`  - ${row.title}: ${row.count} 条`)
  })

  // 删除重复记录，保留每个 title 的第一条记录
  for (const row of duplicates.rows) {
    const title = (row as any).title

    // 获取该 title 的所有记录，按创建时间排序
    const allRecords = await db
      .select()
      .from(theories)
      .where(eq(theories.title, title))
      .orderBy(sql`created_at ASC`)

    // 保留第一条，删除其余的
    const toDelete = allRecords.slice(1)
    if (toDelete.length > 0) {
      const idsToDelete = toDelete.map(r => r.id)
      await db.execute(sql`
        DELETE FROM theories
        WHERE id = ANY(${sql.param(idsToDelete)})
      `)
      console.log(`✅ 已删除 "${title}" 的 ${toDelete.length} 条重复记录`)
    }
  }

  console.log('✅ 清理完成！')
}

// 如果直接运行此文件
cleanupDuplicateTheories()
  .then(() => {
    console.log('清理成功')
    process.exit(0)
  })
  .catch((error) => {
    console.error('清理失败:', error)
    process.exit(1)
  })
