import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/db'
import { theories } from '@/src/db/schema'
import { eq } from 'drizzle-orm'

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

    // 先获取当前阅读次数
    const article = await db
      .select()
      .from(theories)
      .where(eq(theories.id, articleId))
      .limit(1)

    if (article.length === 0) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 更新阅读次数
    const updatedArticles = await db
      .update(theories)
      .set({ viewCount: (article[0].viewCount || 0) + 1 })
      .where(eq(theories.id, articleId))
      .returning()

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
