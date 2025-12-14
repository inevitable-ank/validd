import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { authService } from '@/services/auth.service';

type AuthStep = 'phone' | 'otp';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      await authService.sendOTP(phoneNumber);
      setCurrentStep('otp');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    
    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOTP(otpCode);
      // Navigate to tabs after successful verification
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
      Alert.alert('Error', err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    authService.clearOTPSession();
    setOtpCode('');
    setCurrentStep('phone');
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-[#1F1F1F]"
      edges={['top', 'bottom']}
    >
      <View className="flex-1 px-6 justify-center">
        {/* Header Section - Centered */}
        <View className="mb-12 items-center">
          <Text 
            className="text-3xl font-bold text-white mb-3 text-center"
            style={{ fontFamily: 'System' }}
          >
            Invest Smarter with AI
          </Text>
          <Text 
            className="text-base text-gray-400 text-center"
            style={{ fontFamily: 'System' }}
          >
            SEBI Registered - INH000013475
          </Text>
        </View>

        {/* Input Field Section */}
        <View className="mb-6">
          {currentStep === 'phone' ? (
            <>
              <View 
                className="bg-[#2A2A2A] rounded-xl px-4 py-4"
                style={{ 
                  minHeight: 56,
                  borderWidth: 1,
                  borderColor: error ? '#EF4444' : '#4A4A4A',
                }}
              >
                {/* Label inside input box at top */}
                <Text 
                  className="text-sm text-gray-400 mb-2"
                  style={{ fontFamily: 'System' }}
                >
                  Enter Phone Number
                </Text>
                {/* Input value below label */}
                <View className="flex-row items-center">
                  <Text 
                    className="text-white text-lg mr-2"
                    style={{ fontFamily: 'System' }}
                  >
                    +91
                  </Text>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      setError(null);
                    }}
                    keyboardType="phone-pad"
                    className="text-white text-lg flex-1"
                    style={{ fontFamily: 'System', padding: 0 }}
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
            </>
          ) : (
            <>
              <View 
                className="bg-[#2A2A2A] rounded-xl px-4 py-4"
                style={{ 
                  minHeight: 56,
                  borderWidth: 1,
                  borderColor: error ? '#EF4444' : '#4A4A4A',
                }}
              >
                {/* Label inside input box at top */}
                <Text 
                  className="text-sm text-gray-400 mb-2"
                  style={{ fontFamily: 'System' }}
                >
                  Enter OTP Code
                </Text>
                {/* Input value below label */}
                <TextInput
                  value={otpCode}
                  onChangeText={(text) => {
                    // Only allow digits, max 6
                    const digitsOnly = text.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(digitsOnly);
                    setError(null);
                  }}
                  keyboardType="number-pad"
                  className="text-white text-lg"
                  style={{ fontFamily: 'System', padding: 0 }}
                  placeholder="000000"
                  placeholderTextColor="#6B7280"
                  maxLength={6}
                  editable={!isLoading}
                />
              </View>
              {error && (
                <Text className="text-red-500 text-sm mt-2 ml-1">
                  {error}
                </Text>
              )}
              <Pressable
                onPress={handleResendOTP}
                className="mt-3"
                disabled={isLoading}
              >
                <Text 
                  className="text-blue-400 text-sm text-center"
                  style={{ fontFamily: 'System' }}
                >
                  Resend OTP
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Action Button - More Rounded */}
        <Pressable
          onPress={currentStep === 'phone' ? handleSendOTP : handleVerifyOTP}
          className="bg-[#4A4A4A] rounded-full py-4 flex-row items-center justify-center"
          style={{ minHeight: 56, opacity: isLoading ? 0.6 : 1 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text 
                className="text-white text-lg font-bold mr-2"
                style={{ fontFamily: 'System' }}
              >
                {currentStep === 'phone' ? 'Send OTP' : 'Verify OTP'}
              </Text>
              <IconSymbol 
                name="arrow.forward" 
                size={20} 
                color="#FFFFFF" 
              />
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
