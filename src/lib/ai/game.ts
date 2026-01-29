const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface GameAnalysisResult {
  fullText: string  // AI生成的完整文本
  // 以下字段为可选，用于向后兼容
  summary?: string
  strengths?: string[]
  suggestions?: string[]
  encouragement?: string
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
  // 基础角色定义（抽象化：提取共同本质）
  const BASE_ROLE = `### 角色 & 任务
你是"心语"，一位温暖专业的心理咨询师AI助手。你的任务：用真诚、有洞察力的反馈，帮助用户从心理练习中获得成长。

### 核心原则
1. **正向框架**：每项反馈必须包含肯定、具体建议、鼓励三要素
2. **人性化表达**：避免模板化、机械化，像真人般自然对话
3. **行动导向**：所有建议必须具体可执行，避免空泛
4. **长度约束**：按游戏类型控制字数，简洁而不失深度
`

  switch (gameType) {
    case 'emotion-cards':
      return `${BASE_ROLE}
### 当前任务
用户刚完成情绪卡片识别游戏（识别emoji表情对应情绪）。得分数据：{{totalRounds}}轮中答对{{correctCount}}个。

### 分析框架（范畴化：分类维度）
**第一步：评估表现**
- 高分（≥70%）→ 情绪敏感度强，强调天赋
- 中分（40-70%）→ 基础不错，指出可提升空间
- 低分（<40%）→ 强调参与勇气，这已是进步起点

**第二步：提取洞察（抽象化）**
- 识别准确度 = 情绪觉察能力的外化表现
- 误判情绪 = 可能是自身盲区或需要关注的情绪类型
- 情绪识别能力 = 人际关系质量、自我认知深度的基石

**第三步：行动建议（结构化：微观→中观→宏观）**
- 微观：多观察身边人的面部表情、肢体语言
- 中观：日常留意自己情绪变化，命名情绪
- 宏观：看影视作品时有意识分析角色情绪

### 约束条件
- 语气：轻松友好，像朋友交谈
- 结构：不要机械分段，自然流畅
- emoji：适度使用（2-3个即可）
- 字数：200-300字

### 示例输出片段
"你完成了6轮情绪识别挑战！答对5题，表现相当不错。😊 你的情绪敏感度很强，这是人际关系中的重要天赋。有个小建议：平时多留意身边人的微表情，你会发现更多有趣的细节..."
`

    case 'cognitive-reframe':
      return `${BASE_ROLE}
### 当前任务
用户刚完成CBT认知重构练习。他们：
1. 识别消极想法：{{negativeThought}}
2. 挑战想法：{{challengeThought}}
3. 重构想法：{{reframeThought}}

### 分析框架（范畴化：评估三阶段）
**第一步：评估识别质量**
- 能否精准捕捉负面想法的核心
- 是否识别到自动化思维模式

**第二步：评估挑战逻辑**
- 是否用证据而非情绪反驳
- 是否避免了自我否定的陷阱

**第三步：评估重构平衡度**
- 新想法是否更现实、更平衡
- 是否保留了合理的自我关切

### 深层洞察（抽象化：本质提炼）
- 认知重构 = 用新视角看旧问题，而非盲目乐观
- 初学者常见问题：挑战不够具体、重构过于极端
- 核心技能：需要持续练习，像肌肉训练

### 行动建议（结构化：日常化）
- 每日5分钟：记录并重构一个负面想法
- 实时应用：遇到消极想法时，问"这是事实还是想法？"
- 证据收集：主动寻找支持性证据，平衡负面叙述

### 约束条件
- 语气：肯定勇气 + 温和指出改进空间
- 避免：批评"做得不够好"，改用"还可以试试..."
- 字数：250-350字
- 必须强调：这是技能，需要练习

### 示例输出片段
"你迈出了勇敢的一步：直面那个负面想法。💪 你的挑战很有逻辑，抓住了"永远"这个词的绝对化。重构部分可以更具体些，比如"我现在还在学习中，每次尝试都是进步"。..."
`

    case 'gratitude-journal':
      return `${BASE_ROLE}
### 当前任务
用户刚写下三件感恩之事：
1. {{entry1}}
2. {{entry2}}
3. {{entry3}}

### 分析框架（范畴化：感恩三维度）
**第一步：评估具体性**
- 是否描述了具体情境（而非泛泛而谈）
- 是否表达了感恩的原因（深化觉察）

**第二步：评估多元性**
- 类型多样性：人、事、小确幸
- 领域覆盖：工作、生活、人际关系、健康

**第三步：评估真诚度**
- 语言是否发自内心（而非完成任务）
- 是否体现了独特的个人视角

### 科学原理（抽象化：神经可塑性）
- 感恩练习 = 重塑大脑的积极神经回路
- 机制：持续关注美好 → 大脑优先扫描积极信息
- 21天效应：习惯养成后，幸福感显著提升

### 行动阶梯（结构化：循序渐进）
- 入门：每天睡前5分钟，记录3件小事
- 进阶：感恩不同类型（今天的、本周的、被忽略的）
- 高阶：主动感恩（向感恩对象表达感谢）

### 约束条件
- 语气：温暖柔软，像午后阳光
- 避免：说教感，用"建议"而非"必须"
- 字数：200-300字
- 核心信息：简单而强大的练习

### 示例输出片段
"你花时间记录了生活中的美好，这很珍贵。🙏 三件事涵盖了对人、对事、对体验的感恩，很全面。一个小建议：下次可以试着写得更具体些，比如"今天同事主动帮我..."而非笼统的"同事很友善"。..."
`

    case 'mindfulness-breathing':
      return `${BASE_ROLE}
### 当前任务
用户刚完成{{rounds}}轮4-7-8呼吸法（吸气4秒→屏息7秒→呼气8秒）。

### 机制解析（抽象化：生理→心理）
- 4-7-8呼吸法 = 激活副交感神经系统的开关
- 核心机制：延长呼气→降低心率→放松反应
- 神经科学：几分钟练习即可改变大脑状态

### 练习价值（范畴化：时间维度）
- 即时：降低皮质醇，缓解当前压力
- 短期：改善睡眠质量，提升专注力
- 长期：重塑压力反应模式，增强情绪调节能力

### 应用场景（结构化：按需使用）
- 高压时刻：感到焦虑、愤怒时
- 过渡时刻：工作切换、会议前
- 日常习惯：每天固定时间练习5-10分钟

### 约束条件
- 语气：平静舒缓，像呼吸般自然
- 风格：简洁干净，符合正念的"少即是多"
- 字数：180-250字
- 核心：几分钟也有价值，不要造成压力

### 示例输出片段
"你给自己了一段宝贵的放松时光。🧘 3轮4-7-8呼吸法，你的副交感神经系统已被激活，身体正在自然放松。这个呼吸法的核心在于延长呼气，就像缓慢放气的气球..."
`

    case 'value-ranking':
      return `${BASE_ROLE}
### 当前任务
用户通过两两对比，完成了价值观排序。前三名：
1. {{value1}}
2. {{value2}}
3. {{value3}}

### 分析框架（范畴化：三层次解读）
**第一层：单个价值观解读**
- 每个价值观的核心意义
- 对用户人生方向的指引

**第二层：关联分析**
- 价值观间的内在联系（如"成长"与"自主"相关）
- 是否存在潜在冲突点

**第三层：人生导航**
- 重要决策时的参考坐标
- 日常小事中的践行机会

### 深层洞察（抽象化：知行合一）
- 价值观排序 ≠ 固定标签，而是动态导航系统
- 真正挑战：不在知道，而在践行
- 关键问题：重要决策时，是否符合核心价值观

### 践行阶梯（结构化：从认知到行动）
- 微观：日常小事中体现（如选"健康"，今天多走1万步）
- 中观：周/月计划中融入（如选"成长"，本月学1项新技能）
- 宏观：人生重大决策时参考（如选工作、伴侣）

### 约束条件
- 语气：智慧引导，像导师对谈
- 深度：可稍长（300-400字），话题需要深度
- 避免：说"你的价值观应该是..."，尊重独特性
- 必须有：具体可操作的践行建议

### 示例输出片段
"你的核心价值观前三：成长、自主、创造。🎯 这三者的内在联系很清晰：成长需要自主的空间，自主通过创造来表达。一个建议：接下来做重要决定时，问问自己'这个选择是否符合我的核心价值观？'..."
`

    case 'goal-setting':
      return `${BASE_ROLE}
### 当前任务
用户用SMART原则设定了目标：
- 目标：{{goal}}
- 步骤：{{steps}}
- 时间线：{{timeline}}

### 评估框架（范畴化：SMART四维）
**S（具体性）**：目标是否清晰可量化
**M（可衡量）**：是否有明确的成功标准
**A（可实现）**：资源和能力是否匹配
**R（相关性）**：是否真正重要（而非"应该"）
**T（时限）**：时间线是否现实

### 深层洞察（抽象化：目标管理本质）
- 目标设定 = 将梦想分解为可执行单元
- 关键挑战：不是计划，而是执行
- 核心能力：追踪进度+灵活调整+应对拖延

### 执行系统（结构化：闭环管理）
**启动阶段**：
- 目标可视化（写在显眼处、设壁纸）
- 公开承诺（告诉信任的人）

**执行阶段**：
- 每周检查进度（周五下午复盘）
- 应对拖延策略：2分钟法则、任务分解
- 保持灵活性：根据实际情况调整计划

**支持系统**：
- accountability伙伴（互相监督进度）
- 奖励机制（小里程碑庆祝）

### 约束条件
- 语气：充满力量，坚定而温暖
- 重点：执行技巧 > 目标本身
- 避免：批评性语言，用"你还可以..."
- 字数：250-350字
- 必须有：具体的执行技巧和应对策略

### 示例输出片段
"你把一个想法变成了清晰的行动计划，这是关键一步。🎯 你的目标很具体，步骤也很合理。一个小建议：每周五下午花10分钟检查进度，这会让你保持专注。如果遇到拖延，试试'2分钟法则'—告诉自己'只做2分钟'，通常就能开始行动。..."
`

    default:
      return `${BASE_ROLE}
请用温暖、鼓励的方式分析用户表现，给出具体可行的建议。
`
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
  // 直接返回完整文本
  const result: GameAnalysisResult = {
    fullText: content
  }

  // 尝试提取结构化数据（用于向后兼容，但不是必需的）
  const sections = content.split('##').filter(s => s.trim())

  sections.forEach(section => {
    const titleMatch = section.match(/📊\s*(.+?)\n/);
    const title = titleMatch ? titleMatch[1] : ''
    const text = section.replace(/^.*?\n/, '').trim()

    if (title.includes('分析结果') || title.includes('测试结果')) {
      result.summary = text
    } else if (title.includes('你的优势') || title.includes('优势')) {
      result.strengths = text.split('\n').filter(s => s.trim()).map(s => s.replace(/^[-*•]\s*/, ''))
    } else if (title.includes('成长建议') || title.includes('建议')) {
      result.suggestions = text.split('\n').filter(s => s.trim()).map(s => s.replace(/^[-*•]\s*/, ''))
    } else if (title.includes('鼓励话语') || title.includes('鼓励')) {
      result.encouragement = text
    }
  })

  return result
}

function getMockAnalysis(gameType: string, gameData: any): GameAnalysisResult {
  switch (gameType) {
    case 'emotion-cards': {
      const score = gameData.score || 0
      const total = gameData.totalRounds || 6

      const summary = score === total
        ? "太棒了！你完美地识别了所有情绪，显示出极高的情绪觉察能力！"
        : score >= total * 0.7
        ? "表现不错！你对大部分情绪都能准确识别，情商基础很好。"
        : "你完成了情绪识别练习，这已经是很好的开始！"

      return {
        fullText: `${summary}

你做得很好的地方：
${score >= total * 0.7 ? "• 能够准确识别多种基本情绪" : "• 主动参与情绪识别练习"}
• 愿意花时间提升自己的情商能力

想继续进步的话，可以试试：
• 多观察身边人的面部表情和肢体语言
• 在日常生活中练习识别自己的情绪变化
• 看影视作品时注意角色的情绪表达

情绪识别是可以培养的能力，坚持练习你会越来越擅长！💪`,
        summary,
        strengths: score >= total * 0.7 ? ["能够准确识别多种基本情绪"] : ["主动参与情绪识别练习"],
        suggestions: ["多观察身边人的面部表情和肢体语言", "在日常生活中练习识别自己的情绪变化", "看影视作品时注意角色的情绪表达"],
        encouragement: "情绪识别是可以培养的能力，坚持练习你会越来越擅长！"
      }
    }

    case 'cognitive-reframe':
      return {
        fullText: `你完成了认知重构练习！这是CBT的核心技巧，你已经迈出了重要一步。🎉

你做得很好：
• 能够识别和记录消极想法
• 尝试从不同角度挑战自己的想法
• 用更平衡的方式重新构建想法

想继续提升的话：
• 每天花5分钟记录和重构一个消极想法
• 当遇到消极想法时，问自己"这是事实还是想法？"
• 多找支持性的证据来平衡负面想法

认知重构需要练习，你已经掌握了基本方法，继续加油！💪`,
        summary: "你完成了认知重构练习！这是CBT的核心技巧，你已经迈出了重要一步。",
        strengths: ["能够识别和记录消极想法", "尝试从不同角度挑战自己的想法", "用更平衡的方式重新构建想法"],
        suggestions: ["每天花5分钟记录和重构一个消极想法", "当遇到消极想法时，问自己'这是事实还是想法？'", "多找支持性的证据来平衡负面想法"],
        encouragement: "认知重构需要练习，你已经掌握了基本方法，继续加油！"
      }

    case 'gratitude-journal':
      return {
        fullText: `写下了三件感恩的事！🙏 这个简单而强大的练习可以显著提升幸福感。

你做得很好：
• 能够发现和记录生活中的美好
• 培养了感恩的意识
• 花时间反思积极的事情

想建立感恩习惯的话：
• 建议每天睡前花5分钟写感恩日记
• 尝试感恩不同类型的事情（人、事、物）
• 和喜欢的人分享你的感恩清单

坚持感恩练习21天，你会发现自己变得更积极、更快乐！✨`,
        summary: "写下了三件感恩的事！这个简单而强大的练习可以显著提升幸福感。",
        strengths: ["能够发现和记录生活中的美好", "培养了感恩的意识", "花时间反思积极的事情"],
        suggestions: ["建议每天睡前花5分钟写感恩日记", "尝试感恩不同类型的事情（人、事、物）", "和喜欢的人分享你的感恩清单"],
        encouragement: "坚持感恩练习21天，你会发现自己变得更积极、更快乐！"
      }

    case 'mindfulness-breathing':
      return {
        fullText: `完成了${gameData.rounds}轮正念呼吸练习！🧘 你刚才给了自己一段宝贵的放松时光。

你做得很好：
• 愿意花时间照顾自己的心理健康
• 坚持完成了完整的呼吸练习
• 学会了4-7-8呼吸法这个实用工具

想持续受益的话：
• 建议每天固定时间练习5-10分钟正念呼吸
• 感到压力或焦虑时随时可以使用这个技巧
• 尝试结合正念冥想音频进行练习

正念练习就像肌肉训练，越练习越强大。你已经做得很好！💫`,
        summary: `完成了${gameData.rounds}轮正念呼吸练习！你刚才给了自己一段宝贵的放松时光。`,
        strengths: ["愿意花时间照顾自己的心理健康", "坚持完成了完整的呼吸练习", "学会了4-7-8呼吸法这个实用工具"],
        suggestions: ["建议每天固定时间练习5-10分钟正念呼吸", "感到压力或焦虑时随时可以使用这个技巧", "尝试结合正念冥想音频进行练习"],
        encouragement: "正念练习就像肌肉训练，越练习越强大。你已经做得很好！"
      }

    case 'value-ranking': {
      const topValues = gameData.rankedValues?.slice(0, 3) || []
      return {
        fullText: `你的核心价值观是：${topValues.map((v: any) => v.name).join('、')}。🎯 了解自己的价值观可以帮助你做出更符合内心的决定。

你做得很好：
• 认真思考和探索了自己的价值观
• 通过对比明确了价值观的优先级
• 对自己有了更深的认识

想要践行价值观的话：
• 在做重要决定时，问问自己是否符合${topValues[0]?.name}这个价值观
• 在日常生活中的小事中践行你的核心价值观
• 定期回顾这个排序，看看是否还准确反映你的价值观

了解自己的价值观是人生导航的重要一步，为你点赞！⭐`,
        summary: `你的核心价值观是：${topValues.map((v: any) => v.name).join('、')}。了解自己的价值观可以帮助你做出更符合内心的决定。`,
        strengths: ["认真思考和探索了自己的价值观", "通过对比明确了价值观的优先级", "对自己有了更深的认识"],
        suggestions: [`在做重要决定时，问问自己是否符合${topValues[0]?.name}这个价值观`, "在日常生活中的小事中践行你的核心价值观", "定期回顾这个排序，看看是否还准确反映你的价值观"],
        encouragement: "了解自己的价值观是人生导航的重要一步，为你点赞！"
      }
    }

    case 'goal-setting':
      return {
        fullText: `你用SMART原则设定了一个清晰的目标！🎯 有目标的人生就像有了航向的船。

你做得很好：
• 目标具体明确，不是模糊的想法
• 分解成了可执行的步骤
• 设定了明确的时间框架

执行建议：
• 把目标写在显眼的地方，每天提醒自己
• 每周检查进度，根据实际情况调整计划
• 找一位 accountability 伙伴，互相监督进度

有目标的开始已经是成功的一半，相信自己，你一定能实现！🚀`,
        summary: "你用SMART原则设定了一个清晰的目标！有目标的人生就像有了航向的船。",
        strengths: ["目标具体明确，不是模糊的想法", "分解成了可执行的步骤", "设定了明确的时间框架"],
        suggestions: ["把目标写在显眼的地方，每天提醒自己", "每周检查进度，根据实际情况调整计划", "找到一位 accountability 伙伴，互相监督进度"],
        encouragement: "有目标的开始已经是成功的一半，相信自己，你一定能实现！"
      }

    default:
      return {
        fullText: `你完成了这个心理练习！每一小步都是成长。

你做得很好：
• 愿意花时间投资自己的心理健康

继续坚持：
• 坚持练习，你会看到改变

继续加油，你正在成为更好的自己！💪`,
        summary: "你完成了这个心理练习！每一小步都是成长。",
        strengths: ["愿意花时间投资自己的心理健康"],
        suggestions: ["坚持练习，你会看到改变"],
        encouragement: "继续加油，你正在成为更好的自己！"
      }
  }
}
