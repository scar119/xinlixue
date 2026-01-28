import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/src/db"
import { tests } from "@/src/db/schema"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Users, ChevronRight } from "lucide-react"
import { eq as eqImport } from "drizzle-orm"

interface TestPageProps {
  params: {
    id: string
  }
}

async function getTest(id: string) {
  try {
    const testList = await db.select().from(tests).limit(10)
    const test = testList.find(t => t.id === id)
    return test || null
  } catch (error) {
    console.error('Error fetching test:', error)
    return null
  }
}

export default async function TestPage({ params }: TestPageProps) {
  const test = await getTest(params.id)

  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* 导航栏 */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✨</span>
              </div>
              <span className="font-bold text-xl">心语AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
                首页
              </Link>
              <Link href="/tests" className="text-primary-600 font-medium">
                心理测试
              </Link>
              <Link href="/theories" className="text-gray-700 hover:text-primary-600 transition">
                理论知识
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tests">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回测试列表
          </Button>
        </Link>

        {/* 测试信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                {test.category === 'professional' ? '专业测试' : '趣味测试'}
              </span>
              {test.isPremium && (
                <span className="text-sm font-medium px-3 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full">
                  会员专享
                </span>
              )}
            </div>
            <CardTitle className="text-3xl mb-2">{test.title}</CardTitle>
            <CardDescription className="text-base">{test.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>约 {test.duration} 分钟</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{test.takenCount?.toLocaleString() || 0} 人已测</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 测试说明 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>测试说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p>本测试共 {test.questions?.length || 0} 道题目</p>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p>请根据你最近的真实感受回答，不要过度思考</p>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p>测试完成后，AI 将生成详细的分析报告</p>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p>所有答案仅用于生成报告，不会泄露给第三方</p>
            </div>
          </CardContent>
        </Card>

        {/* 开始测试按钮 */}
        <Card className="bg-gradient-primary text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">准备好开始测试了吗？</h3>
            <p className="mb-6 opacity-90">
              找一个安静的环境，放松心情，真实地回答每一个问题
            </p>
            <Link href={`/tests/${test.id}/take`}>
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                开始测试
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
