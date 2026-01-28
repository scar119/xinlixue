/**
 * DeepSeek AI 服务
 * 用于夸夸AI、测试结果分析等功能
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = process.env.DEEPSEEK_API_KEY

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  error?: string
}

/**
 * 调用 DeepSeek API
 */
async function callDeepSeek(messages: Message[]): Promise<AIResponse> {
  if (!API_KEY) {
    return { content: '', error: 'API Key 未配置' }
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API error:', error)
      return { content: '', error: `API 调用失败: ${response.status}` }
    }

    const data = await response.json()
    return {
      content: data.choices[0]?.message?.content || '',
    }
  } catch (error) {
    console.error('DeepSeek API error:', error)
    return { content: '', error: '网络请求失败' }
  }
}

/**
 * 夸夸AI - 给予正向反馈和鼓励
 */
export async function kuakuaAI(input: string): Promise<AIResponse> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `你是一位温暖、专业、富有同理心的心理咨询师AI助手，名字叫"心语"。

你的任务是：
1. 用真诚、温暖的语言给予正向反馈
2. 发现用户输入中的闪光点和优点
3. 提供具体的、个性化的夸奖
4. 语言要自然、人性化，避免机械感
5. 适当使用emoji增加亲和力
6. 长度控制在100-200字之间

示例：
用户输入："今天终于完成了拖延很久的报告"
你的回复：✨ 太棒了！我看到了你的毅力和执行力！👏 能够克服拖延症并完成这项任务，说明你有着很强的自我管理能力。这种说到做到的品质非常珍贵，值得为自己骄傲！🌟 继续保持这个势头，你一定能达成更多目标！💪`,
    },
    {
      role: 'user',
      content: input,
    },
  ]

  return await callDeepSeek(messages)
}

/**
 * 测试结果分析 - 生成个性化报告
 */
export async function analyzeTestResult(
  testName: string,
  answers: Record<string, string>,
  questions: any[]
): Promise<AIResponse> {
  // 构建用户答案摘要
  const answersSummary = questions.map((q, index) => {
    const answer = answers[q.id]
    const selectedOption = q.options.find((opt: any) => opt.label === answer)
    return `问题${index + 1}: ${q.text}\n回答: ${selectedOption?.text || answer}`
  }).join('\n\n')

  const messages: Message[] = [
    {
      role: 'system',
      content: `你是一位专业的心理咨询师，擅长分析心理测试结果并提供专业建议。

请根据用户的测试回答，生成一份个性化的分析报告，包括：

1. **总体评价**（100字左右）
   - 简要概括测试结果的整体情况

2. **优势分析**（150字左右）
   - 指出用户的2-3个优点或优势
   - 用温暖、鼓励的语气

3. **成长建议**（150字左右）
   - 提供2-3个具体可行的建议
   - 建议要实用、可操作

4. **鼓励话语**（50字左右）
   - 给予正向激励
   - 增强用户的信心

注意事项：
- 语言要温暖、专业且易懂
- 避免过于负面的表述
- 多使用正向词汇
- 适当使用emoji增加亲和力
- 总字数控制在450-550字`,
    },
    {
      role: 'user',
      content: `测试名称：${testName}\n\n用户回答：\n${answersSummary}`,
    },
  ]

  return await callDeepSeek(messages)
}

/**
 * 通用AI对话
 */
export async function chatAI(userMessage: string, conversationHistory: Message[] = []): Promise<AIResponse> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `你是一位温暖、专业、富有同理心的心理咨询师AI助手，名字叫"心语"。

你的特点：
- 善于倾听和理解
- 提供专业的心理学建议
- 语言温暖、友善
- 避免说教，以引导为主
- 适当使用emoji增加亲和力

请在心理咨询、情绪管理、人际关系、自我成长等话题上给予用户专业的建议和支持。`,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ]

  return await callDeepSeek(messages)
}
