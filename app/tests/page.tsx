"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, ArrowRight, ClipboardCheck } from "lucide-react"
import { Loader2 } from "lucide-react"

function TestsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const [testsList, setTestsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch('/api/tests')
        const data = await response.json()
        setTestsList(data.tests || [])
      } catch (error) {
        console.error('Error fetching tests:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTests()
  }, [])

  const filteredTests = testsList.filter(test => {
    if (category === 'all') return true
    if (category === 'professional') return test.category === 'professional'
    if (category === 'fun') return test.category === 'fun'
    return true
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">心理测试</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          通过专业和趣味测试，更好地了解自己。AI 生成个性化分析报告。
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-4 mb-8 justify-center">
        <Link href="/tests">
          <Button
            variant={category === 'all' ? 'default' : 'outline'}
            className="rounded-full"
          >
            全部
          </Button>
        </Link>
        <Link href="/tests?category=professional">
          <Button
            variant={category === 'professional' ? 'default' : 'outline'}
            className="rounded-full"
          >
            专业测试
          </Button>
        </Link>
        <Link href="/tests?category=fun">
          <Button
            variant={category === 'fun' ? 'default' : 'outline'}
            className="rounded-full"
          >
            趣味测试
          </Button>
        </Link>
      </div>

      {/* 测试列表 */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">加载中...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              className="hover:shadow-xl transition transform hover:translate-y-[-4px] border-gray-200 hover:border-primary-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    test.category === 'professional'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {test.category === 'professional' ? '专业测试' : '趣味测试'}
                  </span>
                </div>
                <CardTitle className="text-xl">{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    约 {test.duration} 分钟
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {test.takenCount?.toLocaleString() || 0} 人已测
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/tests/${test.id}`} className="w-full">
                  <Button className="w-full">
                    开始测试
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {filteredTests.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">暂无测试</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center bg-gradient-primary rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">准备好了解自己了吗？</h2>
        <p className="text-lg mb-6 opacity-90">
          选择一个测试开始，每个测试都会生成详细的个性化报告
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tests">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              查看所有测试
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 w-full sm:w-auto">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
      <p className="text-gray-600">加载中...</p>
    </div>
  )
}

export default function TestsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TestsContent />
    </Suspense>
  )
}
