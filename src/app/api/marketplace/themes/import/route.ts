import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const subaccountId = formData.get('subaccountId') as string
    const themeName = formData.get('themeName') as string

    if (!file || !subaccountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Only ZIP files are supported' }, { status: 400 })
    }

    // Check subaccount access
    const subaccount = await db.subAccount.findUnique({
      where: { id: subaccountId },
      include: {
        Agency: {
          select: { ownerId: true }
        }
      }
    })

    if (!subaccount || subaccount.Agency.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Process ZIP file
    const buffer = await file.arrayBuffer()
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(buffer)
    
    // Extract theme information
    const themeId = `theme-${Date.now()}`
    const themePath = join(process.cwd(), 'imported-themes', themeId)
    mkdirSync(themePath, { recursive: true })

    // Extract files
    const extractedFiles: { [key: string]: string } = {}
    let themeConfig: any = null

    for (const filename in zipContent.files) {
      const file = zipContent.files[filename]
      
      if (!file.dir) {
        const content = await file.async('text')
        const filePath = join(themePath, filename)
        const dir = filePath.substring(0, filePath.lastIndexOf('/'))
        
        if (dir) {
          mkdirSync(dir, { recursive: true })
        }
        
        writeFileSync(filePath, content)
        extractedFiles[filename] = content

        // Look for theme configuration
        if (filename === 'theme.json' || filename === 'package.json') {
          try {
            themeConfig = JSON.parse(content)
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Validate theme structure
    const requiredFiles = ['package.json']
    const hasRequiredFiles = requiredFiles.every(file => 
      Object.keys(extractedFiles).some(f => f.endsWith(file))
    )

    if (!hasRequiredFiles) {
      return NextResponse.json({ 
        error: 'Invalid theme structure. Missing required files.' 
      }, { status: 400 })
    }

    // Create theme record in database
    const theme = await db.theme.create({
      data: {
        id: themeId,
        name: themeName || themeConfig?.name || 'Imported Theme',
        description: themeConfig?.description || 'Imported from ZIP file',
        category: themeConfig?.category || 'Custom',
        preview: themeConfig?.preview || '',
        price: 0,
        isPremium: false,
        isActive: true,
        sellerId: user.id,
        files: JSON.stringify(extractedFiles),
        metadata: JSON.stringify({
          imported: true,
          originalName: file.name,
          subaccountId,
          config: themeConfig
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create a funnel from the theme
    let funnel = null
    try {
      funnel = await db.funnel.create({
        data: {
          id: `funnel-${themeId}`,
          name: `${theme.name} Funnel`,
          description: `Generated from imported theme: ${theme.name}`,
          subDomainName: `${theme.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          published: false,
          subAccountId: subaccountId,
        }
      })

      // Create a default page for the funnel
      await db.funnelPage.create({
        data: {
          name: 'Home',
          pathName: '',
          content: JSON.stringify(generatePageContentFromTheme(extractedFiles)),
          funnelId: funnel.id,
          order: 0
        }
      })
    } catch (dbError) {
      console.error('Error creating funnel:', dbError)
    }

    return NextResponse.json({
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description
      },
      funnel: funnel ? {
        id: funnel.id,
        name: funnel.name
      } : null,
      filesExtracted: Object.keys(extractedFiles).length
    })

  } catch (error) {
    console.error('Theme import failed:', error)
    return NextResponse.json({ 
      error: 'Theme import failed',
      details: error.message 
    }, { status: 500 })
  }
}

function generatePageContentFromTheme(files: { [key: string]: string }): any[] {
  // Extract HTML content and convert to funnel page elements
  const elements: any[] = []
  
  // Look for main HTML files
  const htmlFiles = Object.keys(files).filter(f => f.endsWith('.html') || f.endsWith('.htm'))
  
  if (htmlFiles.length > 0) {
    const mainHtml = files[htmlFiles[0]]
    
    // Basic conversion from HTML to funnel elements
    // This is a simplified version - in production, you'd want more sophisticated parsing
    elements.push({
      id: 'imported-content',
      type: 'text',
      content: mainHtml,
      styles: {
        padding: '20px',
        margin: '10px'
      }
    })
  }

  // Look for CSS files and convert to styles
  const cssFiles = Object.keys(files).filter(f => f.endsWith('.css'))
  if (cssFiles.length > 0) {
    elements.push({
      id: 'imported-styles',
      type: 'custom-css',
      content: files[cssFiles[0]],
      styles: {}
    })
  }

  return elements
}