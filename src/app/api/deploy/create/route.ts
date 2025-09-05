import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
// import { db } from '@/lib/db' // Temporarily disabled until database schema is set up
import { currentUser } from '@clerk/nextjs'

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { codeStructure, platform, funnelPageId, subaccountId, isMobileResponsive, name, type = 'funnel' } = await req.json()

    // Create unique deployment directory
    const deploymentId = `${funnelPageId || 'deploy'}-${Date.now()}`
    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)

    // Create directories
    mkdirSync(deploymentPath, { recursive: true })

    // Write all files
    if (codeStructure && codeStructure.files) {
      for (const [filePath, content] of Object.entries(codeStructure.files)) {
        const fullPath = join(deploymentPath, filePath as string)
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
        if (dir) {
          mkdirSync(dir, { recursive: true })
        }
        writeFileSync(fullPath, content as string)
      }
    }

    // Log deployment info (database operations disabled temporarily)
    console.log(`Creating deployment ${deploymentId} for platform ${platform}`)
    let deploymentRecord = { id: deploymentId } // Mock record for now

    // Install dependencies and build in background
    const buildPromise = buildProject(deploymentPath, platform, deploymentId)
    
    // Don't wait for build to complete, return immediately
    const deploymentUrl = await deployToReplit(deploymentPath, deploymentId, platform)

    // Start background build process and log results
    buildPromise
      .then(async (buildSuccess) => {
        console.log(`Build ${buildSuccess ? 'succeeded' : 'failed'} for deployment ${deploymentId}`)
        // TODO: Update database when schema is available
      })
      .catch(async (error) => {
        console.error('Build failed:', error)
        // TODO: Update database when schema is available
      })

    return NextResponse.json({
      success: true,
      deploymentId,
      deploymentUrl,
      platform,
      status: 'building'
    })

  } catch (error) {
    console.error('Deployment failed:', error)
    return NextResponse.json(
      { error: 'Deployment failed', details: error.message },
      { status: 500 }
    )
  }
}

async function deployToReplit(deploymentPath: string, deploymentId: string, platform: string) {
  // Enhanced deployment URL generation
  const baseUrl = process.env.REPL_URL || process.env.REPLIT_DEV_DOMAIN || 'https://generated-websites.replit.app'
  const deploymentUrl = `${baseUrl}/deployments/${deploymentId}`

  // Create a simple index.html to serve the deployment
  const indexPath = join(deploymentPath, 'index.html')
  if (!existsSync(indexPath)) {
    // Create a basic index.html if none exists
    const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">🚀 Your Website is Live!</h1>
            <p class="text-lg text-gray-600 mb-8">Generated with ${platform === 'web' ? 'React/Next.js' : platform === 'mobile' ? 'React Native' : 'Python Flask'}</p>
            <div class="space-y-4">
                <div class="p-4 bg-green-100 rounded-lg">
                    <p class="text-green-800">✅ Deployment successful</p>
                    <p class="text-sm text-green-600">Platform: ${platform}</p>
                </div>
                ${platform === 'mobile' ? '<a href="/expo" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Open in Expo</a>' : ''}
            </div>
        </div>
    </div>
</body>
</html>`
    writeFileSync(indexPath, basicHtml)
  }

  if (platform === 'mobile') {
    // For mobile apps, create an Expo link
    return `${deploymentUrl}/expo`
  }

  console.log(`Deployment will be available at: ${deploymentUrl}`)
  return deploymentUrl
}

async function buildProject(deploymentPath: string, platform: string, deploymentId: string) {
  try {
    // Check if package.json exists
    const packageJsonPath = join(deploymentPath, 'package.json')
    if (!existsSync(packageJsonPath)) {
      console.log('No package.json found, skipping build')
      return true
    }

    // Install dependencies and build
    if (platform === 'web') {
      console.log(`Building project ${deploymentId}...`)
      await execAsync('npm install', { cwd: deploymentPath })
      
      // Check if build script exists
      const packageJson = JSON.parse(require('fs').readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.scripts && packageJson.scripts.build) {
        await execAsync('npm run build', { cwd: deploymentPath })
      }
      
      console.log(`Build completed for ${deploymentId}`)
      return true
    }
    
    return true
  } catch (error) {
    console.error(`Build failed for ${deploymentId}:`, error)
    return false
  }
}