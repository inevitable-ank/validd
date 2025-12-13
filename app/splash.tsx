import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible

  useEffect(() => {
    // Show splash for 2 seconds, then fade out over 0.5 seconds, then navigate
    const showTimer = setTimeout(() => {
      // Start fade-out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // 0.5 seconds fade
        useNativeDriver: true,
      }).start(() => {
        // Navigate after fade completes
        router.replace('/login');
      });
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(showTimer);
  }, [router, fadeAnim]);

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: '#1F1F1F',
        opacity: fadeAnim 
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
    </Animated.View>
  );
}
