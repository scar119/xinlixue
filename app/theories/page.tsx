import Link from "next/link"
import { BookOpen, ArrowRight, Search, Clock, Eye } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db } from "@/src/db"
import { theories } from "@/src/db/schema"

export const dynamic = 'force-dynamic'

async function getTheories() {
  try {
    return await db.select().from(theories)
  } catch (error) {
    console.error('Error fetching theories:', error)
    return []
  }
}

// 原始的6个分类设计 - 保持丰富性
const categories = [
  { id: 1, name: "积极心理学", count: 24, color: "bg-primary-100 text-primary-700", dbCategory: "growth" },
  { id: 2, name: "认知行为疗法", count: 18, color: "bg-secondary-100 text-secondary-700", dbCategory: "cognitive" },
  { id: 3, name: "情绪管理", count: 15, color: "bg-accent-green/20 text-accent-green", dbCategory: "emotional" },
  { id: 4, name: "人际关系", count: 12, color: "bg-accent-yellow/20 text-accent-yellow", dbCategory: "social" },
  { id: 5, name: "自我成长", count: 20, color: "bg-purple-100 text-purple-700", dbCategory: "growth" },
  { id: 6, name: "压力管理", count: 16, color: "bg-pink-100 text-pink-700", dbCategory: "emotional" },
]

// 根据数据库实际数据更新分类计数（合并相同dbCategory的计数）
function updateCategoryCounts(theoryList: any[]) {
  const dbCountMap = new Map()
  theoryList.forEach(theory => {
    const count = dbCountMap.get(theory.category) || 0
    dbCountMap.set(theory.category, count + 1)
  })

  // 合并相同 dbCategory 的计数
  const mergedCountMap = new Map()
  categories.forEach(cat => {
    const currentCount = mergedCountMap.get(cat.dbCategory) || 0
    const dbCount = dbCountMap.get(cat.dbCategory) || 0
    mergedCountMap.set(cat.dbCategory, Math.max(currentCount, dbCount))
  })

  return categories.map(cat => ({
    ...cat,
    count: mergedCountMap.get(cat.dbCategory) || cat.count
  }))
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

export default async function TheoriesPage() {
  const theoriesList = await getTheories()
  const updatedCategories = updateCategoryCounts(theoriesList)

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
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">心理学理论知识</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通俗易懂的心理学知识，帮助你更好地理解自己和他人
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索心理学知识..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
            />
          </div>
        </div>

        {/* 分类 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">浏览分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {updatedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/theories/category/${category.id}`}
                className="group"
              >
                <div className={`p-4 rounded-xl text-center ${category.color} hover:shadow-lg transition transform hover:translate-y-[-2px]`}>
                  <div className="font-semibold mb-1">{category.name}</div>
                  <div className="text-sm opacity-75">{category.count} 篇文章</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 热门文章 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">热门文章</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {theoriesList.map((theory) => (
              <Card
                key={theory.id}
                className="hover:shadow-xl transition transform hover:translate-y-[-2px] border-gray-200 hover:border-primary-200"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {getCategoryDisplayName(theory.category)}
                    </span>
                    <span className="text-xs text-gray-500">{theory.readTime} 分钟</span>
                  </div>
                  <CardTitle className="text-xl">{theory.title}</CardTitle>
                  <CardDescription>{theory.description}</CardDescription>
                </CardHeader>
                <CardContent>
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
        </section>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-500 to-accent-yellow rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">探索心理学的奥秘</h2>
          <p className="text-lg mb-6 opacity-90">
            每天学一点心理学，让自己和身边的人都受益
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
            开始学习
          </Button>
        </div>
      </div>
    </div>
  )
}
