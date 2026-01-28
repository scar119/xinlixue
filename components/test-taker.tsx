'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Question {
  id: number
  text: string
  type: 'scale' | 'single'
  options: Array<{
    label: string
    text: string
    score?: number
    type?: string
    ageScore?: number
    source?: string
  }>
}

interface TestTakerProps {
  testId: string
  title: string
  questions: Question[]
}

export function TestTaker({ testId, title, questions }: TestTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)

  const currentQ = questions[currentQuestion]
  const selectedAnswer = answers[currentQ.id]
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = selectedAnswer !== undefined

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }))
  }

  const handleNext = async () => {
    if (!canProceed) return

    if (isLastQuestion) {
      // 完成测试，立即开始AI分析
      setIsAnalyzing(true)
      setIsCompleted(true)
      await generateAIAnalysis()
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/test/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testName: title,
          answers: answers,
          questions: questions,
        }),
      })

      const data = await response.json()

      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis.description)
      } else {
        console.error('AI分析失败:', data.error)
      }
    } catch (error) {
      console.error('AI分析请求失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  // 计算总分（用于量表类测试）
  const calculateScore = () => {
    let totalScore = 0
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options.find(opt => opt.label === answer)
      if (option && option.score !== undefined) {
        totalScore += option.score
      }
    })
    return totalScore
  }

  // 获取结果类型（用于趣味测试）
  const getResultType = () => {
    const answerCounts: Record<string, number> = {}
    questions.forEach(q => {
      const answer = answers[q.id]
      const option = q.options.find(opt => opt.label === answer)
      if (option && option.type) {
        answerCounts[option.type] = (answerCounts[option.type] || 0) + 1
      }
    })

    return Object.entries(answerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'
  }

  if (isCompleted) {
    const score = calculateScore()
    const resultType = getResultType()
    const totalQuestions = questions.length
    const answeredQuestions = Object.keys(answers).length

    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">测试完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">感谢你完成《{title}》</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">答题进度</p>
                <p className="text-3xl font-bold text-primary-600">
                  {answeredQuestions} / {totalQuestions}
                </p>
              </div>
              {questions[0].type === 'scale' && score > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                  <p className="text-sm text-gray-600 mb-2">你的得分</p>
                  <p className="text-3xl font-bold text-secondary-600">
                    {score} 分
                  </p>
                </div>
              )}
            </div>

            {/* AI 分析区域 */}
            {isAnalyzing ? (
              <div className="bg-gradient-bg rounded-lg p-8 text-center">
                <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-700 font-medium">AI 正在分析你的测试结果...</p>
                <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟</p>
              </div>
            ) : aiAnalysis ? (
              <div className="bg-gradient-bg rounded-lg p-6 border border-primary-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-xl font-bold text-gray-900">AI 个性化分析报告</h3>
                </div>
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiAnalysis}
                  </ReactMarkdown>
                </div>
              </div>
            ) : null}

            {/* 隐私保护提示 */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                🔒 <strong>隐私保护提示：</strong>为保护用户隐私，本站不记录任何用户测试答案和分析结果。输出的内容只显示一次，刷新后即消失，如有需要记得保存。
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/tests" className="flex-1">
                <Button variant="outline" className="w-full">
                  返回测试列表
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  回到首页
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            问题 {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((Object.keys(answers).length / questions.length) * 100)}% 完成
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedAnswer === option.label

            return (
              <button
                key={option.label}
                onClick={() => handleSelect(option.label)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={isSelected ? 'text-primary-700 font-medium' : ''}>
                    {option.text}
                  </span>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* 导航按钮 */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          上一题
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? '完成测试' : '下一题'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 快速跳转 */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-3">快速跳转：</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined
            const isCurrent = index === currentQuestion

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-primary-500 text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
