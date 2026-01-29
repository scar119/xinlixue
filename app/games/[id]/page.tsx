"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"

// AI 分析结果类型
interface GameAnalysis {
  fullText?: string  // 优先使用完整文本
  summary?: string
  strengths?: string[]
  suggestions?: string[]
  encouragement?: string
}

// AI 分析组件
function AIAnalysisResult({ analysis }: { analysis: GameAnalysis }) {
  return (
    <Card className="p-6 mt-6 border-primary-200 bg-gradient-to-r from-primary-50 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-primary-600">AI 个性化分析</h3>
      </div>

      {analysis.fullText ? (
        // 显示完整的AI文本（支持Markdown格式）
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {analysis.fullText}
          </div>
        </div>
      ) : (
        // 向后兼容：显示结构化数据
        <div className="space-y-4">
          {analysis.summary && (
            <div>
              <h4 className="font-semibold mb-2">📊 分析结果</h4>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>
          )}

          {analysis.strengths && analysis.strengths.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">✨ 你的优势</h4>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">💡 成长建议</h4>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-secondary-600 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.encouragement && (
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🌟 鼓励话语</h4>
              <p className="text-gray-700 italic">{analysis.encouragement}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// 游戏数据
const gamesData: Record<number, any> = {
  1: {
    title: "情绪卡片",
    description: "识别不同的情绪表达，提升你的情商",
    icon: "😊",
    type: "emotion-cards"
  },
  2: {
    title: "认知重构",
    description: "学习将消极思维转换为积极思维",
    icon: "🧠",
    type: "cognitive-reframe"
  },
  3: {
    title: "感恩日记",
    description: "记录每天的三件好事，培养积极心态",
    icon: "🙏",
    type: "gratitude-journal"
  },
  4: {
    title: "正念呼吸",
    description: "引导式冥想练习，放松身心",
    icon: "🧘",
    type: "mindfulness-breathing"
  },
  5: {
    title: "价值排序",
    description: "探索你内心真正重视的东西",
    icon: "💎",
    type: "value-ranking"
  },
  6: {
    title: "目标设定",
    description: "用 SMART 原则设定和追踪你的目标",
    icon: "🎯",
    type: "goal-setting"
  }
}

// ============ 游戏1：情绪卡片 ============
function EmotionCardsGame() {
  const emotions = [
    { name: "开心", emoji: "😊", keywords: ["快乐", "高兴", "愉快", "喜悦", "兴奋"] },
    { name: "悲伤", emoji: "😢", keywords: ["难过", "伤心", "痛苦", "失落", "哀伤"] },
    { name: "愤怒", emoji: "😠", keywords: ["生气", "愤怒", "恼火", "暴怒", "气愤"] },
    { name: "恐惧", emoji: "😨", keywords: ["害怕", "恐惧", "紧张", "焦虑", "担忧"] },
    { name: "惊讶", emoji: "😲", keywords: ["惊讶", "震惊", "意外", "吃惊", "诧异"] },
    { name: "厌恶", emoji: "🤢", keywords: ["厌恶", "恶心", "反感", "嫌弃", "讨厌"] }
  ]

  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [shuffledEmotions] = useState(() => [...emotions].sort(() => Math.random() - 0.5))
  const [currentEmotion, setCurrentEmotion] = useState(shuffledEmotions[0])
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const totalRounds = 6

  const handleSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName)
    const correct = emotionName === currentEmotion.name
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentRound < totalRounds - 1) {
        setCurrentRound(currentRound + 1)
        setCurrentEmotion(shuffledEmotions[currentRound + 1])
        setSelectedEmotion(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
        // 触发AI分析
        fetchAIAnalysis()
      }
    }, 1500)
  }

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'emotion-cards',
          gameData: { score, totalRounds, correctCount: score }
        })
      })
      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const resetGame = () => {
    setCurrentRound(0)
    setScore(0)
    setShowResult(false)
    setSelectedEmotion(null)
    setIsCorrect(null)
    setAnalysis(null)
    const newShuffled = [...emotions].sort(() => Math.random() - 0.5)
    setCurrentEmotion(newShuffled[0])
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">游戏结束！</h2>
          <p className="text-xl mb-2">你的得分</p>
          <p className="text-5xl font-bold text-primary-600 mb-4">{score} / {totalRounds}</p>

          {isLoadingAnalysis ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">AI 正在分析你的表现...</p>
            </div>
          ) : analysis ? (
            <AIAnalysisResult analysis={analysis} />
          ) : (
            <p className="text-gray-600 mb-6">
              {score === totalRounds ? "完美！你是情绪识别大师！" :
               score >= 4 ? "很不错！继续练习会更好！" :
               "继续加油，多关注情绪表达会帮助你进步！"}
            </p>
          )}

          <Button onClick={resetGame} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            再玩一次
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">第 {currentRound + 1} / {totalRounds} 轮</p>
          <p className="text-gray-600">得分: {score}</p>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg mb-4">这个表情代表什么情绪？</p>
          <div className={`text-9xl mb-4 transition-all duration-300 ${
            isCorrect !== null ? (isCorrect ? "scale-110" : "scale-90") : ""
          }`}>
            {currentEmotion.emoji}
          </div>
          {isCorrect !== null && (
            <p className={`text-lg font-semibold mb-4 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}>
              {isCorrect ? "✓ 正确！" : "✗ 错了！是 " + currentEmotion.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {emotions.map((emotion) => (
            <button
              key={emotion.name}
              onClick={() => handleSelect(emotion.name)}
              disabled={selectedEmotion !== null}
              className={`p-4 text-lg font-semibold rounded-xl border-2 transition-all ${
                selectedEmotion === emotion.name
                  ? isCorrect
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
              } ${selectedEmotion !== null ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <span className="mr-2">{emotion.emoji}</span>
              {emotion.name}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============ 游戏2：认知重构 ============
function CognitiveReframeGame() {
  const [currentStep, setCurrentStep] = useState(0)
  const [negativeThought, setNegativeThought] = useState("")
  const [challengeThought, setChallengeThought] = useState("")
  const [reframeThought, setReframeThought] = useState("")
  const [showExample, setShowExample] = useState(false)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const examples = [
    {
      negative: "我永远做不好这件事",
      challenge: "这是真的吗？我之前有过成功的经验吗？",
      reframe: "我现在还在学习中，每次尝试都是进步。"
    },
    {
      negative: "大家都觉得我很蠢",
      challenge: "我有证据吗？还是这只是我的想法？",
      reframe: "我无法知道别人的想法，我关注自己的成长就好。"
    }
  ]

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'cognitive-reframe',
          gameData: { negativeThought, challengeThought, reframeThought }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const resetGame = () => {
    setCurrentStep(0)
    setNegativeThought("")
    setChallengeThought("")
    setReframeThought("")
    setShowExample(false)
    setAnalysis(null)
  }

  const steps = [
    {
      title: "步骤1：识别消极想法",
      description: "写下最近让你感到困扰的消极想法",
      placeholder: "例如：我永远做不好这件事...",
      value: negativeThought,
      onChange: setNegativeThought
    },
    {
      title: "步骤2：挑战这个想法",
      description: "这个想法是真的吗？有证据吗？有没有反例？",
      placeholder: "例如：这真的是事实吗？我之前有没有成功过？...",
      value: challengeThought,
      onChange: setChallengeThought
    },
    {
      title: "步骤3：重新构建",
      description: "用更平衡、更现实的想法替代它",
      placeholder: "例如：我还在学习中，每次尝试都是进步...",
      value: reframeThought,
      onChange: setReframeThought
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

          <textarea
            value={steps[currentStep].value}
            onChange={(e) => steps[currentStep].onChange(e.target.value)}
            placeholder={steps[currentStep].placeholder}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 mb-6">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              上一步
            </Button>
          )}
          {currentStep < 2 ? (
            <Button
              onClick={handleNext}
              disabled={!steps[currentStep].value.trim()}
              className="flex-1"
            >
              下一步
            </Button>
          ) : (
            <Button
              onClick={() => setShowExample(true)}
              className="flex-1"
            >
              查看完整示例
            </Button>
          )}
        </div>

        {showExample && (
          <>
            <div className="bg-gradient-bg p-6 rounded-xl">
              <h4 className="font-bold mb-4">📝 认知重构示例</h4>
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {index === 0 ? "示例1：" : "示例2："}
                    </p>
                    <p className="mb-2"><strong>消极想法：</strong>{example.negative}</p>
                    <p className="mb-2"><strong>挑战：</strong>{example.challenge}</p>
                    <p><strong>重新构建：</strong><span className="text-green-600">{example.reframe}</span></p>
                  </div>
                ))}
              </div>
            </div>

            {isLoadingAnalysis ? (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">AI 正在分析你的练习...</p>
              </div>
            ) : analysis ? (
              <AIAnalysisResult analysis={analysis} />
            ) : (
              <Button
                onClick={() => fetchAIAnalysis()}
                className="w-full mt-6"
              >
                完成并查看AI分析
              </Button>
            )}

            <Button onClick={resetGame} className="w-full mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              重新开始
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}

// ============ 游戏3：感恩日记 ============
function GratitudeJournalGame() {
  const [entries, setEntries] = useState(["", "", ""])
  const [showResult, setShowResult] = useState(false)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries]
    newEntries[index] = value
    setEntries(newEntries)
  }

  const handleSubmit = () => {
    if (entries.every(e => e.trim())) {
      setShowResult(true)
      fetchAIAnalysis()
    }
  }

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'gratitude-journal',
          gameData: { entries }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const resetGame = () => {
    setEntries(["", "", ""])
    setShowResult(false)
    setAnalysis(null)
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-3xl font-bold mb-4">感恩日记已完成！</h2>

          {isLoadingAnalysis ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">AI 正在分析你的感恩日记...</p>
            </div>
          ) : analysis ? (
            <AIAnalysisResult analysis={analysis} />
          ) : (
            <p className="text-gray-600 mb-6">
              记录感恩的事情可以帮助你建立积极的心态。建议每天坚持练习！
            </p>
          )}

          <div className="bg-gradient-bg p-6 rounded-xl mb-6 text-left">
            <h4 className="font-bold mb-4">今天你感恩的三件事：</h4>
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-2xl">{["✨", "💫", "⭐"][index]}</span>
                  <p className="flex-1">{entry}</p>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={resetGame} className="w-full">
            写新的感恩日记
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold mb-2">感恩日记</h2>
          <p className="text-gray-600">
            记录今天让你感恩的三件事，小事也值得感恩！
          </p>
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2">
                {index + 1}. 我感恩...
              </label>
              <textarea
                value={entry}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                placeholder={["今天发生的某件好事", "某个让你开心的人", "某个让你感激的简单事物"][index]}
                className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none resize-none"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!entries.every(e => e.trim())}
          className="w-full mt-6"
        >
          完成日记
        </Button>
      </Card>
    </div>
  )
}

// ============ 游戏4：正念呼吸 ============
function MindfulnessBreathingGame() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [rounds, setRounds] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1

        // 切换阶段
        if (phase === "inhale") {
          setPhase("hold")
          return 7
        } else if (phase === "hold") {
          setPhase("exhale")
          return 8
        } else {
          // 完成一轮
          setRounds((prev) => {
            if (prev >= 3) {
              setIsActive(false)
              fetchAIAnalysis()  // 触发AI分析
              return prev
            }
            return prev + 1
          })
          setPhase("inhale")
          return 4
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase])

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'mindfulness-breathing',
          gameData: { rounds }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const resetGame = () => {
    setIsActive(false)
    setPhase("inhale")
    setCount(4)
    setRounds(0)
    setShowIntro(true)
    setAnalysis(null)
  }

  if (rounds >= 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🧘</div>
          <h2 className="text-3xl font-bold mb-4">正念练习完成！</h2>

          {isLoadingAnalysis ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">AI 正在分析你的练习...</p>
            </div>
          ) : analysis ? (
            <AIAnalysisResult analysis={analysis} />
          ) : (
            <p className="text-gray-600 mb-6">
              你完成了3轮4-7-8呼吸法。感觉如何？建议每天练习5-10分钟。
            </p>
          )}

          <Button onClick={resetGame} className="w-full">
            再练习一次
          </Button>
        </Card>
      </div>
    )
  }

  if (showIntro) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold mb-2">正念呼吸练习</h2>
            <p className="text-gray-600">
              通过4-7-8呼吸法，放松身心，减轻压力
            </p>
          </div>

          <div className="bg-gradient-bg p-6 rounded-xl mb-6">
            <h4 className="font-bold mb-4">练习方法：</h4>
            <ol className="space-y-2 text-gray-700">
              <li>1. 用鼻子慢慢吸气，默数4秒</li>
              <li>2. 屏住呼吸，默数7秒</li>
              <li>3. 用嘴巴慢慢呼气，默数8秒</li>
              <li>4. 重复3轮</li>
            </ol>
          </div>

          <Button
            onClick={() => {
              setShowIntro(false)
              setIsActive(true)
            }}
            className="w-full"
          >
            开始练习
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <p className="text-gray-600 mb-2">第 {rounds + 1} / 3 轮</p>

        <div className={`
          w-48 h-48 mx-auto mb-6 rounded-full flex items-center justify-center
          transition-all duration-1000
          ${phase === "inhale" ? "bg-primary-100 scale-110" :
            phase === "hold" ? "bg-secondary-100" :
            "bg-accent-green/20 scale-90"}
        `}>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600">{count}</div>
            <div className="text-lg text-gray-600">
              {phase === "inhale" && "吸气"}
              {phase === "hold" && "屏息"}
              {phase === "exhale" && "呼气"}
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {phase === "inhale" && "用鼻子慢慢吸气..."}
          {phase === "hold" && "屏住呼吸..."}
          {phase === "exhale" && "用嘴巴慢慢呼气..."}
        </p>

        <Button
          onClick={() => setIsActive(false)}
          variant="outline"
          className="w-full"
        >
          停止练习
        </Button>
      </Card>
    </div>
  )
}

// ============ 游戏5：价值排序 ============
function ValueRankingGame() {
  const values = [
    { id: 1, name: "家庭", icon: "👨‍👩‍👧‍👦", description: "与家人的关系和时光" },
    { id: 2, name: "事业", icon: "💼", description: "职业成就和发展" },
    { id: 3, name: "健康", icon: "💪", description: "身心健康" },
    { id: 4, name: "自由", icon: "🕊️", description: "自主决策和生活" },
    { id: 5, name: "成长", icon: "📈", description: "个人发展和学习" },
    { id: 6, name: "贡献", icon: "🤝", description: "帮助他人和社会" },
    { id: 7, name: "创造", icon: "🎨", description: "创造性表达" },
    { id: 8, name: "安全", icon: "🛡️", description: "稳定和安全感" }
  ]

  const [rankedValues, setRankedValues] = useState<typeof values>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [comparing, setComparing] = useState<[typeof values[0], typeof values[0]] | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const startGame = () => {
    const shuffled = [...values].sort(() => Math.random() - 0.5)
    setRankedValues([])
    setCurrentStep(0)
    setComparing([shuffled[0], shuffled[1]])
    setShowResult(false)
    setAnalysis(null)
  }

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'value-ranking',
          gameData: { rankedValues }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const handleSelect = (selected: typeof values[0]) => {
    if (!comparing) return

    const newRanked = [...rankedValues, selected]

    // 先更新已排序的值
    setRankedValues(newRanked)

    // 计算剩余的值
    const remaining = values.filter(v => !newRanked.includes(v))
    console.log('已排序:', newRanked.length, '剩余:', remaining.length, '剩余值:', remaining)

    // 如果没有剩余了，显示结果
    if (remaining.length === 0) {
      setShowResult(true)
      fetchAIAnalysis()
      return
    }

    // 如果只剩一个，自动加入并显示结果
    if (remaining.length === 1) {
      setRankedValues([...newRanked, remaining[0]])
      setShowResult(true)
      return
    }

    // 否则，设置下一对比较
    setComparing([remaining[0], remaining[1]])
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">你的价值排序</h2>
          <p className="text-gray-600 mb-6 text-center">
            根据你的选择，这是你的价值观优先级：
          </p>
          <div className="space-y-2">
            {rankedValues.map((value, index) => (
              <div
                key={value.id}
                className={`p-3 rounded-lg flex items-center gap-3 ${
                  index < 3 ? "bg-primary-50 border-2 border-primary-200" :
                  index < 5 ? "bg-gray-50" :
                  "bg-gray-100 opacity-60"
                }`}
              >
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <span className="text-2xl">{value.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{value.name}</p>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              💡 <strong>提示：</strong>这个排序反映了你当前的价值观偏好。
              了解自己的价值观可以帮助你做出更符合内心的决定。
            </p>
          </div>

          {isLoadingAnalysis ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">AI 正在分析你的价值观...</p>
            </div>
          ) : analysis ? (
            <AIAnalysisResult analysis={analysis} />
          ) : null}

          <Button onClick={startGame} className="w-full mt-4">
            <RotateCcw className="w-4 h-4 mr-2" />
            重新测试
          </Button>
        </Card>
      </div>
    )
  }

  if (!comparing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-2xl font-bold mb-2">价值排序</h2>
          <p className="text-gray-600 mb-6">
            通过比较选择，找出你内心真正重视的价值观
          </p>
          <div className="bg-gradient-bg p-4 rounded-xl mb-6 text-left text-sm">
            <p className="mb-2">你会看到8个价值观，两两比较：</p>
            <p>• 每次选择对你来说更重要的一项</p>
            <p>• 最后会根据你的选择排序</p>
          </div>
          <Button onClick={startGame} className="w-full">
            开始测试
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <p className="text-center text-gray-600 mb-6">
          哪一项对你来说更重要？
        </p>
        <div className="grid grid-cols-2 gap-4">
          {comparing.map((value) => (
            <button
              key={value.id}
              onClick={() => handleSelect(value)}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="text-4xl mb-2">{value.icon}</div>
              <p className="font-bold">{value.name}</p>
              <p className="text-sm text-gray-600">{value.description}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============ 游戏6：目标设定 ============
function GoalSettingGame() {
  const [goal, setGoal] = useState("")
  const [steps, setSteps] = useState(["", "", ""])
  const [timeline, setTimeline] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const handleSubmit = () => {
    if (goal && steps.every(s => s.trim()) && timeline) {
      setShowResult(true)
      fetchAIAnalysis()
    }
  }

  const fetchAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch('/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'goal-setting',
          gameData: { goal, steps, timeline }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const resetGame = () => {
    setGoal("")
    setSteps(["", "", ""])
    setTimeline("")
    setShowResult(false)
    setAnalysis(null)
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">你的 SMART 目标</h2>
            <p className="text-gray-600">
              已设定完成！将这个目标保存下来，开始行动吧！
            </p>
          </div>

          {isLoadingAnalysis ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">AI 正在分析你的目标...</p>
            </div>
          ) : analysis ? (
            <AIAnalysisResult analysis={analysis} />
          ) : null}

          <div className="bg-gradient-bg p-6 rounded-xl mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">目标</p>
              <p className="text-lg font-semibold">{goal}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">行动步骤</p>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">{index + 1}.</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">时间线</p>
              <p className="font-semibold">{timeline}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <p className="text-sm text-blue-800">
              💡 <strong>SMART 原则检查：</strong>
              {goal.length > 10 && "✓ 具体"} •
              {timeline.includes("周") || timeline.includes("月") ? "✓ 可衡量" : ""} •
              {steps.every(s => s) ? "✓ 可行" : ""} •
              {goal.includes("我想") || goal.includes("我要") ? "✓ 相关性" : ""}
            </p>
          </div>

          <Button onClick={resetGame} className="w-full">
            设定新目标
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">SMART 目标设定</h2>
          <p className="text-gray-600">
            用 SMART 原则设定清晰、可实现的目标
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              我想要实现... (具体目标)
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例如：在三个月内学会基础吉他弹奏"
              className="w-full h-20 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              实现目标的三个步骤：
            </label>
            {steps.map((step, index) => (
              <input
                key={index}
                type="text"
                value={step}
                onChange={(e) => {
                  const newSteps = [...steps]
                  newSteps[index] = e.target.value
                  setSteps(newSteps)
                }}
                placeholder={`步骤 ${index + 1}`}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none mb-2"
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              时间线 (截止日期)
            </label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="例如：2025年4月30日前"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!goal || !steps.every(s => s.trim()) || !timeline}
          className="w-full mt-6"
        >
          生成目标计划
        </Button>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">SMART 原则：</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• <strong>S</strong>pecific (具体) - 明确要达成什么</li>
            <li>• <strong>M</strong>easurable (可衡量) - 能量化进度</li>
            <li>• <strong>A</strong>chievable (可实现) - 现实可行</li>
            <li>• <strong>R</strong>elevant (相关) - 与你重要的事相关</li>
            <li>• <strong>T</strong>ime-bound (有时限) - 设定截止时间</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

// ============ 主组件 ============
export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = parseInt(params.id as string)

  const game = gamesData[gameId]

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">游戏未找到</h2>
            <Link href="/games">
              <Button>返回游戏列表</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const renderGame = () => {
    switch (game.type) {
      case "emotion-cards":
        return <EmotionCardsGame />
      case "cognitive-reframe":
        return <CognitiveReframeGame />
      case "gratitude-journal":
        return <GratitudeJournalGame />
      case "mindfulness-breathing":
        return <MindfulnessBreathingGame />
      case "value-ranking":
        return <ValueRankingGame />
      case "goal-setting":
        return <GoalSettingGame />
      default:
        return <div>游戏开发中...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* 返回按钮 */}
        <Link href="/games" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          返回游戏列表
        </Link>

        {/* 游戏标题 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{game.icon}</div>
          <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
          <p className="text-gray-600">{game.description}</p>
        </div>

        {/* 游戏内容 */}
        {renderGame()}
      </div>
    </div>
  )
}
