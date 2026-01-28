import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpen, ArrowRight, Clock, Eye } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db } from "@/src/db"
import { theories } from "@/src/db/schema"

interface CategoryPageProps {
  params: {
    id: string
  }
}

// 分类映射 - 与 theories/page.tsx 保持一致
const categories = [
  { id: 1, name: "积极心理学", dbCategory: "growth", color: "bg-primary-100 text-primary-700" },
  { id: 2, name: "认知行为疗法", dbCategory: "cognitive", color: "bg-secondary-100 text-secondary-700" },
  { id: 3, name: "情绪管理", dbCategory: "emotional", color: "bg-accent-green/20 text-accent-green" },
  { id: 4, name: "人际关系", dbCategory: "social", color: "bg-accent-yellow/20 text-accent-yellow" },
  { id: 5, name: "自我成长", dbCategory: "growth", color: "bg-purple-100 text-purple-700" },
  { id: 6, name: "压力管理", dbCategory: "emotional", color: "bg-pink-100 text-pink-700" },
]

async function getTheories() {
  try {
    return await db.select().from(theories)
  } catch (error) {
    console.error('Error fetching theories:', error)
    return []
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = parseInt(params.id)
  const category = categories.find(c => c.id === categoryId)

  if (!category) {
    notFound()
  }

  const allTheories = await getTheories()

  // 筛选该分类的文章（包括相同 dbCategory 的文章）
  const filteredTheories = allTheories.filter(theory =>
    theory.category === category.dbCategory
  )

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* 导航栏 */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">心语AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
                首页
              </Link>
              <Link href="/kuakua" className="text-gray-700 hover:text-primary-600 transition">
                夸夸AI
              </Link>
              <Link href="/tests" className="text-gray-700 hover:text-primary-600 transition">
                心理测试
              </Link>
              <Link href="/theories" className="text-primary-600 font-medium">
                理论知识
              </Link>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              登录
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/theories" className="hover:text-primary-600">
            理论知识
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </div>

        {/* 分类标题 */}
        <div className="mb-12">
          <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${category.color}`}>
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <p className="text-xl text-gray-600">
            共 {filteredTheories.length} 篇文章
          </p>
        </div>

        {/* 文章列表 */}
        {filteredTheories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredTheories.map((theory) => (
              <Card
                key={theory.id}
                className="hover:shadow-xl transition transform hover:translate-y-[-2px] border-gray-200 hover:border-primary-200"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">{theory.readTime} 分钟</span>
                  </div>
                  <CardTitle className="text-xl">{theory.title}</CardTitle>
                  <CardDescription>{theory.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{theory.viewCount || 0} 次阅读</span>
                    </div>
                  </div>
                  <Link href={`/theories/${theory.id}`}>
                    <Button variant="ghost" className="w-full group">
                      阅读文章
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:ml-3 transition-all" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                暂无文章
              </h3>
              <p className="text-gray-600 mb-6">
                该分类下还没有文章，敬请期待！
              </p>
              <Link href="/theories">
                <Button>
                  浏览其他分类
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* 返回按钮 */}
        <div className="mt-12 text-center">
          <Link href="/theories">
            <Button variant="outline" size="lg">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              返回文章列表
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
