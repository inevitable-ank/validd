# Debugging App Crashes

This guide helps you diagnose and fix app crashes, especially those related to Firebase.

## Common Crash Causes

### 1. Firebase Not Properly Initialized

**Symptoms:**
- App crashes immediately on launch
- Error messages mentioning "Firebase" or "native module"
- "Firebase Auth is not available" errors

**Solution:**
Firebase requires native modules. If you added Firebase packages after creating the app, you need to rebuild:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

**Check:**
- Ensure `google-services.json` exists in the root directory (for Android)
- Ensure `GoogleService-Info.plist` exists (for iOS)
- Verify Firebase plugins are in `app.config.js`:
  ```js
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/auth"
  ]
  ```

### 2. Missing google-services.json

**Symptoms:**
- App crashes when trying to use Firebase Auth
- Error: "Default FirebaseApp is not initialized"

**Solution:**
1. Download `google-services.json` from Firebase Console
2. Place it in the root directory: `app_v1/google-services.json`
3. Rebuild the app: `npx expo run:android` or `npx expo run:ios`

### 3. SafeAreaView Warning

**Symptoms:**
- Warning: "SafeAreaView has been deprecated"

**Solution:**
This is just a warning. The app uses `react-native-safe-area-context` correctly. The warning may come from a dependency. It shouldn't cause crashes.

### 4. Navigation Errors

**Symptoms:**
- App crashes when navigating
- "Cannot read property 'replace' of undefined"

**Solution:**
Check that `useRouter()` is called within a component that's inside the Expo Router context.

## Debugging Steps

### Step 1: Check Logs

Look at the Metro bundler console output. The app logs important information:

```
[Index] Starting app initialization...
[Index] Auth service loaded
[Index] Firebase check passed
```

If you see errors, note the exact message.

### Step 2: Check Firebase Availability

The app now includes a Firebase check utility. If Firebase is not available, you'll see:

```
[Index] Firebase not available: [error message]
```

### Step 3: Check Last Error

The app stores the last error in AsyncStorage. You can check it:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const lastError = await AsyncStorage.getItem('@validd_last_error');
console.log('Last error:', lastError);
```

### Step 4: Rebuild the App

If you've added native modules (like Firebase), you MUST rebuild:

```bash
# Stop the current Metro bundler (Ctrl+C)
# Clear cache and rebuild
npx expo start --clear

# Then rebuild native app
npx expo run:android  # or npx expo run:ios
```

### Step 5: Check Device Logs

For Android:
```bash
adb logcat | grep -i "react\|firebase\|error"
```

For iOS:
- Open Xcode
- Window → Devices and Simulators
- Select your device
- View device logs

## Quick Fixes

### Fix 1: Clear Cache and Rebuild

```bash
# Clear Metro cache
npx expo start --clear

# Clear watchman (if installed)
watchman watch-del-all

# Clear node modules and reinstall
rm -rf node_modules
npm install

# Rebuild
npx expo run:android  # or npx expo run:ios
```

### Fix 2: Verify Firebase Configuration

1. Check `app.config.js` has Firebase plugins
2. Verify `google-services.json` exists and is valid JSON
3. Check Firebase Console → Project Settings → Your Apps
4. Ensure package name matches: `com.inevitable_ank.app_v1`

### Fix 3: Test Firebase Manually

Create a test file to check Firebase:

```typescript
// test-firebase.ts
import { checkFirebaseAvailability } from './utils/firebase-check';

checkFirebaseAvailability().then(result => {
  console.log('Firebase available:', result.isAvailable);
  if (!result.isAvailable) {
    console.error('Error:', result.error);
  }
});
```

## Getting More Information

### Enable Verbose Logging

The app logs extensively. Check the console for:
- `[Index]` - App initialization
- `[Login]` - Login screen events
- `[AuthService]` - Authentication service
- `[FirebaseCheck]` - Firebase availability checks

### Check Error Boundary

The app has an Error Boundary that catches React errors. If the app shows an error screen, check the console for the full error details.

## Still Having Issues?

1. **Check the exact error message** - It usually tells you what's wrong
2. **Verify all dependencies are installed**: `npm install`
3. **Ensure you're using a development build** (not Expo Go) since Firebase requires native modules
4. **Check Expo SDK version compatibility** with Firebase packages
5. **Try creating a fresh Expo project** and migrating code gradually

## Prevention

The app now includes:
- ✅ Firebase availability checks before use
- ✅ Better error handling and logging
- ✅ Error boundary to catch React errors
- ✅ Graceful fallbacks when Firebase is unavailable

These improvements should prevent most crashes and provide better error messages when issues occur.
