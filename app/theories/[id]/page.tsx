import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/src/db"
import { theories } from "@/src/db/schema"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { ViewCountTracker } from "@/components/view-count-tracker"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export const dynamic = 'force-dynamic'

interface TheoryPageProps {
  params: {
    id: string
  }
}

async function getTheory(id: string) {
  try {
    const theoryList = await db.select().from(theories)
    const theory = theoryList.find(t => t.id === id)
    return theory || null
  } catch (error) {
    console.error('Error fetching theory:', error)
    return null
  }
}

function getCategoryDisplayName(category: string) {
  const names: Record<string, string> = {
    'cognitive': '认知行为疗法',
    'growth': '积极心理学',
    'emotional': '情绪管理',
    'social': '人际关系',
  }
  return names[category] || category
}

export default async function TheoryPage({ params }: TheoryPageProps) {
  const theory = await getTheory(params.id)

  if (!theory) {
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
              <Link href="/tests" className="text-gray-700 hover:text-primary-600 transition">
                心理测试
              </Link>
              <Link href="/theories" className="text-primary-600 font-medium">
                理论知识
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/theories">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回文章列表
          </Button>
        </Link>

        {/* 文章标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium px-3 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full">
              {getCategoryDisplayName(theory.category)}
            </span>
            {theory.isPremium && (
              <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                会员专享
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{theory.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{theory.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>阅读时间：约 {theory.readTime} 分钟</span>
            </div>
            <ViewCountTracker articleId={theory.id} initialCount={theory.viewCount || 0} />
          </div>
        </div>

        {/* 标签 */}
        {theory.tags && theory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {theory.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 文章内容 */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:text-primary-800 prose-code:text-primary-700 prose-pre:bg-gray-900 prose-code:bg-gray-100">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {theory.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* 相关文章推荐 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>继续学习</CardTitle>
            <CardDescription>探索更多心理学知识</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/tests">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  浏览心理测试
                </Button>
              </Link>
              <Link href="/theories">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  浏览更多文章
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
