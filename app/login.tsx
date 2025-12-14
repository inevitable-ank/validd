import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { authService } from '@/services/auth.service';

export default function LoginScreen() {
  console.log('[Login] Component rendering...');
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('[Login] Screen mounted');
    // Test Firebase initialization with delay to avoid immediate crash
    const timer = setTimeout(async () => {
      try {
        console.log('[Login] Testing Firebase access...');
        const { checkFirebaseAvailability } = await import('@/utils/firebase-check');
        const firebaseCheck = await checkFirebaseAvailability();
        
        if (!firebaseCheck.isAvailable) {
          console.error('[Login] Firebase not available:', firebaseCheck.error);
          setError('Firebase is not properly configured. Please rebuild the app with: npx expo run:android or npx expo run:ios');
        } else {
          console.log('[Login] Firebase check passed');
        }
      } catch (err: any) {
        console.error('[Login] Firebase initialization error:', err);
        console.error('[Login] Error message:', err.message);
        console.error('[Login] Error stack:', err.stack);
        setError('Firebase initialization failed. Please rebuild the app.');
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log('[Login] Screen unmounted');
    };
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it's a valid 10-digit Indian phone number
    return digitsOnly.length === 10;
  };

  const handleSendOTP = async () => {
    setError(null);
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[Login] Attempting to send OTP to:', phoneNumber);
      await authService.sendOTP(phoneNumber);
      console.log('[Login] OTP sent successfully');
      setError(null); // Clear any previous errors
      // Navigate to dedicated OTP screen
      router.push({
        pathname: '/otp',
        params: { phoneNumber: phoneNumber.replace(/\D/g, '') }
      });
    } catch (err: any) {
      console.error('[Login] Error sending OTP:', err);
      console.error('[Login] Error message:', err.message);
      console.error('[Login] Error stack:', err.stack);
      const errorMessage = err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      
      // Show more helpful message for Firebase errors
      if (errorMessage.includes('Firebase') || errorMessage.includes('not available') || errorMessage.includes('rebuild')) {
        Alert.alert(
          'Configuration Error',
          'Firebase is not properly configured. Please rebuild the app:\n\nFor Android: npx expo run:android\nFor iOS: npx expo run:ios',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };


  console.log('[Login] About to render JSX...');
  
  // Using View instead of SafeAreaView - SafeAreaView was causing native crash
  // Using NativeWind (Tailwind) classes
  return (
    <View className="flex-1 bg-[#1F1F1F] pt-10 pb-5">
      <View className="flex-1 px-6 justify-center">
        {/* Header Section */}
        <View className="mb-12 items-center">
          <Text className="text-3xl font-bold text-white mb-3 text-center">
            Invest Smarter with AI
          </Text>
          <Text className="text-base text-gray-400 text-center">
            SEBI Registered - INH000013475
          </Text>
        </View>

        {/* Input Field Section */}
        <View className="mb-6">
          <View className={`bg-[#2A2A2A] rounded-xl px-4 py-4 min-h-[56px] border ${error ? 'border-red-500' : 'border-[#4A4A4A]'}`}>
            <Text className="text-sm text-gray-400 mb-2">
              Enter Phone Number
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white text-lg mr-2">
                +91
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError(null);
                }}
                keyboardType="phone-pad"
                className="text-white text-lg flex-1 p-0"
                placeholder="1234567890"
                placeholderTextColor="#6B7280"
                maxLength={10}
                editable={!isLoading}
              />
            </View>
          </View>
          {error && (
            <Text className="text-red-500 text-sm mt-2 ml-1">
              {error}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <Pressable
          onPress={handleSendOTP}
          className={`bg-[#4A4A4A] rounded-[28px] py-4 flex-row items-center justify-center min-h-[56px] ${isLoading ? 'opacity-60' : 'opacity-100'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-white text-lg font-bold mr-2">
                Send OTP
              </Text>
              <Text className="text-white text-lg">→</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}


