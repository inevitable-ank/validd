import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AppStateManager } from '@/utils/app-state';

/**
 * Root index file that handles initial routing based on app state
 * - Cold start: Shows splash screen
 * - Warm start: Goes directly to tabs/login
 */
export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAndNavigate();
  }, []);

  const checkAndNavigate = async () => {
    try {
      const { authService } = await import('@/services/auth.service');
      const appStateManager = AppStateManager.getInstance();
      const isColdStart = await appStateManager.isColdStart();
      const isAuthenticated = await authService.isAuthenticated();

      if (isColdStart) {
        // Cold start - show splash screen
        router.replace('/splash');
      } else {
        // Warm start - check auth and route accordingly
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('Error checking app state:', error);
      // On error, default to splash screen
      router.replace('/splash');
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading indicator while checking - match splash background
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1F1F1F' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return null;
}


