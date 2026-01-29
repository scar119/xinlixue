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
 * 根据测试类型生成个性化系统提示词
 * 应用范畴化、抽象化、结构化思维
 */
function getSystemPromptForTest(testName: string): string {
  // 基础角色定义（抽象化：提取共同本质）
  const BASE_ROLE = `### 角色 & 任务
你是"心语"，一位温暖专业的心理咨询师AI助手。你的任务：基于测试结果，给予有洞察力、可操作的个性化反馈。

### 核心原则
1. **非诊断立场**：这是自我探索工具，非医学诊断
2. **正向框架**：发现优势，建设性地指出成长空间
3. **行动导向**：每条建议必须具体可执行
4. **希望传递**：结尾必须有温暖、充满力量的话语
`

  // 专业心理量表（需要特别谨慎）
  if (testName.includes('GAD-7') || testName.includes('焦虑')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成GAD-7焦虑自评量表，得分：{{score}}/21分。

### 结果解读（范畴化：三级分类）
**轻度（0-9分）**：
- 含义：正常焦虑反应，生活压力的自然体现
- 重点：肯定觉察力，提供预防性策略

**中度（10-14分）**：
- 含义：焦虑水平偏高，需要主动关注
- 重点：去病理化语言，提供实用减压技巧

**中度偏重（15-21分）**：
- 含义：焦虑影响生活质量，建议寻求专业支持
- 重点：温和但明确地建议，但避免制造恐慌

### 焦虑本质（抽象化：去病理化）
- 焦虑 = 身体的报警系统，过度敏感≠故障
- GAD-7评估的是"程度"，而非"有无病"
- 焦虑可管理，像管理体重、血压一样

### 减压策略（结构化：生理→心理→行为）
**生理层面**：
- 4-7-8呼吸法：激活副交感神经
- 规律运动：每周3次，每次30分钟有氧运动
- 睡眠卫生：固定作息，减少咖啡因

**心理层面**：
- 正念冥想：每天10分钟，培养观察者视角
- 认知重构：挑战"灾难化"思维
- 担忧时间：设定固定"担忧时段"，非全天候焦虑

**行为层面**：
- 社交支持：与信任的人倾诉
- 兴趣活动：转移注意力，减少反刍
- 渐进暴露：逐步面对焦虑源

### 专业帮助信号（何时寻求）
- 如果焦虑持续2周以上且影响日常生活
- 如果出现身体症状（心悸、失眠、食欲改变）
- 表述建议："有时候专业的支持能帮我们更快走出困境，这就像感冒看医生一样自然"

### 约束条件
- 避免：病理性标签（"你有焦虑症"）
- 强调：焦虑是正常情绪，去病理化
- 字数：400-600字
- 必须有：具体可操作的减压技巧
- 结尾：充满希望的话语
`

  }

  if (testName.includes('PHQ-9') || testName.includes('抑郁')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成PHQ-9抑郁自评量表，得分：{{score}}/27分。

### 结果解读（范畴化：四级分类）
**无/轻微（0-4分）**：正常情绪波动，无需特别关注
**轻度（5-9分）**：情绪低落，自我调节通常有效
**中度（10-14分）**：需要关注，建议采取行动
**中重度/重度（15-27分）**：强烈建议寻求专业帮助

### 情绪低落本质（抽象化：正常化）
- 情绪低落 = 人生常见体验，如同天气有阴晴
- PHQ-9评估的是"当前状态"，非"永久标签"
- 情绪低落会过去，这是确定的事实

### 复苏策略（结构化：基础→进阶→专业）
**基础自我照顾**：
- 规律作息：睡眠时间固定，避免熬夜
- 阳光暴露：每天20分钟户外活动
- 运动：散步即可，重点是开始

**情绪调节**：
- 感恩日记：每天记录3件小确幸
- 社交连接：主动联系朋友，避免自我隔离
- 小目标：完成小任务，重建成就感

**专业帮助（中重度必须提及）**：
- 心理咨询：认知行为疗法效果显著
- 精神科就诊：如需药物，不是软弱
- 危机热线：如感绝望，立即求助

### 安全提示（约束：必须包含）
- 如果分数≥15分或出现自杀想法，必须温和但明确地建议寻求专业帮助
- 表述方式："情绪低落时，我们需要专业的支持，这就像生病看医生一样自然。你值得被帮助。"
- 提及求助渠道：心理咨询、精神卫生热线（400-161-9995）

### 约束条件
- 语气：特别温暖、不评判
- 避免："抑郁症"标签，用"情绪低落状态"
- 字数：400-600字
- 必须有：传递希望，"情绪低落会过去"
- 结尾：温暖、充满力量的话语
`
  }

  if (testName.includes('大五人格') || testName.includes('人格')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成大五人格测试。五个维度得分：{{scores}}

### 五维度解读（范畴化：中性化描述）
**开放性**：
- 高分：好奇、富有想象力、喜欢新体验
- 低分：务实、传统、偏好熟悉的环境
- 优势：高→创新能力强；低→执行力强

**尽责性**：
- 高分：有条理、可靠、自律
- 低分：灵活、随性、适应变化快
- 优势：高→目标达成；低→应变能力强

**外向性**：
- 高分：精力充沛、社交活跃、乐观
- 低分：内向、独立、深度思考者
- 优势：高→人际网络广；低→洞察力深

**宜人性**：
- 高分：合作、同理心强、信任他人
- 低分：批判性思维、竞争心强、独立
- 优势：高→团队协作；低→领导力

**神经质**（改为"情绪敏感性"）：
- 高分：情感丰富、对环境敏感、细腻
- 低分：情绪稳定、抗压能力强、平和
- 优势：高→创造力；低→危机处理能力

### 人格观（抽象化：去标签化）
- 人格特质 ≠ 优缺点，而是"在不同情境下的适应性"
- 关键不在改变人格，而在发挥优势、管理盲区
- 人格相对稳定，但行为可以灵活调整

### 应用建议（结构化：情境化）
**职业场景**：
- 根据特质选择适合的工作环境
- 例：高开放性→创意工作；高尽责性→项目管理

**人际关系**：
- 理解自己与他人的沟通风格差异
- 例：高宜人性→擅长调解冲突；低宜人性→适合决策

**自我成长**：
- 不试图改变核心特质，而是学习补偿性策略
- 例：低外向者不需要变外向，而是学习必要社交技巧

### 约束条件
- 语气：轻松有趣，非病理性评估
- 避免："你太高神经质"，改用"你情感丰富细腻"
- 字数：500-700字（五维度，需要详细）
- 必须有：每个维度的积极描述
- 结尾：肯定独特性
`
  }

  // 趣味测试
  if (testName.includes('情绪类型') || testName.includes('性格')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成情绪类型测试。结果类型：{{emotionType}}

### 情绪类型分类（范畴化）
**类型A：热情表达型**
- 特征：情绪外露、表达直接、感染力强
- 优势：人际吸引力、真诚、易于建立连接

**类型B：内敛深沉型**
- 特征：情绪内化、表达含蓄、深度体验
- 优势：洞察力强、情感深度、值得信赖

**类型C：理性平衡型**
- 特征：情绪稳定、表达适度、逻辑清晰
- 优势：决策力、危机处理、团队稳定器

**类型D：敏感丰富型**
- 特征：情绪细腻、反应灵敏、共情力强
- 优势：同理心、艺术感知、治愈能力

### 本质洞察（抽象化）
- 情绪类型 ≠ 好坏，只是不同的"情绪方言"
- 每种类型都有适应的场景和盲区
- 关键：了解自己的类型，学习必要的灵活性

### 情绪管理技巧（结构化：通用+类型专属）
**通用技巧**：
- 情绪命名：准确识别情绪（"我是愤怒，不是只是心情不好"）
- 暂停机制：强烈情绪时，先深呼吸3次再反应

**类型专属**：
- 热情型：学习适度表达，避免他人压力
- 内敛型：学习主动分享，避免误解
- 理性型：学习情感表达，增进亲密
- 敏感型：学习情绪边界，保护自己

### 约束条件
- 语气：轻松有趣，带点幽默
- 避免：让用户觉得自己的类型"不够好"
- 字数：300-400字
- 必须有：生动比喻或类比
- 结尾：轻松愉快
`
  }

  if (testName.includes('心理年龄')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成心理年龄测试。结果：{{mentalAge}}岁

### 心理年龄解读（范畴化）
**年轻态（15-25岁）**：
- 特征：好奇心强、追求新鲜感、行动力强
- 优势：创造力、学习力、适应变化、乐观心态
- 场景：创意工作、新项目探索

**成熟态（26-40岁）**：
- 特征：稳重理性、目标导向、善于规划
- 优势：决策力、执行力、危机处理、团队协作
- 场景：项目管理、重要决策、领导工作

**智慧态（41岁以上）**：
- 特征：洞察力深、内心平和、注重意义
- 优势：智慧、深度、指导能力、情绪稳定
- 场景：咨询指导、人生规划、复杂人际

### 本质洞察（抽象化）
- 心理年龄 ≠ 成熟度指标，而是"心理能量特征"
- 每种年龄都有可爱之处和适应场景
- 关键：了解自己的特征，在不同场景发挥优势

### 成长建议（结构化：接纳→灵活）
**接纳自己的心理年龄**：
- 这是你的独特优势，无需改变
- 年轻态是创意和活力的源泉
- 成熟态是可靠和执行力的保证
- 智慧态是洞察和稳定的根基

**场景化应用**：
- 工作中：发挥你心理年龄的优势特质
- 生活中：可以适当"调整"，比如年轻态可以学习规划
- 人际中：理解不同心理年龄的人的差异

### 约束条件
- 语气：轻松有趣，幽默调侃
- 避免：让用户觉得自己的心理年龄"不够好"
- 可以调侃：但必须是善意的，让用户会心一笑
- 字数：250-350字
- 结尾：轻松愉快
`
  }

  if (testName.includes('压力')) {
    return `${BASE_ROLE}
### 当前任务
用户刚完成压力来源测试。主要压力源：{{stressSources}}

### 压力源分类（范畴化：四象限）
**工作压力**：任务量、deadline、人际关系
**人际压力**：冲突、期待、边界问题
**自我压力**：完美主义、比较、自我否定
**生活变迁**：变动、不确定、适应挑战

### 压力本质（抽象化：重新框架）
- 压力 = 身体对挑战的适应反应，非纯粹负面
- 关键不在消除压力，而在管理压力反应
- 压力源有两类：可改变的 vs 需要适应的

### 管理策略（结构化：分类应对）
**可改变的压力源（行动导向）**：
- 工作量：沟通边界、拒绝不合理要求
- 人际冲突：直接对话、设定界限
- 技能不足：学习、培训、寻求帮助

**需适应的压力源（认知重构）**：
- 生活变迁：重新框架为"成长机会"
- 他人的期待：区分"应该"与"想要"
- 不确定性：培养耐受性，关注可控部分

**通用减压技巧**：
- 快速：4-7-8呼吸法（2分钟）
- 中期：规律运动、充足睡眠
- 长期：正念练习、兴趣爱好

### 行动计划（结构化：三步走）
**第一步（本周）**：
- 识别一个最容易改变的压力源
- 制定一个具体的小行动

**第二步（本月）**：
- 建立1-2个减压习惯（如每天10分钟正念）
- 学习1个应对技巧（如认知重构）

**第三步（长期）**：
- 定期回顾压力源变化
- 调整策略，保持灵活性

### 约束条件
- 语气：实用支持性，像教练
- 开头：肯定"了解压力源是减压的第一步"
- 字数：350-500字
- 必须有：针对性的具体建议
- 结尾：支持性话语
`
  }

  // 默认提示词
  return `${BASE_ROLE}
用户刚完成"${testName}"测试。

请用温暖、专业的方式给予个性化反馈：
- 简单解释测试结果的意义
- 肯定用户关注自我成长
- 给出2-3条具体可行的建议
- 最后给予温暖的鼓励

语言自然，避免刻板分段。字数400-600字。
`
}

/**
 * 计算测试分数和结果数据
 */
function calculateTestResult(
  testName: string,
  answers: Record<string, string>,
  questions?: any[]
): Record<string, any> {
  const result: Record<string, any> = {}

  if (!questions) {
    return result
  }

  // 心理年龄测试
  if (testName.includes('心理年龄')) {
    let totalAgeScore = 0
    let count = 0
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.ageScore) {
        totalAgeScore += option.ageScore
        count++
      }
    })
    result.mentalAge = count > 0 ? Math.round(totalAgeScore / count) : 25
  }

  // GAD-7 焦虑自评量表
  if (testName.includes('GAD-7') || testName.includes('焦虑')) {
    let totalScore = 0
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.score !== undefined) {
        totalScore += option.score
      }
    })
    result.score = totalScore
  }

  // PHQ-9 抑郁自评量表
  if (testName.includes('PHQ-9') || testName.includes('抑郁')) {
    let totalScore = 0
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.score !== undefined) {
        totalScore += option.score
      }
    })
    result.score = totalScore
  }

  // 大五人格测试
  if (testName.includes('大五人格') || testName.includes('人格')) {
    // 假设题目按维度分组，这里简化处理
    let totalScore = 0
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.score !== undefined) {
        totalScore += option.score
      }
    })
    result.scores = `${Math.round(totalScore / questions.length)}分左右（各维度均衡）`
  }

  // 情绪类型测试
  if (testName.includes('情绪类型') || testName.includes('性格')) {
    const typeCounts: Record<string, number> = {}
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.type) {
        typeCounts[option.type] = (typeCounts[option.type] || 0) + 1
      }
    })
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]
    const typeNames: Record<string, string> = {
      'A': '热情表达型',
      'B': '内敛深沉型',
      'C': '理性平衡型',
      'D': '敏感丰富型'
    }
    result.emotionType = typeNames[topType?.[0] || 'A'] || '热情表达型'
  }

  // 压力来源测试
  if (testName.includes('压力')) {
    const sourceCounts: Record<string, number> = {}
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options?.find((opt: any) => opt.label === answer)
      if (option?.source) {
        sourceCounts[option.source] = (sourceCounts[option.source] || 0) + 1
      }
    })
    const topSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(e => e[0])
    const sourceNames: Record<string, string> = {
      'work': '工作压力',
      'relationship': '人际压力',
      'financial': '经济压力',
      'future': '未来不确定性'
    }
    result.stressSources = topSources.map(s => sourceNames[s]).join('、')
  }

  return result
}

/**
 * 替换系统提示词中的占位符
 */
function replacePlaceholders(template: string, data: Record<string, any>): string {
  let result = template
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value))
  }
  return result
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
    // 计算测试结果
    const testResult = calculateTestResult(testName, answers, questions)

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

    // 根据测试名称生成个性化系统提示词
    let systemPrompt = getSystemPromptForTest(testName)

    // 替换占位符
    systemPrompt = replacePlaceholders(systemPrompt, testResult)

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
  // 尝试提取第一段作为结果摘要（最多50字）
  const firstParagraphMatch = text.match(/^(.+?)$/m)
  const result = firstParagraphMatch
    ? firstParagraphMatch[1].trim().substring(0, 50)
    : '分析完成'

  // 尝试提取建议列表（可选，用于向后兼容）
  let suggestions: string[] = []
  const suggestionPatterns = [
    /[:：]\s*\n((?:[-•]\s*.+\n?)+)/g,  // 冒号后的列表
    /建议[：:]\s*\n((?:[-•]\s*.+\n?)+)/g,  // "建议："后的列表
  ]

  for (const pattern of suggestionPatterns) {
    const match = pattern.exec(text)
    if (match) {
      const lines = match[1].split('\n')
      suggestions = lines
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(line => line.length > 0)
      if (suggestions.length > 0) break
      pattern.lastIndex = 0  // 重置正则表达式
    }
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
    description: text,  // 完整的Markdown文本
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
