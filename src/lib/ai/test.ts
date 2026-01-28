/**
 * DeepSeek AI - 测试结果分析
 * 使用 DeepSeek API 生成个性化测试报告
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = process.env.DEEPSEEK_API_KEY

/**
 * 测试分析结果
 */
export interface TestAnalysis {
  result: string
  type: string
  description: string
  suggestions: string[]
}

/**
 * 分析测试答案并生成报告
 */
export async function analyzeTestAnswers(
  testName: string,
  answers: Record<string, string>,
  questions?: any[]
): Promise<TestAnalysis> {
  // 如果没有配置 API Key，使用模拟响应
  if (!API_KEY) {
    console.log('未配置 DEEPSEEK_API_KEY，使用模拟响应')
    return getMockTestAnalysis(testName, answers)
  }

  try {
    // 构建用户答案摘要
    let answersText = ''
    if (questions) {
      answersText = questions.map((q, index) => {
        const answer = answers[q.id]
        const selectedOption = q.options?.find((opt: any) => opt.label === answer)
        return `问题${index + 1}: ${q.text}\n回答: ${selectedOption?.text || answer}`
      }).join('\n\n')
    } else {
      answersText = Object.entries(answers)
        .map(([question, answer]) => `问题: ${question}\n回答: ${answer}`)
        .join('\n\n')
    }

    const systemPrompt = `你是一位专业的心理咨询师和心理测试分析师，名字叫"心语"。

你的任务是根据用户的测试答案生成个性化的分析报告。

**报告结构（使用Markdown格式）：**

## 📊 测试结果
[用1-2句话概括测试结果]

## ✨ 你的优势
[指出2-3个用户的优点或优势，用温暖、鼓励的语气]

## 💡 成长建议
[提供2-3条具体可行的建议，每条建议要实用、可操作]

## 🌟 鼓励话语
[给予正向激励，增强用户的信心]

**注意事项：**
- 语言要温暖、专业且易懂
- 避免过于负面的表述
- 多使用正向词汇
- 适当使用emoji增加亲和力
- 总字数控制在400-600字
- 必须使用Markdown格式（## 标题、- 列表等）

测试名称：${testName}`

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
          { role: 'user', content: `测试名称：${testName}\n\n用户回答：\n${answersText}` },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API error:', error)
      throw new Error(`API 调用失败: ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || getMockTestAnalysis(testName, answers).description

    return parseTestAnalysis(text, testName)
  } catch (error) {
    console.error('DeepSeek API 调用失败，使用模拟响应:', error)
    return getMockTestAnalysis(testName, answers)
  }
}

/**
 * 解析 AI 返回的分析结果
 */
function parseTestAnalysis(text: string, testName: string): TestAnalysis {
  // 尝试从 Markdown 中提取结构化信息
  const resultMatch = text.match(/## 📊 测试结果\n\n(.+?)(?=\n\n##|\n\n$|$)/s)
  const result = resultMatch ? resultMatch[1].trim() : '分析完成'

  const advantagesMatch = text.match(/## ✨ 你的优势\n\n(.+?)(?=\n\n##|\n\n$|$)/s)
  const suggestionsMatch = text.match(/## 💡 成长建议\n\n(.+?)(?=\n\n##|\n\n$|$)/s)

  let suggestions: string[] = []

  if (suggestionsMatch) {
    // 提取建议列表
    const suggestionLines = suggestionsMatch[1].split('\n')
    suggestions = suggestionLines
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
  }

  // 如果没有提取到建议，使用默认建议
  if (suggestions.length === 0) {
    suggestions = [
      '持续关注自我成长',
      '保持积极的心态',
      '与他人分享你的感受',
    ]
  }

  return {
    result,
    type: '心理测评',
    description: text,
    suggestions,
  }
}

/**
 * 模拟测试分析（API 调用失败时使用）
 */
function getMockTestAnalysis(
  testName: string,
  answers: Record<string, string>
): TestAnalysis {
  const mockAnalyses: Record<string, TestAnalysis> = {
    'GAD-7 焦虑自评量表': {
      result: '轻度到中度焦虑水平',
      type: '焦虑评估',
      description: `## 📊 测试结果

根据你的回答，你的焦虑水平在轻度到中度范围内。这说明最近可能有一些压力和担忧，但整体仍在可控范围内。

## ✨ 你的优势

- • 你能够觉察自己的情绪状态，这是自我意识的表现
- • 你愿意面对和了解自己的焦虑水平，这是成长的第一步
- • 你在积极寻求了解自己的工具和方法

## 💡 成长建议

- • 尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒
- • 每天进行10分钟的正念冥想练习
- • 保持规律的运动，每周至少3次，每次30分钟
- • 与信任的朋友或家人分享你的感受
- • 减少咖啡因和酒精的摄入

## 🌟 鼓励话语

你的焦虑是正常的情绪反应，很多人都有类似的体验。通过识别和了解自己的焦虑水平，你已经迈出了重要的一步。记住，寻求帮助是勇气的表现，不是软弱。💪`,
      suggestions: [
        '练习4-7-8呼吸法',
        '正念冥想',
        '规律运动',
        '与信任的人倾诉',
        '减少咖啡因摄入',
      ],
    },
    'PHQ-9 抑郁自评量表': {
      result: '轻度情绪低落',
      type: '情绪评估',
      description: `## 📊 测试结果

根据你的回答，你最近可能有一些情绪低落的体验。这种情绪状态在人生某个阶段很常见，重要的是你愿意面对并了解它。

## ✨ 你的优势

- • 你有勇气面对自己的情绪状态
- • 你关注自己的心理健康，这体现了自我关怀
- • 你在积极寻找改善的方法

## 💡 成长建议

- • 保持规律的作息时间，尤其是睡眠时间
- • 每天至少进行20分钟户外活动
- • 坚持写感恩日记，每天记录3件值得感恩的事
- • 与朋友保持联系，不要自我隔离
- • 尝试新的爱好或活动，找回快乐的感觉

## 🌟 鼓励话语

情绪低落就像天气，会过去。你已经很棒了，因为你在主动寻求改变。记住，寻求帮助是勇敢的表现。🌈`,
      suggestions: [
        '规律作息',
        '户外活动',
        '感恩练习',
        '保持社交',
        '尝试新爱好',
      ],
    },
    '大五人格测试（简化版）': {
      result: '平衡型人格',
      type: '性格分析',
      description: `## 📊 测试结果

根据你的回答，你在五个性格维度上展现出较为平衡的特质。这意味着你能够根据不同情境灵活调整自己的行为方式。

## ✨ 你的优势

- • 你具备多面性，能够适应不同的社交情境
- • 你的性格特质较为均衡，这是很宝贵的品质
- • 你有自我认知的意愿和能力

## 💡 成长建议

- • 继续保持对自己性格特质的好奇和探索
- • 在不同情境中尝试发挥不同的性格优势
- • 接纳自己的多面性，这是你的独特之处
- • 定期反思自己的成长和变化

## 🌟 鼓励话语

你拥有独特的性格组合，这是你的优势所在。继续保持对自己的探索和接纳，你会发现更多可能性！✨`,
      suggestions: [
        '继续自我探索',
        '发挥多面性优势',
        '接纳独特性',
        '定期反思成长',
      ],
    },
  }

  return mockAnalyses[testName] || {
    result: '分析完成',
    type: '心理测评',
    description: `## 📊 测试结果

感谢你完成${testName}。你的测试结果已生成。

## ✨ 你的优势

- • 你愿意了解自己，这是成长的第一步
- • 你在积极关注自己的心理健康

## 💡 成长建议

- • 持续关注自我成长
- • 保持探索和学习的心态
- • 与他人分享你的发现

## 🌟 鼓励话语

每个人的成长之路都不同，重要的是你在路上。继续加油！💪`,
    suggestions: [
      '持续自我探索',
      '关注心理健康',
      '保持积极心态',
    ],
  }
}
