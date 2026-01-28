# Claude Code 项目配置

## 语言设置

**请始终使用中文回复用户。**

所有与用户的沟通、解释、总结都必须使用中文。代码注释也应优先使用中文（除非是技术术语或已有英文注释）。

---

## 个人开发环境

### 硬件环境
- **设备**: 搭载 Apple 芯片的 Mac 电脑

### 开发工具
- **Node.js 管理**: 通过 [bun](https://bun.sh) 进行安装管理
- **Python 环境**: 通过 [uv](https://github.com/astral-sh/uv) 配置
- **Git 代码托管**: [cnb.cool](https://cnb.cool)

### 代码规范
- 所有新代码使用中文注释
- 遵循项目现有的代码风格
- 优先使用现代 JavaScript/TypeScript 特性

---

## 项目信息

### 项目名称
心理学-AI工具站点

### 项目定位
参考 [Kuakua夸夸](https://kuakua.app/zh-CN) 的成功模式，打造一个"心理学 + AI工具"的互动平台。

**核心理念**: 用简单心理学与AI工具带来幸福，激发内在力量

### 目标用户
- 追求自我提升的人群
- 对心理学感兴趣的用户
- 希望通过AI工具改善心理健康的人

---

## 技术栈

### 前端
- **框架**: Next.js 14+ (App Router)
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **状态管理**: React Hooks / Server Actions

### 后端
- **运行时**: Node.js (通过 bun)
- **数据库**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **认证**: Better Auth

### AI 集成
- **框架**: Vercel AI SDK
- **模型**: 待定（可支持多家AI服务商）

### 部署
- **平台**: EdgeOne
- **节点**: 海外节点（如使用海外API）

---

## 开发指南

### 启动开发服务器
```bash
bun run dev
```

### 数据库迁移
```bash
bun run db:push
```

### 代码规范
- 使用 TypeScript
- 遵循 ESLint 配置
- 提交前运行 `bun run lint`

---

## 项目结构

```
心理学-AI工具站点/
├── .claude/          # Claude Skills 配置
├── .next/           # Next.js 构建输出
├── .42cog/          # 产品认知文档
├── app/             # Next.js App Router
├── components/      # React 组件
├── lib/             # 工具函数
├── public/          # 静态资源
├── spec/            # 项目规格文档
├── src/
│   └── db/          # 数据库相关
└── CLAUDE.md        # 本文件
```
