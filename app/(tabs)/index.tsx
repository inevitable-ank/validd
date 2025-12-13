import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
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
  const backgroundColor = isDark ? '#151718' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const sectionBgColor = isDark ? '#1F1F1F' : '#F5F5F5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <ThemedText style={[styles.greeting, { color: textColor }]}>
            Hi, Ankit 👏
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textColor }]}>
            Our AI advisor is here to help you!
          </ThemedText>
        </View>

        {/* Story-like Circular Icons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {stories.map((story) => (
            <View key={story.id} style={styles.storyItem}>
              <View style={[styles.storyCircle, { borderColor: story.borderColor }]}>
                <View style={[styles.storyInnerCircle, { backgroundColor: '#FFFFFF' }]}>
                  <IconSymbol 
                    name="person.fill" 
                    size={30} 
                    color={isDark ? '#D3D3D3' : '#D3D3D3'} 
                  />
                  {story.hasAddButton && (
                    <View style={[styles.addButton, { borderColor: backgroundColor }]}>
                      <IconSymbol name="plus" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </View>
              <ThemedText style={[styles.storyLabel, { color: textColor }]}>
                {story.label}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        {/* Chats Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Chats</ThemedText>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              style={({ pressed }) => [
                styles.chatItem,
                { backgroundColor: pressed ? sectionBgColor : 'transparent' },
              ]}
              onPress={() => {
                // Navigate to chat screen - to be implemented
              }}
            >
              <View style={styles.chatIconContainer}>
                <ThemedText style={styles.chatIconText}>AI</ThemedText>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <ThemedText style={[styles.chatName, { color: textColor }]}>
                    {chat.name}
                  </ThemedText>
                  <ThemedText style={[styles.chatTime, { color: textColor }]}>
                    {chat.time}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.chatMessage, { color: textColor }]}>
                  {chat.lastMessage}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Updates Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Updates</ThemedText>
          {updates.map((update) => (
            <Pressable
              key={update.id}
              style={({ pressed }) => [
                styles.updateItem,
                { backgroundColor: pressed ? sectionBgColor : 'transparent' },
              ]}
            >
              <View style={styles.updateIconContainer}>
                <ThemedText style={styles.updateIconText}>{update.icon}</ThemedText>
              </View>
              <View style={styles.updateContent}>
                <View style={styles.updateHeader}>
                  <ThemedText style={[styles.updateName, { color: textColor }]}>
                    {update.name}
                  </ThemedText>
                  <ThemedText style={[styles.updateDate, { color: textColor }]}>
                    {update.date}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.updateMessage, { color: textColor }]}>
                  {update.message}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  storiesContainer: {
    marginBottom: 24,
  },
  storiesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    width: 80,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  addButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  storyLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  chatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#FF4444',
  },
  chatIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  aiBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#151718',
  },
  aiText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  chatMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  updateIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateIconText: {
    fontSize: 28,
  },
  updateContent: {
    flex: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  updateName: {
    fontSize: 16,
    fontWeight: '600',
  },
  updateDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  updateMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
});
