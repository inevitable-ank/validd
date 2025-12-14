# Firebase Mobile OTP Authentication Setup

## ✅ What's Been Implemented

1. **Firebase Configuration** (`config/firebase.ts`)
   - Firebase app initialization
   - Auth service setup

2. **Authentication Service** (`services/auth.service.ts`)
   - Send OTP functionality
   - Verify OTP functionality
   - Authentication state management
   - User session persistence

3. **Login Screen** (`app/login.tsx`)
   - Phone number input with validation
   - OTP input screen
   - Error handling
   - Loading states
   - Resend OTP functionality

4. **Authentication State Management**
   - Auto-redirect to tabs if authenticated
   - Auto-redirect to login if not authenticated
   - Session persistence across app restarts

## 🔧 Setup Instructions

### 1. Configure Firebase Credentials

Update `config/firebase.ts` with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

**OR** use environment variables (recommended):

Create a `.env` file in the root directory:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Console Setup

1. **Enable Phone Authentication:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Phone" authentication
   - Add your app's SHA-1 fingerprint (for Android)
   - Configure reCAPTCHA settings if needed

2. **For Android:**
   - Add your app's package name: `com.inevitable_ank.app_v1`
   - Add SHA-1 fingerprint from your keystore

3. **For iOS:**
   - Add your iOS bundle ID
   - Upload APNs certificate if needed

### 3. Important Notes

#### reCAPTCHA for Android/Web
- **iOS**: Phone authentication works without reCAPTCHA
- **Android/Web**: Requires reCAPTCHA verification
- The current implementation supports both scenarios
- If you encounter reCAPTCHA issues on Android, you may need to add `expo-firebase-recaptcha` component (already installed)

#### Testing
- Use test phone numbers in Firebase Console for development
- Real phone numbers will receive actual SMS (may incur costs)

### 4. Usage Flow

1. User enters phone number (10 digits for India)
2. Clicks "Send OTP"
3. Receives OTP via SMS
4. Enters 6-digit OTP
5. Clicks "Verify OTP"
6. On success, navigates to main app (tabs)

### 5. Authentication Persistence

- User authentication state is saved in AsyncStorage
- App automatically checks auth state on launch
- Authenticated users skip login screen
- Users can sign out (if you add a sign-out button)

## 🐛 Troubleshooting

### "Failed to send OTP"
- Check Firebase configuration
- Verify Phone authentication is enabled in Firebase Console
- Check network connectivity
- For Android: Ensure reCAPTCHA is configured

### "Invalid OTP code"
- OTP codes expire after a few minutes
- Request a new OTP if expired
- Ensure you're entering the correct 6-digit code

### reCAPTCHA Issues (Android/Web)
If you need to add reCAPTCHA support, you can update the auth service to use `expo-firebase-recaptcha` component. The package is already installed.

## 📝 Next Steps

1. Add your Firebase credentials to `config/firebase.ts` or `.env` file
2. Test the authentication flow
3. Add sign-out functionality if needed
4. Customize error messages as needed
5. Add analytics/logging if required


