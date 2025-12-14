import { ScrollView, View, Pressable, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface StoryItem {
  id: string;
  label: string;
  borderColor: string;
  hasAddButton?: boolean;
}

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
}

interface UpdateItem {
  id: string;
  name: string;
  message: string;
  date: string;
  icon: string;
  iconColor: string;
}

const stories: StoryItem[] = [
  { id: '1', label: 'Your Profile', borderColor: '#000000', hasAddButton: true },
  { id: '2', label: 'Test', borderColor: '#FF6B35' },
  { id: '3', label: 'Profits', borderColor: '#FF6B35' },
  { id: '4', label: 'News', borderColor: '#FF6B35' },
  { id: '5', label: 'Market', borderColor: '#FF6B35' },
];

const chats: ChatItem[] = [
  {
    id: '1',
    name: 'Stock Advisor',
    lastMessage: 'Hii',
    time: 'Yesterday',
  },
];

const updates: UpdateItem[] = [
  {
    id: '1',
    name: 'Finance Notes',
    message: 'Welcome we are live now 🎉',
    date: 'Nov 30',
    icon: '📌',
    iconColor: '#FFD700',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Using View instead of SafeAreaView - SafeAreaView was causing native crash
  return (
    <View className="flex-1 bg-white dark:bg-[#151718] pt-10">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-[32px] font-bold mb-2 leading-[42px] min-h-[42px] text-black dark:text-white" numberOfLines={1}>
            Hi, Ankit 👏
          </Text>
          <Text className="text-sm opacity-80 text-black dark:text-white">
            Our AI advisor is here to help you!
          </Text>
        </View>

        {/* Story-like Circular Icons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {stories.map((story) => (
            <View key={story.id} className="items-center w-20">
              <View 
                className="w-[70px] h-[70px] rounded-full border-2 justify-center items-center mb-2"
                style={{ borderColor: story.borderColor }}
              >
                <View className="w-[60px] h-[60px] rounded-full justify-center items-center overflow-hidden bg-white">
                  <IconSymbol 
                    name="person.fill" 
                    size={30} 
                    color="#D3D3D3" 
                  />
                  {story.hasAddButton && (
                    <View 
                      className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-xl bg-[#007AFF] justify-center items-center border-2"
                      style={{ borderColor: isDark ? '#151718' : '#FFFFFF' }}
                    >
                      <IconSymbol name="plus" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </View>
              <Text className="text-xs text-center text-black dark:text-white">
                {story.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Chats Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold mb-3 text-black dark:text-white">Chats</Text>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              className="flex-row items-center py-3 px-2 rounded-lg mb-1"
              style={({ pressed }) => ({
                backgroundColor: pressed 
                  ? (isDark ? '#1F1F1F' : '#F5F5F5') 
                  : 'transparent'
              })}
              onPress={() => {
                // Navigate to chat screen - to be implemented
              }}
            >
              <View className="w-14 h-14 rounded-full justify-center items-center mr-3 relative bg-[#FF4444]">
                <Text className="text-xl font-bold text-white">AI</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-base font-semibold text-black dark:text-white">
                    {chat.name}
                  </Text>
                  <Text className="text-xs opacity-70 text-black dark:text-white">
                    {chat.time}
                  </Text>
                </View>
                <Text className="text-sm opacity-80 text-black dark:text-white">
                  {chat.lastMessage}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Updates Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold mb-3 text-black dark:text-white">Updates</Text>
          {updates.map((update) => (
            <Pressable
              key={update.id}
              className="flex-row items-center py-3 px-2 rounded-lg mb-1"
              style={({ pressed }) => ({
                backgroundColor: pressed 
                  ? (isDark ? '#1F1F1F' : '#F5F5F5') 
                  : 'transparent'
              })}
            >
              <View className="w-12 h-12 justify-center items-center mr-3">
                <Text className="text-[28px]">{update.icon}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-base font-semibold text-black dark:text-white">
                    {update.name}
                  </Text>
                  <Text className="text-xs opacity-70 text-black dark:text-white">
                    {update.date}
                  </Text>
                </View>
                <Text className="text-sm opacity-80 text-black dark:text-white">
                  {update.message}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
