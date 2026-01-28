# 心语AI - 心理学AI工具全栈应用

一个现代化的心理学与AI结合的全栈应用，集成数据库、认证和AI服务。

## 项目概述

**项目定位**: 用简单心理学与AI工具带来幸福，激发内在力量

**核心功能**:
- ✨ 夸夸AI - OpenAI API 集成，真实生成个性化夸奖
- 📋 心理测试 - AI 分析用户答案，生成专业报告
- 🎮 心理游戏 - 互动游戏，寓教于乐
- 📚 理论知识 - 通俗易懂的心理学知识库
- 👤 用户系统 - 注册登录，数据持久化
- 🏆 成就系统 - 游戏化激励机制

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: Radix UI primitives + shadcn/ui
- **图标**: Lucide React
- **动画**: Framer Motion
- **包管理**: Bun

### 后端
- **运行时**: Next.js Server Actions + API Routes
- **数据库**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **认证**: JWT + Cookies
- **密码**: bcrypt 加密

### AI 服务
- **模型**: OpenAI GPT-4o-mini
- **SDK**: OpenAI SDK v6

### 数据库
- **生产**: Neon (PostgreSQL 16)
- **开发**: 本地 PostgreSQL 或 Neon
- **ORM**: Drizzle ORM
- **迁移**: Drizzle Kit

### 部署
- **Vercel** (推荐)
- **EdgeOne** (国内节点)

## 开始使用

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
bun run build
bun run start
```

## 项目结构

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式
│   ├── kuakua/             # 夸夸AI页面
│   ├── tests/              # 心理测试页面
│   ├── games/              # 心理游戏页面
│   ├── theories/           # 理论知识页面
│   ├── profile/            # 个人中心页面
│   ├── login/              # 登录页面
│   └── register/           # 注册页面
├── components/
│   ├── ui/                 # UI 组件库
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   ├── navigation.tsx      # 导航栏组件
│   ├── loading.tsx         # 加载动画
│   └── page-transition.tsx # 页面过渡
├── lib/
│   └── utils.ts            # 工具函数
├── .42cog/                 # 产品认知文档
├── spec/                   # 项目规格文档
├── public/                 # 静态资源
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```

## 设计系统

### 色彩

- **主色**: 暖橙色 (#f97316)
- **辅助色**: 平静蓝 (#3b82f6)
- **点缀色**: 黄色、绿色、红色

### 字体

- **无衬线**: Inter (系统字体栈)

### 组件

基于 shadcn/ui 设计系统的自定义组件

## 页面说明

### 首页 (`/`)
- Hero 区域展示核心价值主张
- 功能展示卡片
- 社会证明统计数据

### 夸夸AI (`/kuakua`)
- 用户输入框（10-500字）
- AI 分析动画效果
- 夸奖结果展示
- 分享和收藏功能

### 心理测试 (`/tests`)
- 测试列表网格
- 分类筛选
- 测试卡片展示
- 会员专享标识

### 心理游戏 (`/games`)
- 游戏列表
- 难度标识
- 时长显示
- 游戏说明

### 理论知识 (`/theories`)
- 知识分类浏览
- 搜索功能
- 文章列表
- 阅读时间显示

### 个人中心 (`/profile`)
- 用户信息展示
- 统计数据
- 成就徽章
- 最近活动

## 特性

### 响应式设计
- 移动端优先
- 断点: 640px, 768px, 1024px, 1280px
- 移动端导航菜单

### 动画效果
- 页面过渡动画
- 卡片悬停效果
- 按钮交互反馈
- 加载动画

### SEO 优化
- 语义化 HTML
- Meta 标签
- 结构化数据
- Sitemap 支持

### 无障碍
- 键盘导航支持
- ARIA 标签
- 屏幕阅读器友好
- 颜色对比度符合 WCAG AA

## 部署

### Vercel

```bash
vercel deploy
```

### EdgeOne

参考 `spec/dev/sys.spec.md` 中的部署配置

## 开发指南

### 添加新页面

1. 在 `app/` 下创建新目录
2. 创建 `page.tsx` 文件
3. 在导航栏中添加链接

### 添加新组件

1. 在 `components/ui/` 下创建组件
2. 使用 shadcn/ui 风格
3. 导出并在页面中使用

### 修改样式

编辑 `tailwind.config.ts` 中的主题配置

## 文档

- [产品需求](spec/pm/pr.spec.md)
- [用户故事](spec/pm/userstory.spec.md)
- [系统架构](spec/dev/sys.spec.md)
- [UI 设计](spec/design/ui.spec.md)
- [产品认知](.42cog/cog/cog.md)

## 许可证

MIT

## 联系方式

项目参考: [Kuakua夸夸](https://kuakua.app/zh-CN)

---

**注意**: 这是一个前端展示网站，不包含后端功能和数据库。
