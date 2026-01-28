import { cookies } from 'next/headers'
import { db } from '@/src/db/index'
import { users, sessions } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { hash, compare } from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'your-super-secret-key-change-this-in-production'
)

/**
 * 用户会话类型
 */
export interface User {
  id: string
  email: string
  nickname: string | null
  subscriptionType: string
}

/**
 * 当前会话类型
 */
export interface Session {
  user: User
  expires: string
}

/**
 * 创建 JWT Token
 */
async function createToken(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)

  return token
}

/**
 * 验证 JWT Token
 */
async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch (error) {
    return null
  }
}

/**
 * 获取当前会话
 */
export async function auth(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)

  if (!payload || !payload.userId) {
    return null
  }

  // 查询用户信息
  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
  })

  if (!user) {
    return null
  }

  // 检查会话是否过期
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  })

  if (!session || new Date(session.expiresAt) < new Date()) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      subscriptionType: user.subscriptionType,
    },
    expires: session.expiresAt.toISOString(),
  }
}

/**
 * 登录
 */
export async function login(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    return {
      success: false,
      error: '邮箱或密码错误',
    }
  }

  const isValid = await compare(password, user.passwordHash)

  if (!isValid) {
    return {
      success: false,
      error: '邮箱或密码错误',
    }
  }

  // 创建会话
  const token = await createToken({ userId: user.id })
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7天过期

  await db.insert(sessions).values({
    userId: user.id,
    token,
    expiresAt,
  })

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      subscriptionType: user.subscriptionType,
    },
  }
}

/**
 * 注册
 */
export async function register(email: string, password: string, nickname?: string) {
  // 检查邮箱是否已存在
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (existingUser) {
    return {
      success: false,
      error: '该邮箱已被注册',
    }
  }

  // 加密密码
  const passwordHash = await hash(password, 10)

  // 创建用户
  const newUser = await db.insert(users).values({
    email,
    passwordHash,
    nickname: nickname || email.split('@')[0],
    subscriptionType: 'free',
  }).returning()

  // 创建会话
  const token = await createToken({ userId: newUser.id })
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await db.insert(sessions).values({
    userId: newUser.id,
    token,
    expiresAt,
  })

  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      subscriptionType: newUser.subscriptionType,
    },
  }
}

/**
 * 登出
 */
export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (token) {
    // 删除会话
    await db.delete(sessions).where(eq(sessions.token, token))

    // 清除 cookie
    cookieStore.delete('auth-token')
  }

  return { success: true }
}
