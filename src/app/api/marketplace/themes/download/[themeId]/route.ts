
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { headers } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId, purchaseId } = await request.json()

    if (!sessionId && !purchaseId) {
      return NextResponse.json(
        { error: 'Session ID or Purchase ID required' },
        { status: 400 }
      )
    }

    // Verify the purchase through Stripe session or direct purchase record
    let isValidPurchase = false
    
    if (sessionId) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        isValidPurchase = session.payment_status === 'paid'
      } catch (error) {
        console.error('Stripe session error:', error)
      }
    }
    
    if (purchaseId) {
      // Check purchase record in database
      const purchase = await db.purchasedTheme.findFirst({
        where: {
          id: purchaseId,
          userId: user.id,
          themeId: params.themeId
        }
      })
      isValidPurchase = !!purchase
    }

    if (!isValidPurchase) {
      return NextResponse.json(
        { error: 'Purchase not verified' },
        { status: 400 }
      )
    }

    // Get theme details
    const theme = await db.marketplaceItem.findUnique({
      where: {
        id: params.themeId,
        type: 'theme'
      }
    })

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      )
    }

    // Update download count
    await db.marketplaceItem.update({
      where: { id: params.themeId },
      data: {
        downloads: {
          increment: 1
        }
      }
    })

    // Create ZIP file with theme assets
    const JSZip = require('jszip')
    const zip = new JSZip()

    // Add theme files (mock structure - replace with actual theme files)
    const themeFiles = {
      'index.html': generateThemeHTML(theme),
      'styles.css': generateThemeCSS(theme),
      'script.js': generateThemeJS(theme),
      'README.md': `# ${theme.name}\n\n${theme.description}\n\nInstallation instructions and usage guide.`
    }

    Object.entries(themeFiles).forEach(([filename, content]) => {
      zip.file(filename, content)
    })

    // Add assets folder
    const assetsFolder = zip.folder('assets')
    assetsFolder.file('placeholder.jpg', 'placeholder image content', { base64: true })

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.zip"`
      }
    })
  } catch (error) {
    console.error('Error downloading theme:', error)
    return NextResponse.json(
      { error: 'Failed to download theme' },
      { status: 500 }
    )
  }
}

function generateThemeHTML(theme: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${theme.name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>${theme.name}</h1>
            <p>${theme.description}</p>
        </header>
        <main>
            <section class="hero">
                <h2>Welcome to ${theme.name}</h2>
                <p>This is a generated theme from the Plura marketplace.</p>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`
}

function generateThemeCSS(theme: any): string {
  return `/* ${theme.name} Theme Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
}

.hero {
    padding: 4rem 2rem;
    text-align: center;
    background: #f8f9fa;
}

.hero h2 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

@media (max-width: 768px) {
    .hero h2 {
        font-size: 2rem;
    }
}`
}

function generateThemeJS(theme: any): string {
  return `// ${theme.name} Theme JavaScript
console.log('${theme.name} theme loaded successfully');

// Add interactive functionality here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme initialized');
});`
}
