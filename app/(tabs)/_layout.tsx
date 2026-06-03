import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text className={`text-lg ${focused ? "text-lift" : "text-white/55"}`}>{label}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { flex: 1, backgroundColor: "#eef7df" },
        tabBarActiveTintColor: "#b7f34b",
        tabBarInactiveTintColor: "#9aa694",
        tabBarStyle: {
          backgroundColor: "#070907",
          borderTopColor: "#26301f",
          height: 88,
          paddingBottom: 24,
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
