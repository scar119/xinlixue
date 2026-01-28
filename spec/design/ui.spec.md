# UI 设计规格书
**项目**: 心理学-AI工具站点
**版本**: v1.0
**日期**: 2025-01-28

---

## 一、设计概述

### 1.1 设计理念

**核心原则**:
1. **温暖** - 色彩柔和，给人安全感
2. **简洁** - 信息清晰，不拥挤
3. **现代** - 符合当下审美趋势
4. **易用** - 3 步完成核心操作

### 1.2 设计灵感

参考 [Kuakua夸夸](https://kuakua.app/zh-CN) 的成功元素：
- ✅ 渐变色彩设计
- ✅ 卡片式布局
- ✅ 居中展示区
- ✅ 现代化字体
- ✅ 流畅的动画效果

### 1.3 设计目标

| 目标 | 说明 |
|------|------|
| **情感连接** | 第一眼就让人感到温暖 |
| **操作简单** | 新用户无需学习 |
| **视觉愉悦** | 现代美观的设计 |
| **品牌记忆** | 独特的视觉识别 |

---

## 二、视觉设计系统

### 2.1 色彩系统

#### 主色调 (Primary Colors)

```css
/* 品牌主色 - 暖橙色 */
--primary-50: #fff7ed;
--primary-100: #ffedd5;
--primary-200: #fed7aa;
--primary-300: #fdba74;
--primary-400: #fb923c;
--primary-500: #f97316;  /* 主色 */
--primary-600: #ea580c;
--primary-700: #c2410c;
--primary-800: #9a3412;
--primary-900: #7c2d12;
```

**使用场景**:
- 主要按钮
- 重要强调
- 品牌识别元素

#### 辅助色 (Secondary Colors)

```css
/* 平静蓝 - 辅助色 */
--secondary-50: #eff6ff;
--secondary-100: #dbeafe;
--secondary-200: #bfdbfe;
--secondary-300: #93c5fd;
--secondary-400: #60a5fa;
--secondary-500: #3b82f6;  /* 辅助色 */
--secondary-600: #2563eb;
--secondary-700: #1d4ed8;
```

**使用场景**:
- 次要按钮
- 信息展示
- 链接文字

#### 点缀色 (Accent Colors)

```css
/* 乐观黄 - 成功/积极 */
--accent-yellow: #fbbf24;

/* 成长绿 - 进步/成就 */
--accent-green: #10b981;

/* 关心红 - 警告/退出 */
--accent-red: #ef4444;
```

#### 中性色 (Neutral Colors)

```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### 2.2 渐变系统

```css
/* 主渐变 - 用于 Hero 区域 */
--gradient-primary: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);

/* 背景渐变 - 用于页面背景 */
--gradient-bg: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);

/* 卡片渐变 - 用于卡片悬停 */
--gradient-card: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%);
```

### 2.3 字体系统

#### 字体家族

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
--font-display: 'Cal Sans', 'Inter', sans-serif;
```

#### 字体大小

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

#### 字重

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.4 间距系统

```css
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

### 2.5 圆角系统

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### 2.6 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

---

## 三、组件设计规范

### 3.1 按钮组件 (Button)

#### 主要按钮 (Primary Button)

```tsx
<Button variant="default" size="md">
  来夸夸我
</Button>
```

**样式规范**:
```css
background: var(--primary-500);
color: white;
padding: 0.75rem 1.5rem;
border-radius: var(--radius-lg);
font-weight: var(--font-semibold);
transition: all 0.2s ease;
```

**悬停状态**:
```css
background: var(--primary-600);
transform: translateY(-2px);
box-shadow: var(--shadow-lg);
```

**尺寸变体**:
- `sm`: padding 0.5rem 1rem, text-sm
- `md`: padding 0.75rem 1.5rem, text-base
- `lg`: padding 1rem 2rem, text-lg

#### 次要按钮 (Secondary Button)

```tsx
<Button variant="secondary" size="md">
  了解更多
</Button>
```

**样式规范**:
```css
background: transparent;
color: var(--secondary-500);
border: 2px solid var(--secondary-500);
```

#### 幽灵按钮 (Ghost Button)

```tsx
<Button variant="ghost" size="md">
  取消
</Button>
```

### 3.2 卡片组件 (Card)

```tsx
<Card>
  <CardHeader>
    <CardTitle>MBTI 性格测试</CardTitle>
    <CardDescription>了解你的真实性格类型</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 内容 */}
  </CardContent>
  <CardFooter>
    <Button>开始测试</Button>
  </CardFooter>
</Card>
```

**样式规范**:
```css
background: white;
border-radius: var(--radius-xl);
padding: var(--spacing-6);
box-shadow: var(--shadow-md);
border: 1px solid var(--gray-100);
transition: all 0.3s ease;
```

**悬停效果**:
```css
box-shadow: var(--shadow-xl);
transform: translateY(-4px);
border-color: var(--primary-200);
```

### 3.3 输入框组件 (Input)

```tsx
<Input
  type="text"
  placeholder="今天想分享什么？"
  multiline
  rows={4}
/>
```

**样式规范**:
```css
background: var(--gray-50);
border: 2px solid var(--gray-200);
border-radius: var(--radius-lg);
padding: var(--spacing-4);
transition: all 0.2s ease;
```

**聚焦状态**:
```css
border-color: var(--primary-400);
box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
outline: none;
```

### 3.4 徽章组件 (Badge)

```tsx
<Badge variant="default">热门</Badge>
<Badge variant="secondary">新测试</Badge>
<Badge variant="premium">会员专享</Badge>
```

**样式规范**:
```css
padding: 0.25rem 0.75rem;
border-radius: var(--radius-full);
font-size: var(--text-xs);
font-weight: var(--font-semibold);
```

### 3.5 头像组件 (Avatar)

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**尺寸变体**:
- `sm`: 32px
- `md`: 40px
- `lg`: 48px
- `xl`: 64px

---

## 四、页面设计

### 4.1 首页设计 (Homepage)

#### 布局结构

```
┌────────────────────────────────────────────────────┐
│                   导航栏                            │
│   [Logo] [首页] [测试] [理论] [登录]               │
├────────────────────────────────────────────────────┤
│                   Hero 区域                        │
│  ┌──────────────────────────────────────────────┐ │
│  │  "用简单心理学与AI工具带来幸福"              │ │
│  │  [来夸夸我] [开始测试]                        │ │
│  └──────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────┤
│                   功能展示                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  夸夸AI  │  │  心理测试│  │  理论知识│        │
│  └──────────┘  └──────────┘  └──────────┘        │
├────────────────────────────────────────────────────┤
│                   社会证明                         │
│  用户评价、使用统计等                               │
├────────────────────────────────────────────────────┤
│                   页脚                             │
└────────────────────────────────────────────────────┘
```

#### Hero 区域设计

```tsx
<section className="hero">
  <div className="container">
    <h1 className="hero-title">
      用简单心理学与AI工具
      <span className="gradient-text">带来幸福</span>
    </h1>
    <p className="hero-description">
      激发内在力量，成为更好的自己
    </p>
    <div className="hero-actions">
      <Button size="lg" variant="default">
        来夸夸我
      </Button>
      <Button size="lg" variant="secondary">
        开始测试
      </Button>
    </div>
  </div>
</section>
```

**样式**:
```css
.hero {
  background: var(--gradient-bg);
  padding: var(--spacing-20) 0;
  text-align: center;
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-6);
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 4.2 夸夸页面设计 (Kuakua Page)

#### 页面布局

```
┌────────────────────────────────────────────────────┐
│   [返回]  夸夸  [保存]                             │
├────────────────────────────────────────────────────┤
│                                                    │
│           ┌──────────────────────┐                │
│           │   "今天想分享什么？" │                │
│           │   [输入框]           │                │
│           │                      │                │
│           │   [提交夸夸]         │                │
│           └──────────────────────┘                │
│                                                    │
│   (提交后显示)                                     │
│   ┌──────────────────────────────────────────┐    │
│   │  ✨ 你其实很棒！                          │    │
│   │                                          │    │
│   │  [AI生成的夸奖内容...]                    │    │
│   │                                          │    │
│   │  [分享] [收藏] [再来一次]                │    │
│   └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

#### 输入状态

```tsx
<div className="kuakua-input">
  <Textarea
    placeholder="今天想分享什么？任何想法、困扰、成就都可以..."
    minRows={6}
    maxLength={500}
    showCount
  />
  <div className="actions">
    <Button variant="ghost">清空</Button>
    <Button size="lg">
      <Sparkles className="mr-2" />
      提交夸夸
    </Button>
  </div>
</div>
```

#### 结果展示动画

```tsx
<div className="kuakua-result animate-in fade-in zoom-in duration-500">
  <div className="result-header">
    <Sparkles className="icon" />
    <h2>你其实很棒！</h2>
  </div>
  <div className="result-content">
    {aiResponse}
  </div>
  <div className="result-actions">
    <Button variant="outline">
      <Share2 className="mr-2" />
      分享
    </Button>
    <Button variant="outline">
      <Bookmark className="mr-2" />
      收藏
    </Button>
    <Button>
      <RefreshCw className="mr-2" />
      再来一次
    </Button>
  </div>
</div>
```

### 4.3 测试列表页设计 (Tests List)

#### 筛选栏

```tsx
<div className="tests-filter">
  <Tabs defaultValue="all">
    <TabsList>
      <TabsTrigger value="all">全部</TabsTrigger>
      <TabsTrigger value="professional">专业测试</TabsTrigger>
      <TabsTrigger value="fun">趣味测试</TabsTrigger>
    </TabsList>
  </Tabs>
  <Input placeholder="搜索测试..." className="search" />
</div>
```

#### 测试卡片网格

```tsx
<div className="tests-grid">
  {tests.map(test => (
    <TestCard key={test.id} test={test} />
  ))}
</div>
```

**网格布局**:
```css
.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

@media (max-width: 768px) {
  .tests-grid {
    grid-template-columns: 1fr;
  }
}
```

### 4.4 测试详情页设计 (Test Detail)

```tsx
<div className="test-detail">
  <div className="test-header">
    <Badge>{test.category}</Badge>
    <h1>{test.title}</h1>
    <p>{test.description}</p>
    <div className="test-meta">
      <span><Clock className="icon" /> {test.duration} 分钟</span>
      <span><Users className="icon" /> {test.takenCount} 人已测</span>
    </div>
  </div>

  <div className="test-intro">
    <h2>测试说明</h2>
    <p>{test.instructions}</p>
  </div>

  <Button size="lg" className="start-btn">
    开始测试
  </Button>
</div>
```

### 4.5 答题页面设计 (Test Taking)

```tsx
<div className="test-taking">
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(current / total) * 100}%` }}
    />
    <span>{current + 1} / {total}</span>
  </div>

  <div className="question-card">
    <h2>{question.text}</h2>
    <div className="options">
      {question.options.map((option, index) => (
        <Button
          key={index}
          variant={selected === index ? "default" : "outline"}
          className="option-btn"
          onClick={() => selectOption(index)}
        >
          {option.label}. {option.text}
        </Button>
      ))}
    </div>
  </div>

  <div className="actions">
    <Button
      variant="ghost"
      onClick={goBack}
      disabled={current === 0}
    >
      上一题
    </Button>
    <Button onClick={goNext}>
      {current === total - 1 ? "提交" : "下一题"}
    </Button>
  </div>
</div>
```

### 4.6 个人中心设计 (Profile)

```tsx
<div className="profile">
  <div className="profile-header">
    <Avatar size="xl" src={user.avatar} />
    <div className="user-info">
      <h2>{user.nickname}</h2>
      <Badge variant={user.subscription}>{subscriptionLabel}</Badge>
    </div>
    <Button variant="outline">
      <Settings className="mr-2" />
      设置
    </Button>
  </div>

  <div className="stats-grid">
    <StatCard
      icon={<Sparkles />}
      label="夸夸次数"
      value={stats.kuakuaCount}
    />
    <StatCard
      icon={<ClipboardList />}
      label="完成测试"
      value={stats.testCount}
    />
    <StatCard
      icon={<Trophy />}
      label="获得成就"
      value={stats.achievementCount}
    />
  </div>

  <Tabs defaultValue="history">
    <TabsList>
      <TabsTrigger value="history">历史记录</TabsTrigger>
      <TabsTrigger value="achievements">我的成就</TabsTrigger>
      <TabsTrigger value="saved">收藏内容</TabsTrigger>
    </TabsList>

    <TabsContent value="history">
      {/* 历史记录列表 */}
    </TabsContent>
  </Tabs>
</div>
```

---

## 五、响应式设计

### 5.1 断点系统

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### 5.2 移动端适配

#### 导航栏

```tsx
/* 桌面端 */
<nav className="hidden md:flex items-center gap-6">
  {/* 桌面导航 */}
</nav>

/* 移动端 */
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent>
    {/* 移动端抽屉导航 */}
  </SheetContent>
</Sheet>
```

#### 卡片网格

```css
.tests-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .tests-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}
```

---

## 六、动画与交互

### 6.1 页面过渡

```tsx
// 使用 Framer Motion
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### 6.2 按钮悬停效果

```css
.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### 6.3 卡片悬停效果

```css
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### 6.4 加载动画

```tsx
<div className="loading-spinner">
  <div className="spinner" />
  <p>AI 正在分析中...</p>
</div>
```

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 七、无障碍设计

### 7.1 颜色对比度

所有文本与背景的对比度符合 WCAG AA 标准：
- 正常文本：至少 4.5:1
- 大文本：至少 3:1

### 7.2 键盘导航

```tsx
// 所有交互元素可键盘访问
<Button
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  按钮
</Button>
```

### 7.3 屏幕阅读器支持

```tsx
// 使用 ARIA 标签
<button aria-label="关闭对话框">
  <X />
</button>

// 语义化 HTML
<nav aria-label="主导航">
  {/* 导航内容 */}
</nav>
```

---

## 八、Tailwind CSS 配置

### 8.1 tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#eff6ff',
          // ...
          500: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
        'gradient-bg': 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

---

## 九、shadcn/ui 组件配置

### 9.1 组件列表

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
```

### 9.2 组件自定义

```tsx
// components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

---

## 十、图标系统

### 10.1 图标库

使用 [Lucide React](https://lucide.dev)

```bash
bun add lucide-react
```

### 10.2 常用图标

```tsx
import {
  Sparkles,    // 夸夸
  ClipboardCheck, // 测试
  BookOpen,    // 理论
  User,        // 用户
  Settings,    // 设置
  Share2,      // 分享
  Bookmark,    // 收藏
  Trophy,      // 成就
  Clock,       // 时间
  Users,       // 人数
  Heart,       // 喜欢
  Menu,        // 菜单
  X,           // 关闭
  ChevronRight, // 箭头
} from 'lucide-react'
```

---

## 十一、设计交付物

### 11.1 设计文件

- [ ] Figma 设计稿
- [ ] 组件库文档
- [ ] 设计 Token 文档
- [ ] 原型演示

### 11.2 开发交付

- [ ] Tailwind 配置文件
- [ ] shadcn/ui 组件
- [ ] 页面模板
- [ ] 响应式断点测试

---

## 十二、下一步

根据 UI 设计规格：

1. **初始化 Next.js 项目**
   ```bash
   bunx create-next-app@latest --typescript --tailwind --app
   ```

2. **安装依赖**
   ```bash
   bun add @radix-ui/react-icons lucide-react framer-motion
   npx shadcn-ui@latest init
   ```

3. **配置 Tailwind**
   - 复制色彩系统
   - 配置字体
   - 设置断点

4. **实现核心页面**
   - 首页
   - 夸夸页面
   - 测试列表页

---

**相关文档**:
- `spec/pm/pr.spec.md` - 产品需求规格书
- `spec/pm/userstory.spec.md` - 用户故事
- `.42cog/cog/cog.md` - 产品认知框架
