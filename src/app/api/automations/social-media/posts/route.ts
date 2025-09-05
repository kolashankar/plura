import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subAccountId = searchParams.get('subAccountId')

    // Mock data for social media posts
    const mockPosts = [
      {
        id: '1',
        content: 'Check out our latest product launch! 🚀 #innovation #tech',
        platforms: ['facebook', 'twitter', 'linkedin'],
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'scheduled',
        mediaUrls: []
      },
      {
        id: '2',
        content: 'Behind the scenes of our development process 👨‍💻',
        platforms: ['instagram', 'facebook'],
        scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        status: 'scheduled',
        mediaUrls: []
      },
      {
        id: '3',
        content: 'Thank you for the amazing feedback! We appreciate your support 🙏',
        platforms: ['twitter', 'linkedin'],
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'published',
        mediaUrls: []
      }
    ]

    return NextResponse.json(mockPosts)
  } catch (error) {
    console.error('Error fetching social media posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}