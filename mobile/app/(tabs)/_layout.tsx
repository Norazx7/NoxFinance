import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/src/theme/colors';

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <Text style={{ color, fontSize: 11, fontWeight: '800' }}>{label}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElevated },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon label="●" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimentações',
          tabBarIcon: ({ color }) => <TabIcon label="⇄" color={color} />,
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: 'Planejamento',
          tabBarIcon: ({ color }) => <TabIcon label="◈" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'NOX AI',
          tabBarIcon: ({ color }) => <TabIcon label="AI" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon label="◎" color={color} />,
        }}
      />
    </Tabs>
  );
}
