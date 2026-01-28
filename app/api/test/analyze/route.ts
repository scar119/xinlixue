import { NextResponse } from 'next/server'
import { analyzeTestAnswers } from '@/src/lib/ai/test'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { testName, answers, questions } = body

    if (!testName || !answers) {
      return NextResponse.json(
        { success: false, error: '参数不完整' },
        { status: 400 }
      )
    }

    // 调用 AI 分析
    const analysis = await analyzeTestAnswers(testName, answers, questions)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('测试分析 API 错误:', error)
    return NextResponse.json(
      { success: false, error: '分析失败' },
      { status: 500 }
    )
  }
}
