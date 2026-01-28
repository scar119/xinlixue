/**
 * DeepSeek AI - 夸夸功能
 * 使用 DeepSeek API 生成正向反馈
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = process.env.DEEPSEEK_API_KEY

/**
 * 夸夸 AI 响应类型
 */
export interface KuakuaResponse {
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

/**
 * 生成夸夸响应
 */
export async function generateKuakuaResponse(input: string): Promise<KuakuaResponse> {
  // 调试：检查 API Key 是否加载
  console.log('[夸夸AI] API_KEY 是否存在:', !!API_KEY)
  console.log('[夸夸AI] API_KEY 前10位:', API_KEY?.substring(0, 10) + '...')
  console.log('[夸夸AI] 用户输入:', input)

  // 如果没有配置 API Key，使用模拟响应
  if (!API_KEY) {
    console.log('[夸夸AI] 未配置 DEEPSEEK_API_KEY，使用模拟响应')
    return getMockKuakuaResponse(input)
  }

  try {
    const systemPrompt = `你是一位温暖、专业、富有同理心的心理咨询师AI助手，名字叫"心语"。

你的任务是：
1. 用真诚、温暖的语言给予正向反馈
2. 发现用户输入中的闪光点和优点
3. 提供具体的、个性化的夸奖
4. 语言要自然、人性化，避免机械感
5. 适当使用emoji增加亲和力
6. 长度控制在100-200字之间
7. 必须以"✨ 你其实很棒！"开头

示例：
用户输入：今天终于完成了拖延很久的报告
你的回复：✨ 你其实很棒！👏 我看到了你的毅力和执行力！能够克服拖延症并完成这项任务，说明你有着很强的自我管理能力。这种说到做到的品质非常珍贵，值得为自己骄傲！🌟 继续保持这个势头，你一定能达成更多目标！💪

请根据用户的输入，给予真诚、具体、温暖的夸奖。`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    console.log('[夸夸AI] API 响应状态:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('[夸夸AI] DeepSeek API error:', error)
      throw new Error(`API 调用失败: ${response.status}`)
    }

    const data = await response.json()
    console.log('[夸夸AI] API 返回数据:', JSON.stringify(data, null, 2))

    const text = data.choices?.[0]?.message?.content

    if (!text) {
      console.error('[夸夸AI] API 返回内容为空，使用模拟响应')
      return getMockKuakuaResponse(input)
    }

    console.log('[夸夸AI] AI 生成的回复:', text)

    const sentiment = analyzeSentiment(input)

    return { text, sentiment }
  } catch (error) {
    console.error('[夸夸AI] DeepSeek API 调用失败，使用模拟响应:', error)
    return getMockKuakuaResponse(input)
  }
}

/**
 * 分析情感倾向
 */
function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['开心', '快乐', '幸福', '成功', '棒', '优秀', '喜欢', '爱', '感谢', '完成', '终于', '做到了', '进步']
  const negativeWords = ['难过', '痛苦', '失败', '焦虑', '害怕', '讨厌', '烦', '累', '糟糕', '压力', '困惑', '迷茫']

  let positiveCount = 0
  let negativeCount = 0

  for (const word of positiveWords) {
    if (text.includes(word)) positiveCount++
  }

  for (const word of negativeWords) {
    if (text.includes(word)) negativeCount++
  }

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

/**
 * 模拟响应（API 调用失败时使用）
 */
function getMockKuakuaResponse(input: string): KuakuaResponse {
  const sentiment = analyzeSentiment(input)

  const responses = {
    positive: `✨ 你其实很棒！

我看到了你分享的内容中蕴含的力量：
• 你愿意表达真实的想法，这需要勇气
• 你的文字透露出真诚和善良
• 你关注自己的内心世界，这是自我觉察的表现

记住，每个人都有自己的闪光点。你也不例外。
继续保持这种积极的心态，你正在成为更好的自己的路上！💪`,

    neutral: `✨ 你其实很棒！

感谢你的分享。从你的文字中，我感受到了：
• 你的思考很深入
• 你在用心观察生活
• 你对事物有自己的见解

这些都是宝贵的品质。继续保持探索和发现，
你会不断成长和进步的！✨`,

    negative: `✨ 你其实很棒！

我理解你此刻的感受，但请相信：
• 承认困难需要勇气，你做到了
• 你在寻求改变和成长，这很了不起
• 你的感受是真实合理的，值得被看见

每个人都有低谷期，这并不代表你的价值。
你比自己想象的更坚强，更有能力度过难关。
给自己一点时间和耐心，你会看到光亮的！🌟`,
  }

  return {
    text: responses[sentiment],
    sentiment,
  }
}
