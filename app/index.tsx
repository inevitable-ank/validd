import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AppStateManager } from '@/utils/app-state';

// Set to true to always show splash screen (useful for testing)
// Set to false to use normal cold/warm start detection
const ALWAYS_SHOW_SPLASH = false;

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
      console.log('[Index] Starting app initialization...');
      
      // Check Firebase availability first (non-blocking)
      try {
        const { checkFirebaseAvailability } = await import('@/utils/firebase-check');
        const firebaseCheck = await checkFirebaseAvailability();
        if (!firebaseCheck.isAvailable) {
          console.warn('[Index] Firebase not available:', firebaseCheck.error);
          console.warn('[Index] App will continue but authentication may not work');
        } else {
          console.log('[Index] Firebase check passed');
        }
      } catch (firebaseCheckError) {
        console.warn('[Index] Firebase check failed (non-critical):', firebaseCheckError);
      }
      
      const { authService } = await import('@/services/auth.service');
      console.log('[Index] Auth service loaded');
      
      const appStateManager = AppStateManager.getInstance();
      console.log('[Index] App state manager initialized');
      
      const isColdStart = await appStateManager.isColdStart();
      console.log('[Index] Cold start check:', isColdStart);
      
      let isAuthenticated = false;
      try {
        isAuthenticated = await authService.isAuthenticated();
        console.log('[Index] Authentication check:', isAuthenticated);
      } catch (authError: any) {
        console.error('[Index] Error checking authentication:', authError);
        // If Firebase is not available, treat as not authenticated
        if (authError?.message?.includes('Firebase') || authError?.message?.includes('not available')) {
          console.warn('[Index] Firebase error during auth check, treating as not authenticated');
          isAuthenticated = false;
        } else {
          // For other errors, still default to not authenticated
          isAuthenticated = false;
        }
      }

      // Always show splash if flag is enabled (for testing)
      if (ALWAYS_SHOW_SPLASH) {
        console.log('[Index] Navigating to splash (ALWAYS_SHOW_SPLASH enabled)');
        router.replace('/splash');
      } else if (isColdStart) {
        // Cold start - show splash screen
        console.log('[Index] Navigating to splash (cold start)');
        router.replace('/splash');
      } else {
        // Warm start - check auth and route accordingly
        if (isAuthenticated) {
          console.log('[Index] Navigating to tabs (authenticated)');
          router.replace('/(tabs)');
        } else {
          console.log('[Index] Navigating to login (not authenticated)');
          router.replace('/login');
        }
      }
    } catch (error: any) {
      console.error('[Index] Error checking app state:', error);
      console.error('[Index] Error message:', error?.message);
      console.error('[Index] Error stack:', error?.stack);
      console.error('[Index] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      // On error, default to splash screen (which will handle navigation)
      try {
        router.replace('/splash');
      } catch (routerError) {
        console.error('[Index] Error navigating to splash:', routerError);
        // If even navigation fails, we're in a bad state
      }
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



