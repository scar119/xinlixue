import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 返回首页 */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来</h1>
            <p className="text-gray-600">登录你的心语AI账户</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">记住我</span>
              </label>
              <Link href="/forgot-password" className="text-primary-600 hover:underline">
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition transform hover:translate-y-[-1px]"
            >
              登录
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              还没有账户？{' '}
              <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
          <p className="text-sm text-blue-800">
            💡 <strong>演示说明：</strong>这是一个前端展示网站，
            暂不支持实际登录功能。
          </p>
        </div>
      </div>
    </div>
  )
}
