import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to tabs after login
    // You can add phone number validation and API call here
    router.replace('/(tabs)');
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
          <View 
            className="bg-[#2A2A2A] rounded-xl px-4 py-4"
            style={{ minHeight: 56 }}
          >
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter Phone Number"
              placeholderTextColor="#9BA1A6"
              keyboardType="phone-pad"
              className="text-white text-lg"
              style={{ fontFamily: 'System' }}
            />
          </View>
        </View>

        {/* Get Started Button - More Rounded */}
        <Pressable
          onPress={handleGetStarted}
          className="bg-[#2A2A2A] rounded-full py-4 flex-row items-center justify-center"
          style={{ minHeight: 56 }}
        >
          <Text 
            className="text-white text-lg font-bold mr-2"
            style={{ fontFamily: 'System' }}
          >
            Get Started
          </Text>
          <IconSymbol 
            name="chevron.right" 
            size={20} 
            color="#FFFFFF" 
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
