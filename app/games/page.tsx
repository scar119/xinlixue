import Link from "next/link"
import { Gamepad2, Trophy, Users, Clock, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

const games = [
  {
    id: 1,
    title: "情绪卡片",
    description: "识别不同的情绪表达，提升你的情商",
    category: "情绪训练",
    players: "单人",
    duration: "5 分钟",
    difficulty: "简单",
    color: "bg-primary-100 text-primary-700",
    icon: "😊",
  },
  {
    id: 2,
    title: "认知重构",
    description: "学习将消极思维转换为积极思维",
    category: "CBT练习",
    players: "单人",
    duration: "10 分钟",
    difficulty: "中等",
    color: "bg-secondary-100 text-secondary-700",
    icon: "🧠",
  },
  {
    id: 3,
    title: "感恩日记",
    description: "记录每天的三件好事，培养积极心态",
    category: "积极心理学",
    players: "单人",
    duration: "3 分钟",
    difficulty: "简单",
    color: "bg-accent-green/20 text-accent-green",
    icon: "🙏",
  },
  {
    id: 4,
    title: "正念呼吸",
    description: "引导式冥想练习，放松身心",
    category: "正念冥想",
    players: "单人",
    duration: "5 分钟",
    difficulty: "简单",
    color: "bg-purple-100 text-purple-700",
    icon: "🧘",
  },
  {
    id: 5,
    title: "价值排序",
    description: "探索你内心真正重视的东西",
    category: "自我探索",
    players: "单人",
    duration: "8 分钟",
    difficulty: "中等",
    color: "bg-accent-yellow/20 text-accent-yellow",
    icon: "💎",
  },
  {
    id: 6,
    title: "目标设定",
    description: "用 SMART 原则设定和追踪你的目标",
    category: "成长工具",
    players: "单人",
    duration: "15 分钟",
    difficulty: "中等",
    color: "bg-pink-100 text-pink-700",
    icon: "🎯",
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* 导航栏 */}
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            🎮 轻松学心理学
          </div>
          <h1 className="text-4xl font-bold mb-4">心理游戏</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过有趣的互动游戏，在玩乐中学习和实践心理学知识
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <Trophy className="w-8 h-8 text-accent-yellow mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 mb-1">6+</div>
            <div className="text-gray-600">互动游戏</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <Users className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 mb-1">50K+</div>
            <div className="text-gray-600">游戏次数</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow">
            <Clock className="w-8 h-8 text-accent-green mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900 mb-1">5-15</div>
            <div className="text-gray-600">分钟/游戏</div>
          </div>
        </div>

        {/* 游戏列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-xl transition transform hover:translate-y-[-4px] border-gray-200 hover:border-primary-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-4xl`}>{game.icon}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${game.color}`}>
                    {game.difficulty}
                  </span>
                </div>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">类型：</span>
                    <span>{game.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{game.duration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/games/${game.id}`} className="w-full">
                  <Button className="w-full">
                    开始游戏
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 游戏说明 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">为什么要玩心理游戏？</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold mb-2">实践应用</h3>
              <p className="text-gray-600">
                将心理学理论应用到实际场景中，加深理解和记忆
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-4">💪</div>
              <h3 className="text-lg font-bold mb-2">培养习惯</h3>
              <p className="text-gray-600">
                通过游戏化的方式，轻松养成有益的心理健康习惯
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-4">🎉</div>
              <h3 className="text-lg font-bold mb-2">轻松有趣</h3>
              <p className="text-gray-600">
                寓教于乐，让学习心理学变得不再枯燥
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold mb-2">即时反馈</h3>
              <p className="text-gray-600">
                获得即时的反馈和鼓励，增强学习和改变的动机
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
