import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9BA1A6' : '#687076',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5',
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#2F2F2F' : '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trades',
          tabBarIcon: ({ color }) => (
            <View style={{ position: 'relative' }}>
              <IconSymbol size={24} name="chart.bar.fill" color={color} />
              <View
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  backgroundColor: '#4CAF50',
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5',
                }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>2</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stocks"
        options={{
          title: 'Stocks',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.line.uptrend.xyaxis" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
