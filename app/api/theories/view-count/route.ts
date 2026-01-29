import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/db'
import { theories } from '@/src/db/schema'
import { eq, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: '文章ID不能为空' },
        { status: 400 }
      )
    }

    // 更新文章阅读次数
    const updatedArticles = await db
      .update(theories)
      .set({ viewCount: sql \`view_count + 1\` })
      .where(eq(theories.id, articleId))
      .returning()

    if (updatedArticles.length === 0) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      viewCount: updatedArticles[0].viewCount
    })
  } catch (error) {
    console.error('增加阅读次数失败:', error)
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}
