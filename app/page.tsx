import Link from "next/link";
import { Sparkles, ClipboardCheck, BookOpen, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* 导航栏 */}
      <Navigation />

      {/* Hero 区域 */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            ✨ 用简单心理学与AI工具带来幸福
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            激发内在力量
            <br />
            <span className="bg-gradient-primary text-transparent bg-clip-text">
              成为更好的自己
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            通过AI驱动的心理工具，随时随地获得正向反馈和专业支持。
            简单、有趣、有效。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kuakua"
              className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              来夸夸我
            </Link>
            <Link
              href="/tests"
              className="px-8 py-4 border-2 border-secondary-500 text-secondary-600 rounded-lg font-semibold hover:bg-secondary-50 transition inline-flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-5 h-5" />
              开始测试
            </Link>
          </div>
        </div>
      </section>

      {/* 功能展示 */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">探索我们的功能</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 夸夸AI */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-xl transition transform hover:translate-y-[-4px] group">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition">
                <Sparkles className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">夸夸AI</h3>
              <p className="text-gray-600 mb-4">
                分享你的想法，获得真诚的夸奖和正向反馈。AI会发现你的闪光点。
              </p>
              <Link
                href="/kuakua"
                className="text-primary-600 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                立即体验 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 心理测试 */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-secondary-200 hover:shadow-xl transition transform hover:translate-y-[-4px] group">
              <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary-200 transition">
                <ClipboardCheck className="w-7 h-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">心理测试</h3>
              <p className="text-gray-600 mb-4">
                专业心理测试和趣味性格测试，AI生成个性化分析报告。
              </p>
              <Link
                href="/tests"
                className="text-secondary-600 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                查看测试 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 理论知识 */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-accent-yellow/50 hover:shadow-xl transition transform hover:translate-y-[-4px] group">
              <div className="w-14 h-14 bg-accent-yellow/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-yellow/30 transition">
                <BookOpen className="w-7 h-7 text-accent-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3">理论知识</h3>
              <p className="text-gray-600 mb-4">
                通俗易懂的心理学知识库，帮助你更好地理解自己。
              </p>
              <Link
                href="/theories"
                className="text-accent-yellow font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                开始学习 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 社会证明 */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">活跃用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">50,000+</div>
              <div className="text-gray-600">夸夸次数</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-green mb-2">98%</div>
              <div className="text-gray-600">用户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t py-8 px-4 bg-white">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 心语AI. 用简单心理学与AI工具带来幸福。</p>
        </div>
      </footer>
    </div>
  );
}
