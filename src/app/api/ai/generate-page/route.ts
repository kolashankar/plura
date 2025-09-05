import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 } from 'uuid'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { prompt, subaccountId, currentPage } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const enhancedPrompt = `
You are a web page generator for a funnel builder platform. Create a complete, responsive page layout based on this description: "${prompt}"

Please respond with a JSON object containing an "elements" array with proper editor elements structure.

Each element should have this structure:
{
  "id": "unique-id",
  "type": "container" | "text" | "heading" | "button" | "image" | "video" | "link" | "divider",
  "name": "Element Name",
  "styles": {
    // CSS styles as key-value pairs
    "display": "flex",
    "flexDirection": "column",
    "padding": "20px",
    // ... other styles
  },
  "content": [
    // Nested elements for containers, or content object for leaf elements
  ]
}

For leaf elements (text, heading, button, etc.), use a "content" object instead of array:
{
  "content": {
    "innerText": "Text content here"
  }
}

Requirements:
- Create a full page layout with header, main content sections, and footer
- Use modern, responsive design principles
- Include appropriate padding, margins, and spacing
- Use a professional color scheme
- Make sure all elements are properly nested in containers
- Include call-to-action buttons where appropriate
- Ensure mobile-responsive design
- Create semantic section layouts

Example structure:
{
  "elements": [
    {
      "id": "page-container",
      "type": "container",
      "name": "Page Container",
      "styles": {
        "display": "flex",
        "flexDirection": "column",
        "minHeight": "100vh",
        "width": "100%"
      },
      "content": [
        // Header section
        {
          "id": "header",
          "type": "container",
          "name": "Header",
          "styles": {
            "display": "flex",
            "justifyContent": "space-between",
            "alignItems": "center",
            "padding": "20px 40px",
            "backgroundColor": "#ffffff",
            "borderBottom": "1px solid #e2e8f0"
          },
          "content": [
            // Header elements...
          ]
        },
        // Main content sections...
      ]
    }
  ]
}

Generate a complete, professional page layout now.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // Fallback: create a basic page structure
      return NextResponse.json({
        elements: [{
          id: v4(),
          type: 'container',
          name: 'Generated Page',
          styles: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            padding: '40px',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif'
          },
          content: [
            {
              id: v4(),
              type: 'heading',
              name: 'Main Heading',
              styles: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#1a202c',
                textAlign: 'center'
              },
              content: {
                innerText: 'Generated Page'
              }
            },
            {
              id: v4(),
              type: 'text',
              name: 'Description',
              styles: {
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#4a5568',
                textAlign: 'center',
                marginBottom: '30px'
              },
              content: {
                innerText: `Page generated based on: ${prompt}`
              }
            },
            {
              id: v4(),
              type: 'button',
              name: 'CTA Button',
              styles: {
                backgroundColor: '#3182ce',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                alignSelf: 'center'
              },
              content: {
                innerText: 'Get Started'
              }
            }
          ]
        }]
      })
    }

    const jsonStr = jsonMatch[0]
    let pageData

    try {
      pageData = JSON.parse(jsonStr)
    } catch (parseError) {
      // If JSON parsing fails, create a basic structure
      pageData = {
        elements: [{
          id: v4(),
          type: 'container',
          name: 'Generated Page',
          styles: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            padding: '40px',
            backgroundColor: '#ffffff'
          },
          content: [
            {
              id: v4(),
              type: 'heading',
              name: 'Main Heading',
              styles: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#1a202c'
              },
              content: {
                innerText: 'Generated Page'
              }
            },
            {
              id: v4(),
              type: 'text',
              name: 'Description',
              styles: {
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#4a5568'
              },
              content: {
                innerText: `Page generated for: ${prompt}`
              }
            }
          ]
        }]
      }
    }

    // Ensure all elements have proper IDs
    const processElements = (elements: any[]): any[] => {
      return elements.map(element => ({
        ...element,
        id: element.id || v4(),
        content: Array.isArray(element.content) 
          ? processElements(element.content)
          : element.content
      }))
    }

    if (pageData.elements && Array.isArray(pageData.elements)) {
      pageData.elements = processElements(pageData.elements)
    }

    return NextResponse.json(pageData)
  } catch (error) {
    console.error('Error generating page:', error)
    return NextResponse.json(
      { error: 'Failed to generate page' },
      { status: 500 }
    )
  }
}