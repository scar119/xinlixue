import { NextResponse } from 'next/server'
import { db } from '@/src/db'
import { tests } from '@/src/db/schema'

export async function GET() {
  try {
    const testsList = await db.select().from(tests)
    return NextResponse.json({
      success: true,
      tests: testsList,
    })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取测试列表失败',
        tests: [],
      },
      { status: 500 }
    )
  }
}
