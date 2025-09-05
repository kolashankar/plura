import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const individualId = searchParams.get('individualId')
    const category = searchParams.get('category')

    if (!individualId) {
      return NextResponse.json({ error: 'Individual ID required' }, { status: 400 })
    }

    // Feature 1: Profile management
    const profile = {
      id: individualId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      avatar: user.imageUrl || '',
      bio: 'Professional web developer and entrepreneur',
      website: 'https://yourwebsite.com',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      language: 'en',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date('2024-01-26'),
      isVerified: true,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/yourprofile',
        twitter: 'https://twitter.com/yourhandle',
        github: 'https://github.com/yourusername'
      }
    }

    // Feature 2: Security settings
    const securitySettings = {
      twoFactorEnabled: true,
      lastPasswordChange: new Date('2024-01-10'),
      activeSessions: [
        {
          id: 'session_1',
          device: 'Chrome on macOS',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          lastActive: new Date('2024-01-26'),
          isCurrent: true
        },
        {
          id: 'session_2',
          device: 'Safari on iPhone',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.101',
          lastActive: new Date('2024-01-25'),
          isCurrent: false
        }
      ],
      loginHistory: [
        {
          timestamp: new Date('2024-01-26T08:00:00Z'),
          location: 'San Francisco, CA',
          device: 'Chrome on macOS',
          success: true
        },
        {
          timestamp: new Date('2024-01-25T18:30:00Z'),
          location: 'San Francisco, CA',
          device: 'Safari on iPhone',
          success: true
        }
      ],
      apiKeys: [
        {
          id: 'key_1',
          name: 'Production API Key',
          lastUsed: new Date('2024-01-26'),
          permissions: ['read', 'write'],
          isActive: true
        },
        {
          id: 'key_2',
          name: 'Development API Key',
          lastUsed: new Date('2024-01-24'),
          permissions: ['read'],
          isActive: true
        }
      ]
    }

    // Feature 3: Preferences and customization
    const preferences = {
      theme: 'dark',
      emailNotifications: {
        projectUpdates: true,
        deploymentAlerts: true,
        securityAlerts: true,
        marketingEmails: false,
        weeklyDigest: true
      },
      dashboardLayout: 'grid',
      defaultProjectType: 'web',
      autoSave: true,
      codeEditor: {
        theme: 'dark',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        lineNumbers: true
      },
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        fontSize: 'medium'
      }
    }

    // Feature 4: Billing and subscription
    const billingInfo = {
      currentPlan: 'Professional',
      planStatus: 'active',
      billingCycle: 'monthly',
      nextBillingDate: new Date('2024-02-26'),
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025
      },
      usageStats: {
        projectsUsed: 8,
        projectsLimit: 50,
        storageUsed: 125, // GB
        storageLimit: 500, // GB
        bandwidthUsed: 45, // GB
        bandwidthLimit: 1000 // GB
      },
      invoiceHistory: [
        {
          id: 'inv_1',
          amount: 49.99,
          status: 'paid',
          date: new Date('2024-01-26'),
          downloadUrl: '/invoices/inv_1.pdf'
        },
        {
          id: 'inv_2',
          amount: 49.99,
          status: 'paid',
          date: new Date('2023-12-26'),
          downloadUrl: '/invoices/inv_2.pdf'
        }
      ]
    }

    // Feature 5: Team and access management
    const teamManagement = {
      teamMembers: [
        {
          id: 'member_1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'Admin',
          permissions: ['read', 'write', 'admin'],
          invitedAt: new Date('2024-01-10'),
          lastActive: new Date('2024-01-26'),
          status: 'active'
        },
        {
          id: 'member_2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'Developer',
          permissions: ['read', 'write'],
          invitedAt: new Date('2024-01-15'),
          lastActive: new Date('2024-01-25'),
          status: 'active'
        }
      ],
      pendingInvitations: [
        {
          id: 'invite_1',
          email: 'carol@example.com',
          role: 'Designer',
          invitedAt: new Date('2024-01-24'),
          expiresAt: new Date('2024-01-31'),
          status: 'pending'
        }
      ],
      roles: [
        {
          id: 'role_1',
          name: 'Admin',
          permissions: ['read', 'write', 'admin', 'billing'],
          memberCount: 1
        },
        {
          id: 'role_2',
          name: 'Developer',
          permissions: ['read', 'write'],
          memberCount: 1
        },
        {
          id: 'role_3',
          name: 'Designer',
          permissions: ['read'],
          memberCount: 0
        }
      ]
    }

    const response: any = { profile }

    if (!category || category === 'security') response.securitySettings = securitySettings
    if (!category || category === 'preferences') response.preferences = preferences
    if (!category || category === 'billing') response.billingInfo = billingInfo
    if (!category || category === 'team') response.teamManagement = teamManagement

    return NextResponse.json(response)

  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { individualId, action, settingsData, securityData, teamData } = await req.json()

    if (!individualId || !action) {
      return NextResponse.json({ error: 'Individual ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'update_profile':
        // Feature 6: Profile updates
        const updatedProfile = {
          ...settingsData,
          updatedAt: new Date(),
          updatedBy: user.id
        }

        return NextResponse.json({
          success: true,
          profile: updatedProfile,
          message: 'Profile updated successfully'
        })

      case 'change_password':
        // Feature 7: Password management
        const { currentPassword, newPassword } = securityData
        
        // In a real implementation, you'd verify the current password
        // and hash the new password before storing
        
        return NextResponse.json({
          success: true,
          passwordChanged: true,
          message: 'Password changed successfully'
        })

      case 'enable_2fa':
        // Feature 8: Two-factor authentication
        const twoFactorSetup = {
          secret: 'JBSWY3DPEHPK3PXP', // In reality, generate a secure secret
          qrCodeUrl: 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp',
          backupCodes: [
            '123456789',
            '987654321',
            '456789123',
            '789123456',
            '321654987'
          ],
          enabled: true,
          enabledAt: new Date()
        }

        return NextResponse.json({
          success: true,
          twoFactor: twoFactorSetup,
          message: 'Two-factor authentication enabled successfully'
        })

      case 'update_preferences':
        // Feature 9: Preferences updates
        return NextResponse.json({
          success: true,
          preferences: settingsData,
          updatedAt: new Date(),
          message: 'Preferences updated successfully'
        })

      case 'invite_team_member':
        // Feature 10: Team member invitation
        const invitation = {
          id: `invite_${Date.now()}`,
          email: teamData.email,
          role: teamData.role,
          permissions: teamData.permissions,
          invitedBy: user.id,
          invitedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'pending'
        }

        return NextResponse.json({
          success: true,
          invitation,
          message: 'Team member invited successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Settings action error:', error)
    return NextResponse.json({ error: 'Failed to process settings action' }, { status: 500 })
  }
}