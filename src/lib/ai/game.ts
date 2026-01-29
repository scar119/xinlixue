const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface GameAnalysisResult {
  summary: string
  strengths: string[]
  suggestions: string[]
  encouragement: string
}

/**
 * 分析游戏结果并生成个性化建议
 */
export async function analyzeGameResult(
  gameType: string,
  gameData: any
): Promise<GameAnalysisResult> {
  // 如果没有API key，返回模拟数据
  if (!DEEPSEEK_API_KEY) {
    return getMockAnalysis(gameType, gameData)
  }

  try {
    const prompt = generatePrompt(gameType, gameData)

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(gameType)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('AI API 请求失败')
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return parseAnalysisResponse(content)
  } catch (error) {
    console.error('游戏AI分析失败:', error)
    return getMockAnalysis(gameType, gameData)
  }
}

function getSystemPrompt(gameType: string): string {
  const basePrompt = `你是一位温暖、专业、富有同理心的心理咨询师AI助手，名字叫"心语"。

你的任务是：
1. 分析用户的游戏表现或回答
2. 提供温暖、鼓励的反馈
3. 给出具体、可行的建议
4. 语言要自然、人性化
5. 长度控制在200-300字之间

**输出格式（Markdown）：**

## 📊 分析结果
[1-2句话总结用户的表现或结果]

## ✨ 你的优势
[指出2-3个积极的方面或做得好的地方]

## 💡 成长建议
[提供2-3条具体可行的建议]

## 🌟 鼓励话语
[给予正向激励，增强用户的信心]
`

  switch (gameType) {
    case 'emotion-cards':
      return basePrompt + `\n\n对于情绪卡片游戏，特别关注：
- 用户对情绪的识别准确度
- 强调情绪识别能力的重要性
- 提供提升情商的建议`

    case 'cognitive-reframe':
      return basePrompt + `\n\n对于认知重构游戏，特别关注：
- 用户识别消极想法的能力
- 重构想法的质量和合理性
- 鼓励持续练习认知重构技巧`

    case 'gratitude-journal':
      return basePrompt + `\n\n对于感恩日记，特别关注：
- 记录内容的真诚度和具体性
- 强调感恩练习对心理健康的好处
- 鼓励建立每日感恩的习惯`

    case 'mindfulness-breathing':
      return basePrompt + `\n\n对于正念呼吸，特别关注：
- 肯定用户完成练习的坚持
- 强调正念练习对减压的好处
- 鼓励建立日常正念习惯`

    case 'value-ranking':
      return basePrompt + `\n\n对于价值排序，特别关注：
- 帮助用户理解他们的价值观排序
- 分析前几个价值观的意义
- 提供如何在生活中践行这些价值观的建议`

    case 'goal-setting':
      return basePrompt + `\n\n对于目标设定，特别关注：
- 目标的清晰度和可行性
- 行动步骤的合理性
- 提供实现目标的执行建议`

    default:
      return basePrompt
  }
}

function generatePrompt(gameType: string, gameData: any): string {
  switch (gameType) {
    case 'emotion-cards':
      return `用户完成了情绪卡片游戏，识别了${gameData.totalRounds}种情绪，正确识别${gameData.correctCount}个，得分${gameData.score}分。

${gameData.score === gameData.totalRounds ? '用户完美识别了所有情绪！' :
  gameData.score >= gameData.totalRounds * 0.7 ? '用户表现很好，大部分情绪都能正确识别。' :
  '用户在某些情绪识别上还需要练习。'}

请分析用户的表现并给出建议。`

    case 'cognitive-reframe':
      return `用户完成了认知重构练习：
- 消极想法：${gameData.negativeThought}
- 挑战：${gameData.challengeThought}
- 重构：${gameData.reframeThought}

请分析用户的认知重构练习质量，并给出反馈和建议。`

    case 'gratitude-journal':
      return `用户写了感恩日记：
1. ${gameData.entries[0]}
2. ${gameData.entries[1]}
3. ${gameData.entries[2]}

请分析用户的感恩日记内容，并给出反馈和建议。`

    case 'mindfulness-breathing':
      return `用户完成了${gameData.rounds}轮正念呼吸练习（4-7-8呼吸法）。

请肯定用户的练习，并给出关于正念练习的建议。`

    case 'value-ranking':
      return `用户的价值观排序结果：
${gameData.rankedValues.map((v: any, i: number) => `#${i + 1} ${v.name} - ${v.description}`).join('\n')}

请分析这个价值观排序，并给出关于如何在生活中践行这些价值观的建议。`

    case 'goal-setting':
      return `用户设定了SMART目标：
- 目标：${gameData.goal}
- 步骤：
  1. ${gameData.steps[0]}
  2. ${gameData.steps[1]}
  3. ${gameData.steps[2]}
- 时间线：${gameData.timeline}

请分析这个目标设定的质量，并给出执行建议。`

    default:
      return '请分析这个游戏结果并给出建议。'
  }
}

function parseAnalysisResponse(content: string): GameAnalysisResult {
  // 简单的解析逻辑，提取各个部分
  const sections = content.split('##').filter(s => s.trim())

  const result: GameAnalysisResult = {
    summary: '',
    strengths: [],
    suggestions: [],
    encouragement: ''
  }

  sections.forEach(section => {
    const titleMatch = section.match(/📊\s*(.+?)\n/);
    const title = titleMatch ? titleMatch[1] : ''
    const text = section.replace(/^.*?\n/, '').trim()

    if (title.includes('分析结果')) {
      result.summary = text
    } else if (title.includes('你的优势')) {
      result.strengths = text.split('\n').filter(s => s.trim()).map(s => s.replace(/^[-*•]\s*/, ''))
    } else if (title.includes('成长建议')) {
      result.suggestions = text.split('\n').filter(s => s.trim()).map(s => s.replace(/^[-*•]\s*/, ''))
    } else if (title.includes('鼓励话语')) {
      result.encouragement = text
    }
  })

  // 如果解析失败，设置默认值
  if (!result.summary) result.summary = text
  if (result.strengths.length === 0) result.strengths = ['你完成了这个练习，这很棒！']
  if (result.suggestions.length === 0) result.suggestions = ['继续坚持练习，你会越来越好！']
  if (!result.encouragement) result.encouragement = '相信自己，你正在成长的道路上！'

  return result
}

function getMockAnalysis(gameType: string, gameData: any): GameAnalysisResult {
  switch (gameType) {
    case 'emotion-cards':
      const score = gameData.score || 0
      const total = gameData.totalRounds || 6

      return {
        summary: score === total
          ? "太棒了！你完美地识别了所有情绪，显示出极高的情绪觉察能力！"
          : score >= total * 0.7
          ? "表现不错！你对大部分情绪都能准确识别，情商基础很好。"
          : "你完成了情绪识别练习，这已经是很好的开始！",
        strengths: [
          score >= total * 0.7 ? "能够准确识别多种基本情绪" : "主动参与情绪识别练习",
          "愿意花时间提升自己的情商能力"
        ],
        suggestions: [
          "多观察身边人的面部表情和肢体语言",
          "在日常生活中练习识别自己的情绪变化",
          "看影视作品时注意角色的情绪表达"
        ],
        encouragement: "情绪识别是可以培养的能力，坚持练习你会越来越擅长！"
      }

    case 'cognitive-reframe':
      return {
        summary: "你完成了认知重构练习！这是CBT的核心技巧，你已经迈出了重要一步。",
        strengths: [
          "能够识别和记录消极想法",
          "尝试从不同角度挑战自己的想法",
          "用更平衡的方式重新构建想法"
        ],
        suggestions: [
          "每天花5分钟记录和重构一个消极想法",
          "当遇到消极想法时，问自己'这是事实还是想法？'",
          "多找支持性的证据来平衡负面想法"
        ],
        encouragement: "认知重构需要练习，你已经掌握了基本方法，继续加油！"
      }

    case 'gratitude-journal':
      return {
        summary: "写下了三件感恩的事！这个简单而强大的练习可以显著提升幸福感。",
        strengths: [
          "能够发现和记录生活中的美好",
          "培养了感恩的意识",
          "花时间反思积极的事情"
        ],
        suggestions: [
          "建议每天睡前花5分钟写感恩日记",
          "尝试感恩不同类型的事情（人、事、物）",
          "和喜欢的人分享你的感恩清单"
        ],
        encouragement: "坚持感恩练习21天，你会发现自己变得更积极、更快乐！"
      }

    case 'mindfulness-breathing':
      return {
        summary: `完成了${gameData.rounds}轮正念呼吸练习！你刚才给了自己一段宝贵的放松时光。`,
        strengths: [
          "愿意花时间照顾自己的心理健康",
          "坚持完成了完整的呼吸练习",
          "学会了4-7-8呼吸法这个实用工具"
        ],
        suggestions: [
          "建议每天固定时间练习5-10分钟正念呼吸",
          "感到压力或焦虑时随时可以使用这个技巧",
          "尝试结合正念冥想音频进行练习"
        ],
        encouragement: "正念练习就像肌肉训练，越练习越强大。你已经做得很好！"
      }

    case 'value-ranking':
      const topValues = gameData.rankedValues?.slice(0, 3) || []
      return {
        summary: `你的核心价值观是：${topValues.map((v: any) => v.name).join('、')}。了解自己的价值观可以帮助你做出更符合内心的决定。`,
        strengths: [
          "认真思考和探索了自己的价值观",
          "通过对比明确了价值观的优先级",
          "对自己有了更深的认识"
        ],
        suggestions: [
          `在做重要决定时，问问自己是否符合${topValues[0]?.name}这个价值观`,
          "在日常生活中的小事中践行你的核心价值观",
          "定期回顾这个排序，看看是否还准确反映你的价值观"
        ],
        encouragement: "了解自己的价值观是人生导航的重要一步，为你点赞！"
      }

    case 'goal-setting':
      return {
        summary: "你用SMART原则设定了一个清晰的目标！有目标的人生就像有了航向的船。",
        strengths: [
          "目标具体明确，不是模糊的想法",
          "分解成了可执行的步骤",
          "设定了明确的时间框架"
        ],
        suggestions: [
          "把目标写在显眼的地方，每天提醒自己",
          "每周检查进度，根据实际情况调整计划",
          "找到一位 accountability 伙伴，互相监督进度"
        ],
        encouragement: "有目标的开始已经是成功的一半，相信自己，你一定能实现！"
      }

    default:
      return {
        summary: "你完成了这个心理练习！每一小步都是成长。",
        strengths: ["愿意花时间投资自己的心理健康"],
        suggestions: ["坚持练习，你会看到改变"],
        encouragement: "继续加油，你正在成为更好的自己！"
      }
  }
}
