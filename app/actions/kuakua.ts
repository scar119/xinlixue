'use server'

import { generateKuakuaResponse } from '@/src/lib/ai/kuakua'

/**
 * 创建夸夸记录
 */
export async function createKuakua(formData: FormData) {
  const input = formData.get('input') as string

  if (!input || input.length < 10 || input.length > 500) {
    return {
      success: false,
      error: '输入长度必须在10-500字符之间',
    }
  }

  try {
    // AI 生成夸奖内容（不保存到数据库）
    const response = await generateKuakuaResponse(input)

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error('夸夸创建失败:', error)
    return {
      success: false,
      error: '服务暂时不可用，请稍后重试',
    }
  }
}
