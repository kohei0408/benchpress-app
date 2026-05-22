import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DbContext } from "@/contexts/DbContext";
import { useDbInit } from "@/hooks/useDbInit";

export default function RootLayout() {
  const { isReady, db, error, retry } = useDbInit();

  if (!isReady && error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-panel px-8">
        <Text className="mb-2 text-lg font-black text-ink">起動に失敗しました</Text>
        <Text className="mb-6 text-center text-sm text-steel">{error.message}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="rounded-lg bg-lift px-8 py-3"
          onPress={retry}
        >
          <Text className="font-bold text-white">再試行</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-panel">
        <ActivityIndicator size="large" color="#e23d28" />
        <Text className="mt-4 text-base font-semibold text-steel">データを読み込み中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DbContext.Provider value={db}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(modal)" options={{ presentation: "fullScreenModal" }} />
        </Stack>
      </DbContext.Provider>
    </SafeAreaProvider>
  );
}
