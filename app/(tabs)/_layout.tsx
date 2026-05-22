import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text className={`text-lg ${focused ? "text-lift" : "text-steel"}`}>{label}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { flex: 1, backgroundColor: "#f6f7f9" },
        tabBarActiveTintColor: "#e23d28",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          borderTopColor: "#e5e7eb",
          height: 84,
          paddingBottom: 22,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="⌂" />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "分析",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="⌁" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "プロフィール",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="◉" />,
        }}
      />
    </Tabs>
  );
}
