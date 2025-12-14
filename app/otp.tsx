import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '@/services/auth.service';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber?: string }>();
  const phoneNumber = params.phoneNumber || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);

  // Refs for each input box
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length > 1) {
      // Handle paste: fill multiple boxes
      const digits = digitsOnly.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      setError(null);
      
      // Focus the next empty box or last box
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-submit if 6 digits entered
      if (newOtp.every(d => d !== '')) {
        handleVerifyOTP(newOtp.join(''));
      }
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = digitsOnly;
      setOtp(newOtp);
      setError(null);

      // Auto-focus next box if digit entered
      if (digitsOnly && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit if 6 digits entered
      if (newOtp.every(d => d !== '')) {
        handleVerifyOTP(newOtp.join(''));
      }
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyOTP(code);
      // Navigate to tabs after successful verification
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      Alert.alert('Error', err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend || !phoneNumber) {
      return;
    }

    setError(null);
    setCanResend(false);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    setIsLoading(true);
    try {
      await authService.sendOTP(phoneNumber);
      Alert.alert('Success', 'OTP has been resent to your phone number');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
      Alert.alert('Error', err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to phone entry
  const handleGoBack = () => {
    authService.clearOTPSession();
    router.back();
  };

  return (
    <View className="flex-1 bg-[#1F1F1F] pt-10 pb-5">
      <View className="flex-1 px-6">
        {/* Header Section */}
        <View className="mb-8">
          <Pressable 
            onPress={handleGoBack}
            className="mb-6"
            disabled={isLoading}
          >
            <Text className="text-blue-400 text-base">← Back</Text>
          </Pressable>
          
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              Enter OTP
            </Text>
            <Text className="text-base text-gray-400 text-center">
              We've sent a 6-digit code to
            </Text>
            {phoneNumber && (
              <Text className="text-lg font-semibold text-white mt-1">
                +91 {phoneNumber}
              </Text>
            )}
          </View>
        </View>

        {/* OTP Input Boxes */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className={`w-14 h-14 bg-[#2A2A2A] rounded-xl border-2 text-center text-white text-2xl font-bold ${
                  error ? 'border-red-500' : digit ? 'border-blue-500' : 'border-[#4A4A4A]'
                }`}
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          {error && (
            <Text className="text-red-500 text-sm text-center mt-2">
              {error}
            </Text>
          )}
        </View>

        {/* Resend OTP Section */}
        <View className="items-center mb-8">
          {!canResend ? (
            <Text className="text-gray-400 text-sm">
              Resend OTP in {resendTimer}s
            </Text>
          ) : (
            <Pressable
              onPress={handleResendOTP}
              disabled={isLoading || !phoneNumber}
              className="opacity-80"
            >
              <Text className="text-blue-400 text-base font-semibold">
                Resend OTP
              </Text>
            </Pressable>
          )}
        </View>

        {/* Verify Button */}
        <View className="flex-1 justify-end pb-4">
          <Pressable
            onPress={() => handleVerifyOTP()}
            className={`bg-[#4A4A4A] rounded-[28px] py-4 flex-row items-center justify-center min-h-[56px] ${
              isLoading || otp.some(d => !d) ? 'opacity-60' : 'opacity-100'
            }`}
            disabled={isLoading || otp.some(d => !d)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white text-lg font-bold mr-2">
                  Verify OTP
                </Text>
                <Text className="text-white text-lg">→</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
