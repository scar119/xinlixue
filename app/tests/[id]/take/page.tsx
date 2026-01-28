import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/src/db"
import { tests } from "@/src/db/schema"
import { TestTaker } from "@/components/test-taker"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

interface TakeTestPageProps {
  params: {
    id: string
  }
}

async function getTest(id: string) {
  try {
    const testList = await db.select().from(tests)
    const test = testList.find(t => t.id === id)
    return test || null
  } catch (error) {
    console.error('Error fetching test:', error)
    return null
  }
}

export default async function TakeTestPage({ params }: TakeTestPageProps) {
  const test = await getTest(params.id)

  if (!test) {
    notFound()
  }

  const questions = test.questions as any[]

  return (
    <div className="min-h-screen bg-gradient-bg py-12 px-4">
      {/* 导航栏 */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✨</span>
              </div>
              <span className="font-bold text-xl">心语AI</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto">
        {/* 返回按钮 */}
        <Link href={`/tests/${test.id}`} className="inline-block mb-6">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回测试详情
          </Button>
        </Link>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
          <p className="text-gray-600">{test.description}</p>
        </div>

        {/* 测试答题组件 */}
        <TestTaker
          testId={test.id}
          title={test.title}
          questions={questions}
        />
      </div>
    </div>
  )
}
