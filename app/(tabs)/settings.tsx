import { ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  // Using View instead of SafeAreaView - SafeAreaView was causing native crash
  return (
    <View className="flex-1 bg-white dark:bg-[#151718] pt-10">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6">
          <Text className="text-[32px] font-bold text-black dark:text-white">
            Settings
          </Text>
          <Text className="text-black dark:text-white mt-2">
            App settings and preferences will appear here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
