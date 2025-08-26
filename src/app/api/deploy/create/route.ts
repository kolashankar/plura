
import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  try {
    const { codeStructure, platform, funnelPageId, subaccountId, isMobileResponsive } = await req.json()
    
    // Create unique deployment directory
    const deploymentId = `${funnelPageId}-${Date.now()}`
    const deploymentPath = join(process.cwd(), 'deployments', deploymentId)
    
    // Create directories
    mkdirSync(deploymentPath, { recursive: true })
    
    // Write all files
    for (const [filePath, content] of Object.entries(codeStructure.files)) {
      const fullPath = join(deploymentPath, filePath as string)
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
      mkdirSync(dir, { recursive: true })
      writeFileSync(fullPath, content as string)
    }
    
    // Install dependencies and build
    if (platform === 'web') {
      await execAsync('npm install', { cwd: deploymentPath })
      await execAsync('npm run build', { cwd: deploymentPath })
    }
    
    // Deploy to Replit hosting
    const deploymentUrl = await deployToReplit(deploymentPath, deploymentId, platform)
    
    // Store deployment info in database
    await storeDeploymentInfo({
      deploymentId,
      funnelPageId,
      subaccountId,
      platform,
      deploymentUrl,
      isMobileResponsive,
      codeStructure
    })
    
    return NextResponse.json({
      success: true,
      deploymentId,
      deploymentUrl,
      platform
    })
    
  } catch (error) {
    console.error('Deployment failed:', error)
    return NextResponse.json(
      { error: 'Deployment failed' },
      { status: 500 }
    )
  }
}

async function deployToReplit(deploymentPath: string, deploymentId: string, platform: string) {
  // Create a simple hosting solution using Replit's static hosting
  const baseUrl = process.env.REPL_URL || 'https://generated-websites.replit.app'
  const deploymentUrl = `${baseUrl}/${deploymentId}`
  
  if (platform === 'mobile') {
    // For mobile apps, create an Expo link
    return `${deploymentUrl}/expo`
  }
  
  return deploymentUrl
}

async function storeDeploymentInfo(info: any) {
  // Store deployment information in your database
  // This would use your existing Prisma setup
  console.log('Storing deployment info:', info)
}
