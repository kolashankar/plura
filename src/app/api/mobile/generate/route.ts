
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { funnelId, appName, platform, features } = await req.json()

    // Generate React Native code structure
    const mobileApp = {
      name: appName,
      platform: platform || 'expo',
      structure: {
        'App.tsx': generateAppTsx(appName),
        'package.json': generatePackageJson(appName, features),
        'app.json': generateAppJson(appName),
        'screens/HomeScreen.tsx': generateHomeScreen(),
        'components/Button.tsx': generateButton(),
        'navigation/AppNavigator.tsx': generateNavigator()
      },
      features: features || ['navigation', 'styling', 'state-management'],
      buildInstructions: [
        'npm install',
        'expo start',
        'expo build:android',
        'expo build:ios'
      ]
    }

    return NextResponse.json({
      success: true,
      mobileApp,
      downloadUrl: `/api/mobile/download/${funnelId}`
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate mobile app' },
      { status: 500 }
    )
  }
}

function generateAppTsx(appName: string): string {
  return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});`
}

function generatePackageJson(appName: string, features: string[]): string {
  const dependencies: { [key: string]: string } = {
    'expo': '^49.0.0',
    'react': '18.2.0',
    'react-native': '0.72.6',
    '@react-navigation/native': '^6.1.9',
    '@react-navigation/stack': '^6.3.20'
  }

  if (features?.includes('state-management')) {
    dependencies['@reduxjs/toolkit'] = '^1.9.7'
    dependencies['react-redux'] = '^8.1.3'
  }

  return JSON.stringify({
    name: appName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    main: 'node_modules/expo/AppEntry.js',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web'
    },
    dependencies,
    devDependencies: {
      '@babel/core': '^7.20.0',
      'typescript': '^4.9.4'
    }
  }, null, 2)
}

function generateAppJson(appName: string): string {
  return JSON.stringify({
    expo: {
      name: appName,
      slug: appName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#FFFFFF'
        }
      }
    }
  }, null, 2)
}

function generateHomeScreen(): string {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your App</Text>
      <Button title="Get Started" onPress={() => console.log('Button pressed')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});`
}

function generateButton(): string {
  return `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={[styles.text, styles[\`\${variant}Text\`]]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
});`
}

function generateNavigator(): string {
  return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}`
}
