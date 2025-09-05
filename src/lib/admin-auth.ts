
// Admin authentication utility
// This provides custom admin authentication separate from Clerk using database credentials

import { jwtVerify, SignJWT } from 'jose'

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  userId: string
  username: string
  role: 'admin'
  exp: number
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'default-secret-change-in-production'
)

// Client-side admin auth functions
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Validate that the payload has the required AdminSession properties
    if (
      payload &&
      typeof payload.userId === 'string' &&
      typeof payload.username === 'string' &&
      payload.role === 'admin' &&
      typeof payload.exp === 'number'
    ) {
      return {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
        exp: payload.exp
      }
    }
    
    return null
  } catch {
    return null
  }
}

export async function createAdminToken(session: Omit<AdminSession, 'exp'>): Promise<string> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)

  return token
}

// Server-side admin auth functions (use these in API routes)
export async function getAdminSessionFromCookies(cookieString?: string): Promise<AdminSession | null> {
  if (typeof window !== 'undefined') {
    // Client-side - get from localStorage or cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin-token='))
      ?.split('=')[1]

    if (!token) return null
    return verifyAdminToken(token)
  }

  // Server-side
  if (!cookieString) return null

  const token = cookieString
    .split('; ')
    .find(row => row.startsWith('admin-token='))
    ?.split('=')[1]

  if (!token) return null
  return verifyAdminToken(token)
}

// Server-side function for layout authentication
export async function verifyAdminSession(): Promise<{ userId: string } | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    if (
      payload &&
      typeof payload.userId === 'string' &&
      payload.role === 'admin'
    ) {
      return { userId: payload.userId }
    }
    
    return null
  } catch {
    return null
  }
}

export async function validateAdminCredentials(credentials: AdminCredentials): Promise<boolean> {
  // In production, this should check against a secure database
  const validCredentials = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }

  return credentials.username === validCredentials.username &&
         credentials.password === validCredentials.password
}

export function setAdminCookie(token: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `admin-token=${token}; path=/; max-age=86400; samesite=strict`
  }
}

export function clearAdminCookie() {
  if (typeof window !== 'undefined') {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }
}
