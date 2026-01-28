import Link from "next/link"
import { ArrowLeft, Trophy, Sparkles, ClipboardCheck, Settings, User, Crown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ProfilePage() {
  const mockUser = {
    nickname: "心理探索者",
    avatar: null,
    subscription: "free",
    stats: {
      kuakuaCount: 23,
      testCount: 5,
      gameCount: 12,
      achievementCount: 7,
    },
    achievements: [
      { id: 1, name: "初来乍到", description: "完成首次夸夸", icon: "🌟", unlocked: true },
      { id: 2, name: "坚持不懈", description: "连续7天使用", icon: "🔥", unlocked: true },
      { id: 3, name: "探索者", description: "完成5个测试", icon: "🧭", unlocked: true },
      { id: 4, name: "知识达人", description: "阅读10篇文章", icon: "📚", unlocked: false },
      { id: 5, name: "游戏高手", description: "完成所有游戏", icon: "🎮", unlocked: false },
      { id: 6, name: "专属会员", description: "升级会员", icon: "👑", unlocked: false },
    ],
    recentActivities: [
      { type: "kuakua", content: "使用了夸夸AI功能", time: "2小时前" },
      { type: "test", content: "完成了 MBTI 性格测试", time: "昨天" },
      { type: "game", content: "玩了 情绪卡片 游戏", time: "2天前" },
      { type: "achievement", content: "获得了 坚持不懈 成就", time: "3天前" },
    ],
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
            <h1 className="text-xl font-bold">个人中心</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl">
                  {mockUser.avatar ? (
                    <img src={mockUser.avatar} alt={mockUser.nickname} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{mockUser.nickname}</h2>
                  <div className="flex items-center gap-2">
                    {mockUser.subscription === "free" ? (
                      <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        免费用户
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        会员
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link href="/settings">
                <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mockUser.stats.kuakuaCount}
              </div>
              <div className="text-sm text-gray-600">夸夸次数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <ClipboardCheck className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mockUser.stats.testCount}
              </div>
              <div className="text-sm text-gray-600">完成测试</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-accent-yellow mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mockUser.stats.achievementCount}
              </div>
              <div className="text-sm text-gray-600">获得成就</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-1">🎮</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mockUser.stats.gameCount}
              </div>
              <div className="text-sm text-gray-600">游戏次数</div>
            </CardContent>
          </Card>
        </div>

        {/* 成就徽章 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">我的成就</CardTitle>
            <CardDescription>
              已解锁 {mockUser.achievements.filter((a) => a.unlocked).length} / {mockUser.achievements.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockUser.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 text-center ${
                    achievement.unlocked
                      ? "border-accent-yellow bg-accent-yellow/10"
                      : "border-gray-200 bg-gray-50 opacity-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm mb-1">{achievement.name}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUser.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {activity.type === "kuakua" && "✨"}
                    {activity.type === "test" && "📋"}
                    {activity.type === "game" && "🎮"}
                    {activity.type === "achievement" && "🏆"}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 升级会员 CTA */}
        {mockUser.subscription === "free" && (
          <Card className="bg-gradient-primary text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6" />
                    <h3 className="text-xl font-bold">升级会员</h3>
                  </div>
                  <p className="text-white/90">
                    解锁无限夸夸、高级测试报告、专属成就等更多权益
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                  立即升级
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
