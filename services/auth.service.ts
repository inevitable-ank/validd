import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkFirebaseAvailability } from '@/utils/firebase-check';

const JWT_TOKEN_KEY = '@validd_jwt_token';
const USER_KEY = '@validd_user';

// Lazy load Firebase Auth to avoid immediate native module initialization
let authModule: any = null;
let firebaseChecked = false;

const getAuth = () => {
  if (!authModule) {
    try {
      // First check if Firebase is available
      if (!firebaseChecked) {
        // We'll check synchronously here, but log a warning if it fails
        try {
          const firebaseApp = require('@react-native-firebase/app');
          if (!firebaseApp.default) {
            throw new Error('Firebase App not initialized');
          }
        } catch (e) {
          console.error('[AuthService] Firebase App check failed:', e);
          throw new Error('Firebase is not properly configured. Please rebuild the app.');
        }
        firebaseChecked = true;
      }

      authModule = require('@react-native-firebase/auth').default;
      
      if (!authModule) {
        throw new Error('Firebase Auth module is null');
      }

      // Try to get auth instance to verify it's working
      const auth = authModule();
      if (!auth) {
        throw new Error('Firebase Auth instance is null');
      }

      console.log('[AuthService] Firebase Auth loaded successfully');
    } catch (error: any) {
      console.error('[AuthService] Failed to load Firebase Auth:', error);
      const errorMessage = error?.message || 'Unknown error';
      throw new Error(`Firebase Auth is not available: ${errorMessage}. Please check your configuration and rebuild the app.`);
    }
  }
  return authModule;
};

export interface AuthUser {
  id: string;
  uid: string;
  mobile_number: string;
  created_at?: string;
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

class AuthService {
  private confirmation: any = null;

  /**
   * Send OTP to phone number
   * @react-native-firebase handles reCAPTCHA automatically on Android
   */
  async sendOTP(phoneNumber: string): Promise<void> {
    try {
      // Check Firebase availability before proceeding
      const firebaseCheck = await checkFirebaseAvailability();
      if (!firebaseCheck.isAvailable) {
        console.error('[AuthService] Firebase not available:', firebaseCheck.error);
        throw new Error('Firebase is not properly configured. Please rebuild the app.');
      }

      // Format phone number: ensure it starts with +
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Send OTP - @react-native-firebase handles reCAPTCHA automatically
      const auth = getAuth();
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      this.confirmation = confirmation;
    } catch (error: any) {
      console.error('[AuthService] Error sending OTP:', error);
      console.error('[AuthService] Error stack:', error?.stack);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/invalid-phone-number') {
        throw new Error('Invalid phone number. Please check and try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else if (error.code === 'auth/quota-exceeded') {
        throw new Error('SMS quota exceeded. Please try again later.');
      } else if (error.message?.includes('Firebase') || error.message?.includes('not available')) {
        // Re-throw Firebase configuration errors as-is
        throw error;
      }
      
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  }

  /**
   * Verify OTP code and exchange Firebase token for JWT from backend
   */
  async verifyOTP(code: string): Promise<AuthUser> {
    try {
      if (!this.confirmation) {
        throw new Error('No OTP session found. Please request OTP again.');
      }

      // Step 1: Verify OTP with Firebase
      const userCredential = await this.confirmation.confirm(code);
      const firebaseUser = userCredential.user;

      // Step 2: Get Firebase ID token
      const firebaseIdToken = await firebaseUser.getIdToken();

      // Step 3: Send Firebase ID token to backend to get JWT
      const backendResponse = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: firebaseIdToken,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend error: ${backendResponse.status}`);
      }

      const data: BackendAuthResponse = await backendResponse.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Step 4: Store JWT token and user info from backend
      await AsyncStorage.setItem(JWT_TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data.user;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // Clear confirmation on error
      this.confirmation = null;
      
      // Provide user-friendly error messages
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('Invalid OTP code. Please try again.');
      } else if (error.code === 'auth/code-expired') {
        throw new Error('OTP code has expired. Please request a new one.');
      } else if (error.code === 'auth/session-expired') {
        throw new Error('OTP session expired. Please request a new OTP.');
      }
      
      throw new Error(error.message || 'Failed to verify OTP. Please try again.');
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated (has JWT token from backend)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const jwtToken = await AsyncStorage.getItem(JWT_TOKEN_KEY);
      const user = await this.getCurrentUser();
      return !!(jwtToken && user);
    } catch (error) {
      return false;
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem(JWT_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      this.confirmation = null;
      // Sign out from Firebase
      const auth = getAuth();
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get JWT token for authenticated API requests
   */
  async getJWTToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(JWT_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting JWT token:', error);
      return null;
    }
  }

  /**
   * Clear OTP session (useful for resending OTP)
   */
  clearOTPSession(): void {
    this.confirmation = null;
  }
}

export const authService = new AuthService();


