import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subaccountId = searchParams.get('subaccountId')
    const userType = searchParams.get('userType') // 'agency' or 'individual'

    if (!subaccountId) {
      return new NextResponse('SubAccount ID is required', { status: 400 })
    }

    // Check if user has access to this subaccount
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        Permissions: {
          where: { subAccountId: subaccountId }
        }
      }
    })

    if (!user || user.Permissions.length === 0) {
      return new NextResponse(JSON.stringify({ 
        message: 'You already have an account under an agency/subaccount. Individual account creation is not allowed.' 
      }), { status: 403 })
    }

    // Build where clause for automation forms
    const where: any = {
      status: 'PUBLISHED', // Only show published forms
      OR: [
        { isPublic: true }, // Public forms
        { 
          AND: [
            { restrictToAgency: true },
            { subAccountId: subaccountId } // Agency forms for this subaccount
          ]
        },
        {
          AND: [
            { restrictToIndividual: false },
            { restrictToAgency: false },
            { isPublic: false },
            { subAccountId: subaccountId } // Private forms for this subaccount
          ]
        }
      ]
    }

    // If user type is individual but they have agency permissions, restrict access
    if (userType === 'individual' && user.Permissions.length > 0) {
      // Check if this is actually an individual trying to create an account
      const isIndividualAttempt = !subaccountId || user.Permissions.every(p => p.subAccountId !== subaccountId)
      
      if (isIndividualAttempt) {
        return new NextResponse(JSON.stringify({ 
          message: 'You already have an account under an agency/subaccount. Individual account creation is not allowed.' 
        }), { status: 403 })
      }
    }

    const forms = await db.automationForm.findMany({
      where,
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      forms,
      total: forms.length
    })

  } catch (error) {
    console.error('Error fetching available automation forms:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}