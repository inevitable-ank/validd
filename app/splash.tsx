import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Show splash for 2 seconds, then navigate
    // Let Stack's fade animation handle the transition smoothly
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: '#1F1F1F',
      }}
    >
      <SafeAreaView 
        className="flex-1"
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
    </View>
  );
}
