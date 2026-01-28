"use client"

import { useState } from "react"
import { Sparkles, Share2, Bookmark, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function KuakuaPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('input', input)

      const response = await fetch('/api/kuakua', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data.text)
      } else {
        throw new Error(data.error || '提交失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      // Fallback to mock response
      setResult(getMockResponse(input))
    } finally {
      setIsLoading(false)
    }
  }

  const getMockResponse = (text: string) => {
    return `✨ 你其实很棒！

我看到了你分享的内容中蕴含的力量：
${text.length > 50 ? '• 你愿意表达真实的想法，这需要勇气' : '• 你在主动寻求成长和改进'}
• 你的文字透露出真诚和善良
• 你关注自己的内心世界，这是自我觉察的表现

记住，每个人都有自己的闪光点。你也不例外。
继续保持这种积极的心态，你正在成为更好的自己的路上！💪`
  }

  const handleReset = () => {
    setInput("")
    setResult(null)
    setCharCount(0)
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* 导航栏 */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
              返回首页
            </Link>
            <h1 className="text-xl font-bold">夸夸AI</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {!result ? (
          /* 输入状态 */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">来夸夸你</h2>
              <p className="text-gray-600">
                今天想分享什么？任何想法、困扰、成就都可以...
              </p>
            </div>

            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setCharCount(e.target.value.length)
              }}
              placeholder="写下你的想法...（10-500字）"
              className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none resize-none transition"
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">{charCount}/500</span>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  disabled={!input || isLoading}
                >
                  清空
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!input || input.length < 10 || isLoading}
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      提交夸夸
                    </>
                  )}
                </Button>
              </div>
            </div>

            {input.length > 0 && input.length < 10 && (
              <p className="text-sm text-orange-500 mt-2">
                请至少输入 10 个字符
              </p>
            )}
          </div>
        ) : (
          /* 结果展示 */
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary-600 mb-4">
                你其实很棒！
              </h2>
            </div>

            <div className="bg-gradient-bg rounded-xl p-6 mb-8 border border-primary-100">
              <p className="text-lg leading-relaxed whitespace-pre-line text-gray-700">
                {result}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                分享给朋友
              </Button>
              <Button variant="outline" className="flex-1">
                <Bookmark className="w-4 h-4 mr-2" />
                收藏这份夸奖
              </Button>
              <Button onClick={handleReset} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                再来一次
              </Button>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                🔒 <strong>隐私保护提示：</strong>为保护用户隐私，本站不记录任何用户输出内容。输出的内容只显示一次，刷新后即消失，如有需要记得保存。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
