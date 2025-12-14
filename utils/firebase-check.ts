/**
 * Utility to check if Firebase is properly initialized and available
 * This helps prevent crashes when Firebase native modules aren't loaded
 */

export interface FirebaseCheckResult {
  isAvailable: boolean;
  error?: string;
  details?: {
    appAvailable: boolean;
    authAvailable: boolean;
  };
}

/**
 * Check if Firebase is available and properly initialized
 */
export async function checkFirebaseAvailability(): Promise<FirebaseCheckResult> {
  try {
    // Check if Firebase App module is available
    let appAvailable = false;
    let authAvailable = false;

    try {
      const firebaseApp = require('@react-native-firebase/app');
      appAvailable = !!firebaseApp.default;
      
      if (appAvailable) {
        // Try to get the default app instance
        try {
          const app = firebaseApp.default.app();
          appAvailable = !!app;
        } catch (e) {
          console.warn('[FirebaseCheck] Firebase app instance not available:', e);
          appAvailable = false;
        }
      }
    } catch (error: any) {
      console.error('[FirebaseCheck] Firebase App module not available:', error?.message);
      return {
        isAvailable: false,
        error: `Firebase App module not available: ${error?.message || 'Unknown error'}`,
        details: {
          appAvailable: false,
          authAvailable: false,
        },
      };
    }

    // Check if Firebase Auth module is available
    try {
      const firebaseAuth = require('@react-native-firebase/auth');
      authAvailable = !!firebaseAuth.default;
      
      if (authAvailable) {
        // Try to get the auth instance - use default() directly, not default.auth()
        try {
          const auth = firebaseAuth.default();
          authAvailable = !!auth;
        } catch (e) {
          console.warn('[FirebaseCheck] Firebase auth instance not available:', e);
          authAvailable = false;
        }
      }
    } catch (error: any) {
      console.error('[FirebaseCheck] Firebase Auth module not available:', error?.message);
      return {
        isAvailable: false,
        error: `Firebase Auth module not available: ${error?.message || 'Unknown error'}`,
        details: {
          appAvailable,
          authAvailable: false,
        },
      };
    }

    if (!appAvailable || !authAvailable) {
      return {
        isAvailable: false,
        error: `Firebase not fully initialized. App: ${appAvailable}, Auth: ${authAvailable}`,
        details: {
          appAvailable,
          authAvailable,
        },
      };
    }

    return {
      isAvailable: true,
      details: {
        appAvailable: true,
        authAvailable: true,
      },
    };
  } catch (error: any) {
    console.error('[FirebaseCheck] Unexpected error checking Firebase:', error);
    return {
      isAvailable: false,
      error: `Unexpected error: ${error?.message || 'Unknown error'}`,
      details: {
        appAvailable: false,
        authAvailable: false,
      },
    };
  }
}

/**
 * Get a user-friendly error message for Firebase unavailability
 */
export function getFirebaseErrorMessage(result: FirebaseCheckResult): string {
  if (result.isAvailable) {
    return '';
  }

  if (result.error?.includes('not available')) {
    return 'Firebase is not properly configured. Please rebuild the app or check your configuration.';
  }

  if (result.error?.includes('not fully initialized')) {
    return 'Firebase initialization incomplete. Please restart the app.';
  }

  return result.error || 'Firebase is not available. Please check your configuration.';
}
