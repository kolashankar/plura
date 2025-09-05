
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { themeId, subAccountId } = await req.json()

    // Get theme details
    const theme = await db.marketplaceItem.findUnique({
      where: {
        id: themeId,
        type: 'theme'
      }
    })

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    // Verify user has access to subaccount
    const subAccount = await db.subAccount.findFirst({
      where: {
        id: subAccountId,
        Agency: {
          users: {
            some: { id: user.id }
          }
        }
      }
    })

    if (!subAccount) {
      return NextResponse.json({ error: 'Subaccount not found' }, { status: 404 })
    }

    // Create funnel from theme
    const funnel = await db.funnel.create({
      data: {
        name: `${theme.name} Funnel`,
        description: `Imported from ${theme.name} theme`,
        published: false,
        subAccountId,
        favicon: theme.thumbnails || '/favicon.ico'
      }
    })

    // Create pages based on theme structure
    const themePages = [
      { name: 'Home', pathName: 'home', content: generateHomePageFromTheme(theme) },
      { name: 'About', pathName: 'about', content: generateAboutPageFromTheme(theme) },
      { name: 'Contact', pathName: 'contact', content: generateContactPageFromTheme(theme) }
    ]

    for (let i = 0; i < themePages.length; i++) {
      const page = themePages[i]
      await db.funnelPage.create({
        data: {
          name: page.name,
          pathName: page.pathName,
          content: page.content,
          order: i,
          funnelId: funnel.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      funnel: {
        id: funnel.id,
        name: funnel.name
      },
      message: 'Theme imported successfully as funnel'
    })

  } catch (error) {
    console.error('Error importing theme:', error)
    return NextResponse.json(
      { error: 'Failed to import theme' },
      { status: 500 }
    )
  }
}

function generateHomePageFromTheme(theme: any): string {
  return JSON.stringify([
    {
      id: 'hero-section',
      type: 'section',
      content: {
        type: 'container',
        props: {
          className: 'hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20'
        },
        content: [
          {
            type: 'div',
            props: { className: 'text-center' },
            content: [
              {
                type: 'h1',
                props: { className: 'text-4xl font-bold mb-4' },
                content: theme.name
              },
              {
                type: 'p',
                props: { className: 'text-xl mb-8' },
                content: theme.description
              }
            ]
          }
        ]
      }
    }
  ])
}

function generateAboutPageFromTheme(theme: any): string {
  return JSON.stringify([
    {
      id: 'about-section',
      type: 'section',
      content: {
        type: 'container',
        props: {
          className: 'about-section py-16'
        },
        content: [
          {
            type: 'h2',
            props: { className: 'text-3xl font-bold mb-6' },
            content: 'About Us'
          },
          {
            type: 'p',
            props: { className: 'text-lg' },
            content: `Learn more about ${theme.name} and our mission.`
          }
        ]
      }
    }
  ])
}

function generateContactPageFromTheme(theme: any): string {
  return JSON.stringify([
    {
      id: 'contact-section',
      type: 'section',
      content: {
        type: 'container',
        props: {
          className: 'contact-section py-16'
        },
        content: [
          {
            type: 'h2',
            props: { className: 'text-3xl font-bold mb-6' },
            content: 'Contact Us'
          },
          {
            type: 'form',
            props: { className: 'max-w-md mx-auto' },
            content: [
              {
                type: 'input',
                props: { 
                  type: 'text', 
                  placeholder: 'Your Name',
                  className: 'w-full p-3 mb-4 border rounded'
                }
              },
              {
                type: 'input',
                props: { 
                  type: 'email', 
                  placeholder: 'Your Email',
                  className: 'w-full p-3 mb-4 border rounded'
                }
              },
              {
                type: 'textarea',
                props: { 
                  placeholder: 'Your Message',
                  className: 'w-full p-3 mb-4 border rounded h-32'
                }
              },
              {
                type: 'button',
                props: { 
                  className: 'w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600'
                },
                content: 'Send Message'
              }
            ]
          }
        ]
      }
    }
  ])
}
