import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

const APP_STATE_KEY = '@validd_app_state';
const IS_ACTIVE_KEY = '@validd_is_active';
const FIRST_LAUNCH_KEY = '@validd_first_launch';

/**
 * Detects if this is a cold start (app was completely closed) 
 * vs warm start (app was just in background)
 * 
 * How it works:
 * 1. When app is active, we store a flag in AsyncStorage
 * 2. When app goes to background, we keep the flag
 * 3. On app launch, if flag exists = warm start (skip splash)
 * 4. On app launch, if flag doesn't exist = cold start (show splash)
 * 5. When app is force-closed/removed from background, the flag persists
 *    but we detect this by checking if app was recently active
 */
export class AppStateManager {
  private static instance: AppStateManager;
  private appStateSubscription: any = null;

  private constructor() {
    this.setupAppStateListener();
  }

  static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  private setupAppStateListener() {
    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );

    // DON'T mark as active here - we need to check cold start first
    // This will be called after isColdStart() determines the state
  }

  private async handleAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      // App came to foreground - mark as active
      await this.markAppAsActive();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background - keep the flag but update timestamp
      await AsyncStorage.setItem(IS_ACTIVE_KEY, Date.now().toString());
    }
  }

  private async markAppAsActive() {
    await AsyncStorage.setItem(APP_STATE_KEY, 'active');
    await AsyncStorage.setItem(IS_ACTIVE_KEY, Date.now().toString());
  }

  /**
   * Checks if this is a cold start
   * Returns true if app was completely closed (cold start)
   * Returns false if app was just in background (warm start)
   */
  async isColdStart(): Promise<boolean> {
    try {
      // IMPORTANT: Read the timestamp BEFORE marking as active
      // This ensures we get the OLD timestamp, not a newly set one
      
      // First, check if this is the very first launch
      const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      if (!isFirstLaunch) {
        // This is the first time the app is launched
        // Mark it so we know it's not the first time anymore
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
        // Mark as active for future checks (AFTER checking)
        await this.markAppAsActive();
        // Always show splash on first launch
        return true;
      }

      // For subsequent launches, check the last active time
      // Read this BEFORE marking as active to get the old timestamp
      const lastActiveTime = await AsyncStorage.getItem(IS_ACTIVE_KEY);

      // If no timestamp exists, it's definitely a cold start
      if (!lastActiveTime) {
        // Mark as active now for future checks
        await this.markAppAsActive();
        return true;
      }

      // Check if app was recently active (within last 2 minutes)
      // This is shorter to better detect when app was force-closed
      const timeDiff = Date.now() - parseInt(lastActiveTime, 10);
      const TWO_MINUTES = 2 * 60 * 1000; // 2 minutes in milliseconds

      console.log('[AppStateManager] Last active time:', new Date(parseInt(lastActiveTime, 10)).toISOString());
      console.log('[AppStateManager] Time difference:', Math.round(timeDiff / 1000), 'seconds');

      if (timeDiff > TWO_MINUTES) {
        // App was inactive for more than 2 minutes
        // Consider it a cold start (likely force-closed or removed from background)
        console.log('[AppStateManager] Detected cold start (inactive > 2 minutes)');
        await AsyncStorage.removeItem(APP_STATE_KEY);
        await AsyncStorage.removeItem(IS_ACTIVE_KEY);
        // Mark as active now for future checks
        await this.markAppAsActive();
        return true;
      }

      // App was recently active (within 2 minutes), so it's a warm start
      console.log('[AppStateManager] Detected warm start (inactive < 2 minutes)');
      // Update the timestamp to current time
      await this.markAppAsActive();
      return false;
    } catch (error) {
      console.error('[AppStateManager] Error checking app state:', error);
      // On error, default to cold start (show splash)
      // But still mark as active for future checks
      await this.markAppAsActive().catch(() => {});
      return true;
    }
  }

  /**
   * Reset first launch flag (useful for testing)
   */
  async resetFirstLaunch(): Promise<void> {
    await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
    await AsyncStorage.removeItem(APP_STATE_KEY);
    await AsyncStorage.removeItem(IS_ACTIVE_KEY);
  }

  /**
   * Cleanup - call this when app is closing
   */
  cleanup() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }
}



