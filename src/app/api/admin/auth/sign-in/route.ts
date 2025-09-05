import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SignJWT } from 'jose'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check for the specific admin credentials
    if ((email === 'admin@example.com' && password === 'securepassword123') ||
        (email === 'uno279909@gmail.com' && password === 'Vxv9ikg6@9999')) {
      // Find or create the admin user in database
      let adminUser = await db.user.findUnique({
        where: { email },
      })

      if (!adminUser) {
        // Create the admin user with appropriate details based on email
        const isUnoAdmin = email === 'uno279909@gmail.com'
        adminUser = await db.user.create({
          data: {
            name: isUnoAdmin ? 'Uno Admin' : 'Super Admin',
            email: email,
            avatarUrl: '/assets/admin-avatar.png',
            role: 'AGENCY_ADMIN',
          }
        })
      } else {
        // Update last login
        await db.user.update({
          where: { id: adminUser.id },
          data: { lastLoginAt: new Date() }
        })
      }

      // Create JWT token
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'admin-secret-key')
      const token = await new SignJWT({ 
        userId: adminUser.id, 
        email: adminUser.email,
        role: 'admin',
        isAdmin: true,
        isSuperAdmin: true
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret)

      const response = NextResponse.json({
        success: true,
        message: 'Admin signed in successfully',
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          isAdmin: true,
          isSuperAdmin: true
        }
      })

      // Set HTTP-only cookie
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        sameSite: 'lax'
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Admin sign-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}