import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Show splash for 2-3 seconds, then navigate to login/main
    const timer = setTimeout(() => {
      // Navigate to login page (you'll create this next)
      // For now, navigate to tabs - you can change this to login route later
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView 
      className="flex-1 bg-[#1F1F1F]"
      edges={['top', 'bottom']}
    >
      <View className="flex-1 justify-center items-center px-4">
        {/* Main Title - Centered */}
        <Text 
          className="text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'System' }}
        >
          Validd.in
        </Text>

        {/* Subtitle 1 - Below main title */}
        <Text 
          className="text-base text-gray-400 mb-16"
          style={{ fontFamily: 'System' }}
        >
          SEBI Registered
        </Text>

        {/* Bottom Section - Positioned near bottom */}
        <View className="absolute bottom-32 items-center">
          <Text 
            className="text-base text-gray-400 mb-3"
            style={{ fontFamily: 'System' }}
          >
            SEBI Registration
          </Text>
          <Text 
            className="text-base font-bold text-white"
            style={{ fontFamily: 'System' }}
          >
            INH000013475
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
