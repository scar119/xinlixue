import { NextResponse } from 'next/server'
import { analyzeGameResult } from '@/src/lib/ai/game'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameType, gameData } = body

    if (!gameType || !gameData) {
      return NextResponse.json(
        { success: false, error: '参数不完整' },
        { status: 400 }
      )
    }

    // 调用 AI 分析
    const analysis = await analyzeGameResult(gameType, gameData)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('游戏分析 API 错误:', error)
    return NextResponse.json(
      { success: false, error: '分析失败' },
      { status: 500 }
    )
  }
}
