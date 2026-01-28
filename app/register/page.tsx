import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 返回首页 */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* 注册卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">创建账户</h1>
            <p className="text-gray-600">开始你的心理成长之旅</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                昵称
              </label>
              <input
                type="text"
                placeholder="怎么称呼你？"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

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
                placeholder="至少8个字符"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                placeholder="再次输入密码"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-gray-300" />
              <label className="text-sm text-gray-600">
                我同意{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  用户协议
                </Link>
                {' '}和{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  隐私政策
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition transform hover:translate-y-[-1px]"
            >
              创建账户
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账户？{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:underline">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
          <p className="text-sm text-blue-800">
            💡 <strong>演示说明：</strong>这是一个前端展示网站，
            暂不支持实际注册功能。
          </p>
        </div>
      </div>
    </div>
  )
}
