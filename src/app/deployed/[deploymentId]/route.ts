import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const deploymentId = params.deploymentId
    
    // Get deployment data
    const deployment = await db.deployment.findUnique({
      where: { id: deploymentId }
    })

    if (!deployment) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Deployment Not Found</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p class="text-xl text-gray-700">Deployment not found</p>
          </div>
        </body>
        </html>`,
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    // Get the generated code
    let codeStructure
    try {
      codeStructure = JSON.parse(deployment.codeStructure || '{}')
    } catch {
      codeStructure = {}
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') || deployment.platform || 'web'
    const file = searchParams.get('file')

    // If specific file is requested, return that file
    if (file && codeStructure[platform]) {
      const code = codeStructure[platform]
      return new NextResponse(code, {
        headers: {
          'Content-Type': getContentType(file),
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    // Generate the deployed site HTML
    const html = generateDeployedSiteHtml(deployment, codeStructure, platform)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300'
      }
    })

  } catch (error) {
    console.error('Error serving deployment:', error)
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Server Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-red-50 flex items-center justify-center min-h-screen">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-red-600 mb-4">500</h1>
          <p class="text-xl text-gray-700">Server Error</p>
          <p class="text-gray-600 mt-2">Failed to load deployment</p>
        </div>
      </body>
      </html>`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

function generateDeployedSiteHtml(deployment: any, codeStructure: any, platform: string): string {
  const { name, status, createdAt } = deployment
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Deployed Site</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .deployment-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .code-preview {
            max-height: 500px;
            overflow-y: auto;
            background: #1a1a1a;
            color: #e6e6e6;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .platform-tab {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .platform-tab:hover {
            background: #f3f4f6;
        }
        .platform-tab.active {
            background: #3b82f6;
            color: white;
        }
        .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #10b981;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .status-deployed {
            background: #dcfce7;
            color: #16a34a;
        }
        .status-building {
            background: #fef3c7;
            color: #d97706;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Deployment Header -->
    <div class="deployment-header">
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">${name}</h1>
                    <p class="text-blue-100 mt-1">Generated on ${new Date(createdAt).toLocaleDateString()}</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="live-indicator">
                        <i class="fas fa-circle text-xs"></i>
                        LIVE
                    </div>
                    <div class="status-badge status-${status}">
                        <i class="fas fa-${status === 'deployed' ? 'check' : 'clock'}"></i>
                        ${status.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-6xl mx-auto p-6">
        <!-- Platform Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button class="platform-tab py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium ${platform === 'web' ? 'active' : ''}" 
                            onclick="switchPlatform('web')">
                        <i class="fab fa-react mr-2"></i>
                        React/Next.js
                    </button>
                    <button class="platform-tab py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium ${platform === 'mobile' ? 'active' : ''}" 
                            onclick="switchPlatform('mobile')">
                        <i class="fas fa-mobile-alt mr-2"></i>
                        React Native
                    </button>
                    <button class="platform-tab py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium ${platform === 'python' ? 'active' : ''}" 
                            onclick="switchPlatform('python')">
                        <i class="fab fa-python mr-2"></i>
                        Python/Flask
                    </button>
                </nav>
            </div>
        </div>

        <!-- Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Live Preview -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Live Preview</h2>
                    <p class="text-sm text-gray-600">Interactive preview of your deployed site</p>
                </div>
                <div class="p-4">
                    <div id="preview-container" class="border-2 border-dashed border-gray-200 rounded-lg min-h-[400px] flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-eye text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Live preview will appear here</p>
                            <button onclick="loadPreview()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Load Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Generated Code -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Generated Code</h2>
                    <p class="text-sm text-gray-600">View the generated source code</p>
                </div>
                <div class="p-4">
                    <div id="code-display" class="code-preview">
                        ${codeStructure.react || codeStructure.reactNative || codeStructure.python || '// Loading generated code...'}
                    </div>
                    <div class="mt-4 flex gap-2">
                        <button onclick="downloadCode()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <i class="fas fa-download mr-2"></i>
                            Download Code
                        </button>
                        <button onclick="copyCode()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <i class="fas fa-copy mr-2"></i>
                            Copy Code
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Deployment Info -->
        <div class="bg-white rounded-lg shadow-sm mt-6">
            <div class="p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Deployment Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                        <i class="fas fa-globe text-2xl text-blue-600 mb-2"></i>
                        <h3 class="font-medium text-gray-900">Platform</h3>
                        <p class="text-sm text-gray-600 capitalize">${platform}</p>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <i class="fas fa-calendar text-2xl text-green-600 mb-2"></i>
                        <h3 class="font-medium text-gray-900">Created</h3>
                        <p class="text-sm text-gray-600">${new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <i class="fas fa-code text-2xl text-purple-600 mb-2"></i>
                        <h3 class="font-medium text-gray-900">Type</h3>
                        <p class="text-sm text-gray-600">${deployment.type || 'Website'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const codeStructure = ${JSON.stringify(codeStructure)};
        let currentPlatform = '${platform}';

        function switchPlatform(platform) {
            currentPlatform = platform;
            
            // Update active tab
            document.querySelectorAll('.platform-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.closest('.platform-tab').classList.add('active');
            
            // Update code display
            const codeDisplay = document.getElementById('code-display');
            const code = codeStructure[platform] || '// No code available for this platform';
            codeDisplay.textContent = code;
            
            // Update preview
            loadPreview();
        }

        function loadPreview() {
            const previewContainer = document.getElementById('preview-container');
            
            if (currentPlatform === 'web' && codeStructure.react) {
                previewContainer.innerHTML = \`
                    <iframe 
                        srcdoc="\${codeStructure.react}" 
                        class="w-full h-96 border-0 rounded"
                        sandbox="allow-scripts allow-same-origin">
                    </iframe>
                \`;
            } else if (currentPlatform === 'mobile') {
                previewContainer.innerHTML = \`
                    <div class="text-center">
                        <div class="mx-auto w-64 h-96 bg-black rounded-3xl p-2">
                            <div class="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                                <div class="text-center">
                                    <i class="fas fa-mobile-alt text-4xl text-gray-400 mb-2"></i>
                                    <p class="text-sm text-gray-600">Mobile Preview</p>
                                    <p class="text-xs text-gray-500 mt-1">React Native App</p>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            } else if (currentPlatform === 'python') {
                previewContainer.innerHTML = \`
                    <div class="text-center">
                        <i class="fab fa-python text-6xl text-yellow-500 mb-4"></i>
                        <p class="text-lg font-medium text-gray-900">Flask Backend</p>
                        <p class="text-sm text-gray-600">API endpoints and server-side logic</p>
                    </div>
                \`;
            }
        }

        function downloadCode() {
            const code = codeStructure[currentPlatform] || '';
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${currentPlatform}-code.txt\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function copyCode() {
            const code = codeStructure[currentPlatform] || '';
            navigator.clipboard.writeText(code).then(() => {
                // Show success message
                const button = event.target.closest('button');
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                button.classList.add('bg-green-600');
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('bg-green-600');
                }, 2000);
            });
        }

        // Initialize
        loadPreview();
    </script>
</body>
</html>`
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  const mimeTypes: { [key: string]: string } = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'tsx': 'text/typescript',
    'ts': 'text/typescript',
    'jsx': 'text/javascript',
    'py': 'text/python',
    'txt': 'text/plain'
  }
  
  return mimeTypes[ext || ''] || 'text/plain'
}