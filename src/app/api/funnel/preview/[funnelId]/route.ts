import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getFunnel, getFunnelPageDetails } from '@/lib/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: { funnelId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page')
    const isLive = searchParams.get('live') === 'true'
    const isEmbedded = searchParams.get('embedded') === 'true'

    // Fetch funnel data
    const funnelData = await getFunnel(params.funnelId)
    if (!funnelData) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    let pageData = null
    if (pageId) {
      // Get specific page
      pageData = await getFunnelPageDetails(pageId)
    } else {
      // Get the first page (homepage)
      pageData = funnelData.FunnelPages.find(page => !page.pathName) || funnelData.FunnelPages[0]
    }

    if (!pageData) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Generate the HTML for the preview
    const pageContent = pageData.content ? JSON.parse(pageData.content) : []
    const html = generatePreviewHtml(pageContent, funnelData, pageData, isLive, isEmbedded)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': isEmbedded ? 'ALLOWALL' : 'DENY',
      },
    })

  } catch (error) {
    console.error('Error generating funnel preview:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}

function generatePreviewHtml(
  elements: any[],
  funnelData: any,
  pageData: any,
  isLive: boolean,
  isEmbedded: boolean
): string {
  const renderElement = (element: any): string => {
    if (!element) return ''

    const { type, styles = {}, content } = element
    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')

    switch (type) {
      case 'container':
        const children = Array.isArray(content) 
          ? content.map(renderElement).join('') 
          : ''
        return `<div style="${styleString}">${children}</div>`
      
      case 'text':
        return `<p style="${styleString}">${content?.innerText || ''}</p>`
      
      case 'heading':
        const level = content?.level || 1
        return `<h${level} style="${styleString}">${content?.innerText || ''}</h${level}>`
      
      case 'button':
        const href = content?.href || '#'
        return `<a href="${href}" style="${styleString}" class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">${content?.innerText || 'Button'}</a>`
      
      case 'image':
        return `<img src="${content?.src || ''}" alt="${content?.alt || ''}" style="${styleString}" />`
      
      case 'video':
        return `<video src="${content?.src || ''}" controls style="${styleString}"></video>`
      
      case 'link':
        return `<a href="${content?.href || '#'}" style="${styleString}">${content?.innerText || 'Link'}</a>`
      
      case 'divider':
        return `<hr style="${styleString}" />`
      
      default:
        return `<div style="${styleString}">${content?.innerText || ''}</div>`
    }
  }

  const bodyContent = elements.map(renderElement).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.name} - ${funnelData.name}</title>
    <meta name="description" content="${funnelData.description || ''}">
    <link rel="icon" href="${funnelData.favicon || '/favicon.ico'}" type="image/x-icon">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }
        .preview-container {
            min-height: 100vh;
            width: 100%;
        }
        ${isEmbedded ? `
            .preview-container {
                border: none;
                border-radius: 0;
            }
        ` : ''}
        ${isLive ? `
            /* Add live mode specific styles */
            .preview-container {
                position: relative;
            }
            .live-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #10b981;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
            }
        ` : ''}
    </style>
</head>
<body>
    ${isLive && !isEmbedded ? '<div class="live-indicator">● LIVE</div>' : ''}
    <div class="preview-container">
        ${bodyContent}
    </div>
    
    <script>
        // Add basic interactivity for live mode
        ${isLive ? `
            console.log('Funnel preview loaded in live mode');
            
            // Add click tracking for buttons and links
            document.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    console.log('Element clicked:', e.target);
                    // Track interactions in live mode
                }
            });
            
            // Add form submission handling
            document.addEventListener('submit', function(e) {
                console.log('Form submitted:', e.target);
                // Handle form submissions in live mode
            });
        ` : ''}
    </script>
</body>
</html>
  `
}