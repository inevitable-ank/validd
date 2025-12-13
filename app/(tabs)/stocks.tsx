import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StocksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#151718]" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6">
          <Text className="text-[32px] font-bold text-black dark:text-white">
            Stocks
          </Text>
          <Text className="text-black dark:text-white mt-2">
            Stock market data and analysis will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
