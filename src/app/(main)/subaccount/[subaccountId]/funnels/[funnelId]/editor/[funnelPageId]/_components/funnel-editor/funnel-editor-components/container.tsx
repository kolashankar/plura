'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import RecursiveElement from './recursive'
import { Trash } from 'lucide-react'

// Function to trigger automatic multi-language code generation
const triggerAutoCodeGeneration = async (element: any, componentType: string, funnelPageId?: string, subaccountId?: string) => {
  try {
    // Get current editor state elements
    const currentElements = JSON.parse(localStorage.getItem('editorElements') || '[]')
    
    // Add the new element to the list
    const updatedElements = [...currentElements, element]
    
    // Update localStorage for persistence
    localStorage.setItem('editorElements', JSON.stringify(updatedElements))
    
    // Generate code for all three platforms in parallel
    const codeGenerationPromises = [
      generateReactCode(componentType, element),
      generateReactNativeCode(componentType, element),
      generatePythonCode(componentType, element)
    ]

    const [reactCode, reactNativeCode, pythonCode] = await Promise.all(codeGenerationPromises)

    // Store multi-platform generated code
    const multiPlatformCode = {
      componentType,
      element,
      platforms: {
        react: reactCode,
        reactNative: reactNativeCode,
        python: pythonCode
      },
      timestamp: new Date().toISOString(),
      funnelPageId: funnelPageId || window.location.pathname.split('/').pop(),
      subaccountId
    }

    // Save to localStorage for immediate access
    localStorage.setItem(`multi-platform-code-${componentType}-${element.id}`, JSON.stringify(multiPlatformCode))

    // Trigger background API call to store in database
    fetch('/api/code-generation/multi-platform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(multiPlatformCode)
    }).catch(error => {
      console.error('Background code generation storage failed:', error)
    })

    console.log(`Multi-platform code generated for ${componentType}:`, multiPlatformCode)
    
  } catch (error) {
    console.error('Failed to trigger auto code generation:', error)
  }
}

// React code generation function
const generateReactCode = async (componentType: string, element: any): Promise<string> => {
  const componentTemplates: Record<string, (element: any) => string> = {
    text: (el) => `import React from 'react';

export default function TextComponent() {
  return (
    <div 
      style={{
        color: '${el.styles?.color || 'black'}',
        fontSize: '${el.styles?.fontSize || '16px'}',
        fontWeight: '${el.styles?.fontWeight || 'normal'}',
        padding: '${el.styles?.padding || '8px'}',
        margin: '${el.styles?.margin || '4px'}'
      }}
    >
      ${el.content?.innerText || 'Text Element'}
    </div>
  );
}`,
    
    button: (el) => `import React from 'react';

export default function ButtonComponent() {
  const handleClick = () => {
    ${el.content?.href ? `window.open('${el.content.href}', '${el.content.target || '_self'}')` : 'console.log("Button clicked")'}
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        backgroundColor: '${el.styles?.backgroundColor || '#007bff'}',
        color: '${el.styles?.color || 'white'}',
        padding: '${el.styles?.padding || '8px 16px'}',
        border: 'none',
        borderRadius: '${el.styles?.borderRadius || '4px'}',
        cursor: 'pointer',
        fontSize: '${el.styles?.fontSize || '14px'}'
      }}
    >
      ${el.content?.innerText || 'Click Me'}
    </button>
  );
}`,

    input: (el) => `import React, { useState } from 'react';

export default function InputComponent() {
  const [value, setValue] = useState('');

  return (
    <div style={{ margin: '${el.styles?.margin || '8px'}' }}>
      ${el.content?.label ? `<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
        ${el.content.label}${el.content?.required ? ' *' : ''}
      </label>` : ''}
      <input
        type="${el.content?.type || 'text'}"
        placeholder="${el.content?.placeholder || 'Enter text...'}"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={${el.content?.required || false}}
        style={{
          width: '100%',
          padding: '${el.styles?.padding || '8px'}',
          border: '1px solid #ccc',
          borderRadius: '${el.styles?.borderRadius || '4px'}',
          fontSize: '${el.styles?.fontSize || '14px'}'
        }}
      />
    </div>
  );
}`,

    image: (el) => `import React from 'react';

export default function ImageComponent() {
  return (
    <div style={{ margin: '${el.styles?.margin || '8px'}' }}>
      ${el.content?.src ? `
      <img 
        src="${el.content.src}"
        alt="${el.content?.alt || 'Image'}"
        style={{
          width: '${el.styles?.width || '100%'}',
          height: '${el.styles?.height || 'auto'}',
          borderRadius: '${el.styles?.borderRadius || '0'}',
          objectFit: 'cover'
        }}
      />` : `
      <div style={{
        width: '${el.styles?.width || '400px'}',
        height: '${el.styles?.height || '300px'}',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      }}>
        <span style={{ color: '#666' }}>No image selected</span>
      </div>`}
    </div>
  );
}`,

    video: (el) => `import React from 'react';

export default function VideoComponent() {
  return (
    <div style={{ margin: '${el.styles?.margin || '8px'}' }}>
      <iframe
        src="${el.content?.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}"
        width="${el.styles?.width || '560'}"
        height="${el.styles?.height || '315'}"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          borderRadius: '${el.styles?.borderRadius || '8px'}',
          maxWidth: '100%'
        }}
      />
    </div>
  );
}`,

    container: (el) => `import React from 'react';

export default function ContainerComponent({ children }: { children?: React.ReactNode }) {
  return (
    <div 
      style={{
        padding: '${el.styles?.padding || '16px'}',
        margin: '${el.styles?.margin || '8px'}',
        backgroundColor: '${el.styles?.backgroundColor || 'transparent'}',
        border: '${el.styles?.border || 'none'}',
        borderRadius: '${el.styles?.borderRadius || '0'}',
        minHeight: '${el.styles?.minHeight || '100px'}',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {children}
    </div>
  );
}`
  }

  const template = componentTemplates[componentType] || componentTemplates.text
  return template(element)
}

// React Native code generation function
const generateReactNativeCode = async (componentType: string, element: any): Promise<string> => {
  const componentTemplates: Record<string, (element: any) => string> = {
    text: (el) => `import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TextComponent() {
  return (
    <Text style={[styles.text, {
      color: '${el.styles?.color || '#000'}',
      fontSize: ${parseInt(el.styles?.fontSize) || 16},
      fontWeight: '${el.styles?.fontWeight || 'normal'}',
    }]}>
      ${el.content?.innerText || 'Text Element'}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 8,
    margin: 4,
  },
});`,

    button: (el) => `import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

export default function ButtonComponent() {
  const handlePress = () => {
    ${el.content?.href ? `Linking.openURL('${el.content.href}')` : 'console.log("Button pressed")'};
  };

  return (
    <TouchableOpacity style={[styles.button, {
      backgroundColor: '${el.styles?.backgroundColor || '#007bff'}',
    }]} onPress={handlePress}>
      <Text style={[styles.buttonText, {
        color: '${el.styles?.color || '#fff'}',
        fontSize: ${parseInt(el.styles?.fontSize) || 14},
      }]}>
        ${el.content?.innerText || 'Click Me'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    margin: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});`,

    input: (el) => `import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function InputComponent() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      ${el.content?.label ? `<Text style={styles.label}>${el.content.label}${el.content?.required ? ' *' : ''}</Text>` : ''}
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="${el.content?.placeholder || 'Enter text...'}"
        keyboardType="${el.content?.type === 'email' ? 'email-address' : el.content?.type === 'number' ? 'numeric' : 'default'}"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});`,

    image: (el) => `import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function ImageComponent() {
  return (
    <View style={styles.container}>
      ${el.content?.src ? `
      <Image 
        source={{ uri: '${el.content.src}' }}
        style={[styles.image, {
          width: ${parseInt(el.styles?.width) || 300},
          height: ${parseInt(el.styles?.height) || 200},
        }]}
        resizeMode="cover"
      />` : `
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>No image selected</Text>
      </View>`}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  image: {
    borderRadius: 8,
  },
  placeholder: {
    width: 300,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});`,

    video: (el) => `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoComponent() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: '${el.content?.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}' }}
        style={[styles.video, {
          width: ${parseInt(el.styles?.width) || 350},
          height: ${parseInt(el.styles?.height) || 200},
        }]}
        allowsFullscreenVideo={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  video: {
    borderRadius: 8,
  },
});`,

    container: (el) => `import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ContainerComponent({ children }: { children?: React.ReactNode }) {
  return (
    <View style={[styles.container, {
      backgroundColor: '${el.styles?.backgroundColor || 'transparent'}',
      padding: ${parseInt(el.styles?.padding) || 16},
      margin: ${parseInt(el.styles?.margin) || 8},
      borderRadius: ${parseInt(el.styles?.borderRadius) || 0},
      minHeight: ${parseInt(el.styles?.minHeight) || 100},
    }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});`
  }

  const template = componentTemplates[componentType] || componentTemplates.text
  return template(element)
}

// Python Flask code generation function
const generatePythonCode = async (componentType: string, element: any): Promise<string> => {
  const componentTemplates: Record<string, (element: any) => string> = {
    text: (el) => `<!-- Text Component Template -->
<div class="text-component" style="
    color: ${el.styles?.color || '#000'};
    font-size: ${el.styles?.fontSize || '16px'};
    font-weight: ${el.styles?.fontWeight || 'normal'};
    padding: ${el.styles?.padding || '8px'};
    margin: ${el.styles?.margin || '4px'};
">
    ${el.content?.innerText || 'Text Element'}
</div>

<!-- Python Flask Route -->
@app.route('/text-component')
def text_component():
    data = {
        'text': '${el.content?.innerText || 'Text Element'}',
        'styles': {
            'color': '${el.styles?.color || '#000'}',
            'fontSize': '${el.styles?.fontSize || '16px'}',
            'fontWeight': '${el.styles?.fontWeight || 'normal'}'
        }
    }
    return render_template('text_component.html', **data)`,

    button: (el) => `<!-- Button Component Template -->
<button class="button-component" 
        onclick="${el.content?.href ? `window.open('${el.content.href}', '${el.content.target || '_self'}')` : 'handleClick()'}"
        style="
            background-color: ${el.styles?.backgroundColor || '#007bff'};
            color: ${el.styles?.color || '#fff'};
            padding: ${el.styles?.padding || '8px 16px'};
            border: none;
            border-radius: ${el.styles?.borderRadius || '4px'};
            cursor: pointer;
            font-size: ${el.styles?.fontSize || '14px'};
        ">
    ${el.content?.innerText || 'Click Me'}
</button>

<script>
function handleClick() {
    fetch('/api/button-click', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'button_clicked'})
    });
}
</script>

<!-- Python Flask Route -->
@app.route('/button-component')
def button_component():
    data = {
        'text': '${el.content?.innerText || 'Click Me'}',
        'href': '${el.content?.href || '#'}',
        'styles': {
            'backgroundColor': '${el.styles?.backgroundColor || '#007bff'}',
            'color': '${el.styles?.color || '#fff'}'
        }
    }
    return render_template('button_component.html', **data)

@app.route('/api/button-click', methods=['POST'])
def button_click():
    data = request.get_json()
    # Handle button click logic here
    return jsonify({'status': 'success', 'message': 'Button clicked'})`,

    input: (el) => `<!-- Input Component Template -->
<div class="input-component" style="margin: ${el.styles?.margin || '8px'};">
    ${el.content?.label ? `<label style="display: block; margin-bottom: 4px; font-weight: bold;">
        ${el.content.label}${el.content?.required ? ' *' : ''}
    </label>` : ''}
    <input type="${el.content?.type || 'text'}"
           name="${el.content?.name || 'input_field'}"
           placeholder="${el.content?.placeholder || 'Enter text...'}"
           ${el.content?.required ? 'required' : ''}
           style="
               width: 100%;
               padding: ${el.styles?.padding || '8px'};
               border: 1px solid #ccc;
               border-radius: ${el.styles?.borderRadius || '4px'};
               font-size: ${el.styles?.fontSize || '14px'};
           ">
</div>

<!-- Python Flask Route -->
@app.route('/input-component')
def input_component():
    data = {
        'label': '${el.content?.label || ''}',
        'type': '${el.content?.type || 'text'}',
        'placeholder': '${el.content?.placeholder || 'Enter text...'}',
        'required': ${el.content?.required || false},
        'styles': {
            'padding': '${el.styles?.padding || '8px'}',
            'fontSize': '${el.styles?.fontSize || '14px'}'
        }
    }
    return render_template('input_component.html', **data)

@app.route('/api/form-submit', methods=['POST'])
def form_submit():
    field_value = request.form.get('${el.content?.name || 'input_field'}')
    # Process form data here
    return jsonify({'status': 'success', 'value': field_value})`,

    image: (el) => `<!-- Image Component Template -->
<div class="image-component" style="margin: ${el.styles?.margin || '8px'};">
    ${el.content?.src ? `
    <img src="${el.content.src}"
         alt="${el.content?.alt || 'Image'}"
         style="
             width: ${el.styles?.width || '100%'};
             height: ${el.styles?.height || 'auto'};
             border-radius: ${el.styles?.borderRadius || '0'};
             object-fit: cover;
         ">` : `
    <div style="
        width: ${el.styles?.width || '400px'};
        height: ${el.styles?.height || '300px'};
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    ">
        <span style="color: #666;">No image selected</span>
    </div>`}
</div>

<!-- Python Flask Route -->
@app.route('/image-component')
def image_component():
    data = {
        'src': '${el.content?.src || ''}',
        'alt': '${el.content?.alt || 'Image'}',
        'styles': {
            'width': '${el.styles?.width || '100%'}',
            'height': '${el.styles?.height || 'auto'}'
        }
    }
    return render_template('image_component.html', **data)`,

    video: (el) => `<!-- Video Component Template -->
<div class="video-component" style="margin: ${el.styles?.margin || '8px'};">
    <iframe src="${el.content?.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}"
            width="${el.styles?.width || '560'}"
            height="${el.styles?.height || '315'}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="border-radius: ${el.styles?.borderRadius || '8px'}; max-width: 100%;">
    </iframe>
</div>

<!-- Python Flask Route -->
@app.route('/video-component')
def video_component():
    data = {
        'src': '${el.content?.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}',
        'width': '${el.styles?.width || '560'}',
        'height': '${el.styles?.height || '315'}'
    }
    return render_template('video_component.html', **data)`,

    container: (el) => `<!-- Container Component Template -->
<div class="container-component" style="
    padding: ${el.styles?.padding || '16px'};
    margin: ${el.styles?.margin || '8px'};
    background-color: ${el.styles?.backgroundColor || 'transparent'};
    border: ${el.styles?.border || 'none'};
    border-radius: ${el.styles?.borderRadius || '0'};
    min-height: ${el.styles?.minHeight || '100px'};
    display: flex;
    flex-direction: column;
    gap: 8px;
">
    {% for child in children %}
        {{ child | safe }}
    {% endfor %}
</div>

<!-- Python Flask Route -->
@app.route('/container-component')
def container_component():
    data = {
        'styles': {
            'padding': '${el.styles?.padding || '16px'}',
            'backgroundColor': '${el.styles?.backgroundColor || 'transparent'}',
            'borderRadius': '${el.styles?.borderRadius || '0'}'
        },
        'children': []  # Child components would be populated here
    }
    return render_template('container_component.html', **data)`
  }

  const template = componentTemplates[componentType] || componentTemplates.text
  return template(element)
}

type Props = { element: EditorElement }

const Container = ({ element }: Props) => {
  const { id, content, name, styles, type } = element
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault()
    e.stopPropagation()
    const componentType = e.dataTransfer.getData('componentType') as EditorBtns

    if (!componentType) return

    switch (componentType) {
      case 'text':
        const textElement = {
          content: { innerText: 'Text Element' },
          id: v4(),
          name: 'Text',
          styles: {
            color: 'black',
            ...defaultStyles,
          },
          type: 'text',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: textElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(textElement, componentType)
        break
      case 'link':
        const linkElement = {
          content: {
            innerText: 'Link Element',
            href: '#',
          },
          id: v4(),
          name: 'Link',
          styles: {
            color: 'black',
            ...defaultStyles,
          },
          type: 'link',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: linkElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(linkElement, componentType)
        break
      case 'video':
        const videoElement = {
          content: {
            src: 'https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1',
          },
          id: v4(),
          name: 'Video',
          styles: {},
          type: 'video',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: videoElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(videoElement, componentType)
        break
      case 'container':
        const containerElement = {
          content: [],
          id: v4(),
          name: 'Container',
          styles: { ...defaultStyles },
          type: 'container',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: containerElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(containerElement, componentType)
        break
      case 'contactForm':
        const contactFormElement = {
          content: [],
          id: v4(),
          name: 'Contact Form',
          styles: {},
          type: 'contactForm',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: contactFormElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(contactFormElement, componentType)
        break
      case 'paymentForm':
        const paymentFormElement = {
          content: [],
          id: v4(),
          name: 'Payment Form',
          styles: {},
          type: 'paymentForm',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: paymentFormElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(paymentFormElement, componentType)
        break
      case 'aiComponent':
      case 'generatedComponent':
        // Handle AI-generated components by parsing the dragged data
        const componentData = e.dataTransfer.getData('componentData')
        if (componentData) {
          try {
            const parsedComponent = JSON.parse(componentData)
            const newElement = {
              ...parsedComponent,
              id: v4(), // Generate new ID to avoid conflicts
            }
            
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: newElement,
              },
            })

            // Trigger automatic background code generation
            triggerAutoCodeGeneration(newElement, componentType)
            
          } catch (error) {
            console.error('Error parsing AI component data:', error)
            // Fallback to a basic AI component
            const fallbackElement = {
              content: { innerText: 'AI Generated Component' },
              id: v4(),
              name: 'AI Component',
              styles: { ...defaultStyles },
              type: 'aiComponent',
            }
            
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: fallbackElement,
              },
            })

            // Trigger automatic background code generation for fallback too
            triggerAutoCodeGeneration(fallbackElement, componentType)
          }
        }
        break
      case '2Col':
        const twoColElement = {
          content: [
            {
              content: [],
              id: v4(),
              name: 'Container',
              styles: { ...defaultStyles, width: '100%' },
              type: 'container',
            },
            {
              content: [],
              id: v4(),
              name: 'Container',
              styles: { ...defaultStyles, width: '100%' },
              type: 'container',
            },
          ],
          id: v4(),
          name: 'Two Columns',
          styles: { ...defaultStyles, display: 'flex' },
          type: '2Col',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: twoColElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(twoColElement, componentType)
        break
      case 'select':
        const selectElement = {
          content: {
            placeholder: 'Choose an option...',
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]
          },
          id: v4(),
          name: 'Select',
          styles: { width: '100%', ...defaultStyles },
          type: 'select',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: selectElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(selectElement, componentType)
        break
      case 'checkbox':
        const checkboxElement = {
          content: { label: 'I agree to terms', checked: false },
          id: v4(),
          name: 'Checkbox',
          styles: { ...defaultStyles },
          type: 'checkbox',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: checkboxElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(checkboxElement, componentType)
        break
      case 'navbar':
        const navbarElement = {
          content: {
            logo: 'Logo',
            links: ['Home', 'About', 'Services', 'Contact']
          },
          id: v4(),
          name: 'Navbar',
          styles: { width: '100%', ...defaultStyles },
          type: 'navbar',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: navbarElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(navbarElement, componentType)
        break
      case 'productCard':
        const productCardElement = {
          content: {
            title: 'Product Name',
            description: 'Amazing product description',
            price: '$99.99',
            image: '/placeholder-product.jpg'
          },
          id: v4(),
          name: 'Product Card',
          styles: { maxWidth: '300px', ...defaultStyles },
          type: 'productCard',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: productCardElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(productCardElement, componentType)
        break
      case 'testimonial':
        const testimonialElement = {
          content: {
            quote: 'Amazing service! Highly recommend.',
            author: 'John Doe',
            role: 'CEO',
            avatar: '/placeholder-avatar.jpg'
          },
          id: v4(),
          name: 'Testimonial',
          styles: { ...defaultStyles },
          type: 'testimonial',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: testimonialElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(testimonialElement, componentType)
        break
      case 'lineChart':
        const lineChartElement = {
          content: {
            title: 'Sales Analytics',
            data: [
              { month: 'Jan', value: 400 },
              { month: 'Feb', value: 300 },
              { month: 'Mar', value: 600 },
              { month: 'Apr', value: 800 }
            ],
            xKey: 'month',
            yKey: 'value',
            color: '#007adf'
          },
          id: v4(),
          name: 'Line Chart',
          styles: { width: '100%', height: '350px', ...defaultStyles },
          type: 'lineChart',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: lineChartElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(lineChartElement, componentType)
        break
      case 'kpiCard':
        const kpiCardElement = {
          content: {
            title: 'Total Revenue',
            value: '$125,000',
            change: '+12.5%',
            trend: 'up',
            period: 'vs last month'
          },
          id: v4(),
          name: 'KPI Card',
          styles: { maxWidth: '300px', ...defaultStyles },
          type: 'kpiCard',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: kpiCardElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(kpiCardElement, componentType)
        break
      case 'dataTable':
        const dataTableElement = {
          content: {
            title: 'Data Table',
            columns: ['Name', 'Email', 'Status', 'Date'],
            data: [
              ['John Doe', 'john@example.com', 'Active', '2024-01-15'],
              ['Jane Smith', 'jane@example.com', 'Pending', '2024-01-16']
            ]
          },
          id: v4(),
          name: 'Data Table',
          styles: { width: '100%', ...defaultStyles },
          type: 'dataTable',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: dataTableElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(dataTableElement, componentType)
        break
      case 'tabs':
        const tabsElement = {
          content: { tabs: ['Tab 1', 'Tab 2', 'Tab 3'] },
          id: v4(),
          name: 'Tab Navigation',
          styles: { width: '100%', ...defaultStyles },
          type: 'tabs',
        }
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: tabsElement,
          },
        })
        // Trigger automatic background code generation
        triggerAutoCodeGeneration(tabsElement, componentType)
        break
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === '__body') return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  return (
    <div
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': type === 'container' || type === '2Col',
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'overflow-scroll ': type === '__body',
        'flex flex-col md:!flex-row': type === '2Col',
        '!border-blue-500':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== '__body',
        '!border-yellow-400 !border-4':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === '__body',
        '!border-solid':
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== '__body'}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'container')}
    >
      <Badge
        className={clsx(
          'absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden',
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <RecursiveElement
            key={childElement.id}
            element={childElement}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default Container