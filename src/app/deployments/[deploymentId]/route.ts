import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { deploymentId } = params
    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)
    
    // Get the requested file path from URL
    const url = new URL(req.url)
    const filePath = url.pathname.replace(`/deployments/${deploymentId}`, '') || '/index.html'
    
    // Clean and secure the file path
    const requestedFile = filePath === '/' ? 'index.html' : filePath.slice(1)
    const fullPath = join(deploymentPath, requestedFile)
    
    // Security check - ensure the file is within the deployment directory
    if (!fullPath.startsWith(deploymentPath)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    if (!existsSync(fullPath)) {
      // Try common fallbacks
      const indexPath = join(deploymentPath, 'index.html')
      const appPath = join(deploymentPath, 'src/app/page.tsx')
      
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath, 'utf8')
        return new NextResponse(content, {
          headers: { 'Content-Type': 'text/html' }
        })
      } else if (existsSync(appPath)) {
        // For React projects, return a basic HTML that loads the app
        const reactHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated React App</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root" class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">🚀 Generated React App</h1>
            <p class="text-lg text-gray-600">Your app has been deployed successfully!</p>
            <div class="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md">
                <h2 class="text-xl font-semibold mb-4">Generated Components</h2>
                <p class="text-gray-600">This is a placeholder. Your actual components are available in the downloaded project files.</p>
            </div>
        </div>
    </div>
</body>
</html>`
        return new NextResponse(reactHtml, {
          headers: { 'Content-Type': 'text/html' }
        })
      }
      
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    // Read and serve the file
    const content = readFileSync(fullPath, 'utf8')
    const extension = requestedFile.split('.').pop()?.toLowerCase()
    
    // Set appropriate content type
    let contentType = 'text/plain'
    switch (extension) {
      case 'html':
        contentType = 'text/html'
        break
      case 'css':
        contentType = 'text/css'
        break
      case 'js':
        contentType = 'application/javascript'
        break
      case 'json':
        contentType = 'application/json'
        break
      case 'tsx':
      case 'jsx':
        contentType = 'text/jsx'
        break
      case 'ts':
        contentType = 'text/typescript'
        break
    }
    
    return new NextResponse(content, {
      headers: { 'Content-Type': contentType }
    })
    
  } catch (error) {
    console.error('Error serving deployment:', error)
    return NextResponse.json(
      { error: 'Failed to serve deployment' },
      { status: 500 }
    )
  }
}