# 心语AI - 全栈配置指南

## 🎉 已完成的工作

### ✅ 第9步：数据库设计
- 数据库 Schema (`src/db/schema.ts`)
- Drizzle ORM 配置
- Neon 数据库连接
- 种子数据脚本

### ✅ 第10步：代码生成
- Server Actions (`app/actions/`)
- API Routes (`app/api/`)
- 认证系统 (`src/lib/auth.ts`)
- AI 集成 (`src/lib/ai/`)

---

## 🚀 下一步：配置和部署

### 1. 配置 Neon 数据库

**获取 Neon 数据库**：

1. 访问 https://neon.tech
2. 点击 "Sign Up" 或 "Sign In"（GitHub 登录最快）
3. 创建新项目：
   - 项目名称：`heartwords-ai`
   - 数据库：PostgreSQL 16
   - 区域：选择离你最近的区域
4. 等待数据库创建
5. 复制数据库连接字符串

**配置环境变量**：

```bash
# 在项目根目录创建 .env.local 文件
cp .env.example .env.local
```

编辑 `.env.local`：

```bash
# 数据库连接字符串（从 Neon 复制）
DATABASE_URL="postgresql://[user]:[password]@[neon-host]/[database]?sslmode=require"

# OpenAI API Key（从 https://platform.openai.com/api-keys 获取）
OPENAI_API_KEY="sk-..."

# AUTH_SECRET（生成一个新的）
openssl rand -base64 32
```

### 2. 推送数据库结构

```bash
cd 心理学-AI工具站点
bun run db:generate
bun run db:migrate
bun run db:seed
```

### 3. 安装所有依赖

```bash
bun install
```

### 4. 启动开发服务器

```bash
bun run dev
```

网站将在 http://localhost:3000 运行

---

## 📁 全栈项目结构

```
心理学-AI工具站点/
├── app/
│   ├── actions/              # Server Actions
│   │   ├── kuakua.ts        # 夸夸功能
│   │   └── auth.ts          # 认证功能
│   ├── api/                 # API Routes
│   │   └── kuakua/
│   │       └── route.ts    # 夸夸 API
│   ├── (pages)              # 页面组件
│   │   ├── page.tsx         # 首页
│   ├── kuakua/              # 夸夸页面（已集成真实API）
│   ├── tests/               # 测试页面
│   ├── login/               # 登录页面
│   └── register/            # 注册页面
│
├── src/
│   ├── db/                  # 数据库
│   │   ├── schema.ts        # 数据库表定义
│   │   ├── index.ts         # 数据库连接
│   │   └── seed.ts          # 种子数据
│   │
│   └── lib/
│       ├── auth.ts          # 认证逻辑（JWT）
│       └── ai/              # AI 服务
│           ├── kuakua.ts    # 夸夸AI
│           └── test.ts      # 测试分析
│
├── components/             # React 组件
├── drizzle.config.ts      # Drizzle 配置
├── .env.example            # 环境变量模板
└── package.json
```

---

## 🔑 核心功能说明

### 夸夸AI 功能
- **用户输入** → **Server Action** → **OpenAI API** → **生成夸奖** → **保存到数据库**
- 支持登录用户保存历史记录
- 情感分析（positive/neutral/negative）

### 用户认证
- **注册**：邮箱 + 密码（bcrypt 加密）
- **登录**：JWT Token（7天有效期）
- **会话管理**：Cookie 存储
- **登出**：清除数据库会话

### 测试分析
- **用户答题** → **OpenAI API** → **生成个性化报告**
- 支持多种测试类型（MBTI、GAD-7 等）

---

## 📊 数据库表结构

| 表名 | 用途 | 主要字段 |
|------|------|----------|
| `users` | 用户信息 | email, password, nickname, subscription |
| `kuakua_logs` | 夸夸记录 | input, response, sentiment, userId |
| `tests` | 测试定义 | title, questions, category, isPremium |
| `test_results` | 测试结果 | userId, testId, answers, result |
| `achievements` | 成就徽章 | name, icon, requirement, xp |
| `user_achievements` | 用户成就关联 | userId, achievementId, unlockedAt |
| `sessions` | 用户会话 | userId, token, expiresAt |

---

## 🎯 使用流程

### 开发环境
1. 复制 `.env.example` 为 `.env.local`
2. 配置 Neon 数据库和 OpenAI API
3. 运行 `bun run db:push` 创建表结构
4. 运行 `bun run db:seed` 填充测试数据
5. `bun run dev` 启动开发服务器

### 用户使用
1. 访问网站，浏览功能
2. 注册账户
3. 使用夸夸AI（需要 OpenAI API Key）
4. 完成心理测试
5. 查看个人中心和成就

---

## 🛠️ 常用命令

```bash
# 开发
bun run dev

# 构建
bun run build

# 生产运行
bun run start

# 数据库
bun run db:generate   # 生成迁移文件
bun run db:migrate    # 推送迁移
bun run db:studio     # 打开 Drizzle Studio
bun run db:seed      # 填充种子数据

# 代码检查
bun run lint
```

---

## 🚀 部署到 Vercel

### 准备工作
1. 推送代码到 GitHub
2. 在 Vercel 导入项目

### 环境变量（在 Vercel 配置）
```
DATABASE_URL=your_neon_database_url
OPENAI_API_KEY=your_openai_api_key
AUTH_SECRET=your_generated_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 部署命令
```bash
vercel deploy
```

---

## 🐛 故障排除

### 问题1：数据库连接失败
```
解决：检查 .env.local 中的 DATABASE_URL 是否正确
```

### 问题2：OpenAI API 调用失败
```
解决：检查 OPENAI_API_KEY 是否正确设置
未配置时会使用模拟数据
```

### 问题3：认证失败
```
解决：清除浏览器 Cookie，重新登录
检查 AUTH_SECRET 是否一致
```

---

## 📝 待完成功能

- [ ] 完善测试功能和 AI 分析
- [ ] 添加游戏功能
- [ ] 实现成就系统
- [ ] 添加支付功能（会员订阅）
- [ ] 添加邮件发送功能
- [ ] 完善个人中心功能

---

**祝你使用愉快！** 🎉
