import '../global.css';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
// import 'react-native-reanimated'; // Commented out - not needed and causes errors with Expo Go

// Custom dark theme to ensure no white backgrounds
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1F1F1F', // Force dark background
    card: '#1F1F1F', // Force dark card background
    text: '#FFFFFF',
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  // Always use dark theme to prevent white flash
  return (
    <ThemeProvider value={CustomDarkTheme}>
      <View style={{ flex: 1, backgroundColor: '#1F1F1F' }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: '#1F1F1F' }, // Match splash/login background
            animation: 'fade', // Smooth fade transition
            animationDuration: 300, // Faster transition
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
