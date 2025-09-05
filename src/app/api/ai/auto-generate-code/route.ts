import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Pool } from '@neondatabase/serverless'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// Enhanced default prompt template for comprehensive code generation
const ENHANCED_PROMPT_TEMPLATE = `
Generate complete, production-ready, full-stack applications with:
- Advanced folder structure with proper organization (components, pages, utils, hooks, services, etc.)
- Modern UI with icons, animations, and responsive design
- Full functioning backend with APIs, database models, authentication
- Proper error handling, validation, and security measures
- Testing setup and deployment configuration
- Environment configuration and documentation
- Advanced features like state management, caching, optimization
`

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      funnelPageId,
      elements,
      subaccountId,
      individualId,
      componentType,
      componentData
    } = await req.json()

    if (!funnelPageId || !elements) {
      return NextResponse.json(
        { error: 'Funnel page ID and elements are required' },
        { status: 400 }
      )
    }

    // Generate code for all three platforms
    const reactCode = await generateReactCode(elements, componentType, componentData)
    const reactNativeCode = await generateReactNativeCode(elements, componentType, componentData)
    const pythonCode = await generatePythonCode(elements, componentType, componentData)

    // Store generated code in database
    try {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      
      const codeData = {
        funnel_page_id: funnelPageId,
        react_code: reactCode,
        react_native_code: reactNativeCode,
        python_code: pythonCode,
        elements: JSON.stringify(elements),
        metadata: JSON.stringify({
          componentType,
          componentData,
          generatedAt: new Date().toISOString(),
          generatedBy: user.id
        }),
        is_auto_generated: true,
        updated_at: new Date()
      }

      // Check if code already exists for this funnel page
      const existingCode = await pool.query(
        'SELECT id FROM generated_code WHERE funnel_page_id = $1',
        [funnelPageId]
      )

      if (existingCode.rows.length > 0) {
        await pool.query(`
          UPDATE generated_code 
          SET react_code = $1, react_native_code = $2, python_code = $3, 
              elements = $4, metadata = $5, updated_at = $6
          WHERE funnel_page_id = $7
        `, [reactCode, reactNativeCode, pythonCode, JSON.stringify(elements), 
            JSON.stringify(codeData.metadata), new Date(), funnelPageId])
      } else {
        await pool.query(`
          INSERT INTO generated_code 
          (id, funnel_page_id, react_code, react_native_code, python_code, elements, metadata, is_auto_generated, generated_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          funnelPageId, reactCode, reactNativeCode, pythonCode,
          JSON.stringify(elements), JSON.stringify(codeData.metadata),
          true, new Date(), new Date()
        ])
      }

      pool.end()
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Continue with response even if DB save fails
    }

    return NextResponse.json({
      success: true,
      code: {
        react: reactCode,
        reactNative: reactNativeCode,
        python: pythonCode
      },
      message: 'Code generated successfully for all platforms'
    })

  } catch (error) {
    console.error('Auto code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code automatically' },
      { status: 500 }
    )
  }
}

async function generateReactCode(elements: any[], componentType?: string, componentData?: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  const prompt = `
You are an expert React/Next.js developer. Generate a COMPLETE, PRODUCTION-READY full-stack React/Next.js project.

Elements to generate: ${JSON.stringify(elements, null, 2)}
Component Type: ${componentType || 'full-stack application'}
Component Data: ${componentData ? JSON.stringify(componentData, null, 2) : 'N/A'}

${ENHANCED_PROMPT_TEMPLATE}

Generate a COMPLETE project structure with these EXACT folders and files:

📁 PROJECT STRUCTURE:
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── 📁 auth/
│   │   │   ├── 📁 users/
│   │   │   ├── 📁 data/
│   │   │   └── 📁 webhooks/
│   │   ├── 📁 dashboard/
│   │   ├── 📁 auth/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/
│   │   ├── 📁 ui/ (shadcn components)
│   │   ├── 📁 forms/
│   │   ├── 📁 layout/
│   │   ├── 📁 charts/
│   │   └── 📁 custom/
│   ├── 📁 lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── api.ts
│   ├── 📁 hooks/
│   ├── 📁 store/
│   ├── 📁 types/
│   └── 📁 utils/
├── 📁 prisma/
├── 📁 public/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.example
└── README.md

REQUIREMENTS:
1. Use Next.js 14 with App Router
2. TypeScript with strict types
3. Tailwind CSS + shadcn/ui components
4. Prisma ORM with PostgreSQL
5. NextAuth.js for authentication
6. React Hook Form + Zod validation
7. React Query for data fetching
8. Lucide React icons
9. Responsive design with dark mode
10. API routes with proper error handling
11. Database models and migrations
12. Environment configuration
13. SEO optimization
14. Performance optimization
15. Security best practices

Generate COMPLETE, WORKING code for ALL files. No placeholders or TODOs.
`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

async function generateReactNativeCode(elements: any[], componentType?: string, componentData?: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  const prompt = `
You are an expert React Native/Expo developer. Generate a COMPLETE, PRODUCTION-READY mobile app.

Elements to convert: ${JSON.stringify(elements, null, 2)}
Component Type: ${componentType || 'full mobile application'}
Component Data: ${componentData ? JSON.stringify(componentData, null, 2) : 'N/A'}

${ENHANCED_PROMPT_TEMPLATE}

Generate a COMPLETE Expo project structure with these EXACT folders and files:

📱 MOBILE PROJECT STRUCTURE:
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 ui/
│   │   ├── 📁 forms/
│   │   ├── 📁 navigation/
│   │   └── 📁 screens/
│   ├── 📁 screens/
│   │   ├── 📁 auth/
│   │   ├── 📁 main/
│   │   ├── 📁 profile/
│   │   └── 📁 settings/
│   ├── 📁 navigation/
│   ├── 📁 services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── notifications.ts
│   ├── 📁 hooks/
│   ├── 📁 utils/
│   ├── 📁 store/
│   ├── 📁 types/
│   └── 📁 constants/
├── 📁 assets/
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📁 fonts/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
└── .env.example

REQUIREMENTS:
1. Expo SDK 49+ with TypeScript
2. React Navigation 6 (Stack, Tab, Drawer)
3. React Native Elements/NativeBase UI
4. Expo Vector Icons
5. AsyncStorage for local data
6. React Query for API calls
7. React Hook Form + Zod
8. Expo Notifications
9. Expo SecureStore for sensitive data
10. Responsive design for all screen sizes
11. Dark/Light theme support
12. Offline functionality
13. Push notifications setup
14. Deep linking configuration
15. Performance optimizations
16. Security best practices
17. App store ready configuration

Generate COMPLETE, WORKING code for ALL files. No placeholders or TODOs.
`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

async function generatePythonCode(elements: any[], componentType?: string, componentData?: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  const prompt = `
You are an expert Python/Flask developer. Generate a COMPLETE, PRODUCTION-READY Python web application.

Frontend elements to support: ${JSON.stringify(elements, null, 2)}
Component Type: ${componentType || 'full-stack web application'}
Component Data: ${componentData ? JSON.stringify(componentData, null, 2) : 'N/A'}

${ENHANCED_PROMPT_TEMPLATE}

Generate a COMPLETE Flask project structure with these EXACT folders and files:

🐍 PYTHON PROJECT STRUCTURE:
├── 📁 app/
│   ├── 📁 api/
│   │   ├── 📁 v1/
│   │   │   ├── 📁 endpoints/
│   │   │   └── 📁 deps/
│   │   └── __init__.py
│   ├── 📁 core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── database.py
│   │   └── __init__.py
│   ├── 📁 models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── base.py
│   │   └── associations.py
│   ├── 📁 schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── common.py
│   ├── 📁 services/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── email.py
│   ├── 📁 utils/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── email.py
│   │   └── validators.py
│   ├── 📁 templates/
│   │   ├── 📁 auth/
│   │   ├── 📁 dashboard/
│   │   ├── 📁 emails/
│   │   └── base.html
│   ├── 📁 static/
│   │   ├── 📁 css/
│   │   ├── 📁 js/
│   │   └── 📁 images/
│   ├── main.py
│   └── __init__.py
├── 📁 migrations/
├── 📁 tests/
│   ├── 📁 api/
│   ├── 📁 services/
│   ├── conftest.py
│   └── __init__.py
├── 📁 scripts/
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── pytest.ini
├── alembic.ini
└── README.md

REQUIREMENTS:
1. Flask 2.3+ with Blueprint structure
2. SQLAlchemy 2.0+ with Alembic migrations
3. Pydantic for data validation
4. Flask-JWT-Extended for auth
5. Flask-CORS for cross-origin requests
6. Flask-Mail for email functionality
7. Celery for background tasks
8. Redis for caching and sessions
9. PostgreSQL database integration
10. Comprehensive API documentation
11. Unit and integration tests
12. Docker containerization
13. Environment-based configuration
14. Logging and monitoring
15. Security best practices
16. Rate limiting and throttling
17. Database connection pooling
18. Error handling and recovery
19. API versioning
20. Health check endpoints

Generate COMPLETE, WORKING code for ALL files. No placeholders or TODOs.
`

  const result = await model.generateContent(prompt)
  return result.response.text()
}