import '../global.css';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { Component, ErrorInfo, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Custom dark theme to ensure no white backgrounds
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1F1F1F', // Force dark background
    card: '#1F1F1F', // Force dark card background
    text: '#FFFFFF',
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

// Error Boundary to catch and display errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RootLayout Error:', error);
    console.error('RootLayout Error Message:', error.message);
    console.error('RootLayout Error Stack:', error.stack);
    console.error('RootLayout Error Info:', errorInfo);
    console.error('RootLayout Component Stack:', errorInfo.componentStack);
    
    // Log to AsyncStorage for debugging (non-blocking)
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem('@validd_last_error', JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        componentStack: errorInfo.componentStack,
      })).catch(() => {});
    } catch (e) {
      // Ignore errors in error logging
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1F1F1F', padding: 20 }}>
          <Text style={{ color: '#FF0000', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            App Error
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Text style={{ color: '#888888', fontSize: 12, textAlign: 'center' }}>
            Please restart the app. If the problem persists, check the console logs.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  // Always use dark theme to prevent white flash
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider value={CustomDarkTheme}>
          <View style={{ flex: 1, backgroundColor: '#1F1F1F' }}>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: '#1F1F1F' }, // Match splash/login background
                animation: 'fade', // Smooth fade transition
                animationDuration: 600, // Slower, smoother transition
              }}
            >
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="light" />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
