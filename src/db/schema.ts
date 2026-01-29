import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * 用户表
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  subscriptionType: text('subscription_type').default('free').notNull(), // free, premium
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * 夸夸记录表
 */
export const kuakuaLogs = pgTable('kuakua_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  inputText: text('input_text').notNull(),
  sentiment: text('sentiment'), // positive, neutral, negative
  responseText: text('response_text').notNull(),
  isSaved: boolean('is_saved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * 心理测试表
 */
export const tests = pgTable('tests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // professional, fun
  questions: jsonb('questions').notNull(), // 存储题目和选项
  isPremium: boolean('is_premium').default(false),
  duration: integer('duration'), // 预计分钟数
  takenCount: integer('taken_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * 测试结果表
 */
export const testResults = pgTable('test_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  testId: uuid('test_id').references(() => tests.id, { onDelete: 'cascade' }).notNull(),
  answers: jsonb('answers').notNull(), // 用户答案
  result: jsonb('result').notNull(), // AI 生成的分析结果
  isShared: boolean('is_shared').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * 成就表
 */
export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // emoji 图标
  requirement: text('requirement').notNull(), // 获得条件
  xp: integer('xp').default(0), // 经验值
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * 用户成就关联表
 */
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  achievementId: uuid('achievement_id').references(() => achievements.id, { onDelete: 'cascade' }).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
})

/**
 * 理论知识文章表
 */
export const theories = pgTable('theories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull().unique(),
  description: text('description').notNull(), // 摘要
  content: text('content').notNull(), // Markdown 格式内容
  category: text('category').notNull(), // cognitive, emotional, social, growth 等
  tags: jsonb('tags').$type<string[]>().notNull().default([]), // 标签数组
  readTime: integer('read_time').notNull(), // 阅读时间（分钟）
  viewCount: integer('view_count').default(0),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * 用户会话表 (用于 Better Auth)
 */
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * 关系定义
 */
export const usersRelations = relations(users, ({ many }) => ({
  kuakuaLogs: many(kuakuaLogs),
  testResults: many(testResults),
  userAchievements: many(userAchievements),
  sessions: many(sessions),
}))

export const kuakuaLogsRelations = relations(kuakuaLogs, ({ one }) => ({
  user: one(users, {
    fields: [kuakuaLogs.userId],
    references: [users.id],
  }),
}))

export const testsRelations = relations(tests, ({ many }) => ({
  testResults: many(testResults),
}))

export const testResultsRelations = relations(testResults, ({ one }) => ({
  user: one(users, {
    fields: [testResults.userId],
    references: [users.id],
  }),
  test: one(tests, {
    fields: [testResults.testId],
    references: [tests.id],
  }),
}))

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}))

/**
 * TypeScript 类型定义
 */
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type KuakuaLog = typeof kuakuaLogs.$inferSelect
export type NewKuakuaLog = typeof kuakuaLogs.$inferInsert

export type Test = typeof tests.$inferSelect
export type NewTest = typeof tests.$inferInsert

export type TestResult = typeof testResults.$inferSelect
export type NewTestResult = typeof testResults.$inferInsert

export type Achievement = typeof achievements.$inferSelect
export type NewAchievement = typeof achievements.$inferInsert

export type UserAchievement = typeof userAchievements.$inferSelect
export type NewUserAchievement = typeof userAchievements.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type Theory = typeof theories.$inferSelect
export type NewTheory = typeof theories.$inferInsert
