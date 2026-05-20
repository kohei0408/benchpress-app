import { router } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SET_TYPE_LABELS, SET_TYPE_OPTIONS } from "@/constants/setTypes";
import { useSessionStore } from "@/stores/sessionStore";
import type { SetType } from "@/types";

export default function SetSelectScreen() {
  const startDraft = useSessionStore((state) => state.startDraft);

  const select = (setType: SetType) => {
    startDraft(setType);
    router.push("/(modal)/recording");
  };

  return (
    <SafeAreaView className="flex-1 bg-panel">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-black text-ink">セット構成</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
            <Text className="text-base font-black text-steel">閉じる</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-6 gap-3">
          {SET_TYPE_OPTIONS.map((setType, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              className="rounded-lg bg-white p-5"
              key={setType}
              onPress={() => select(setType)}
            >
              <Text className="text-xs font-bold text-lift">0{index + 1}</Text>
              <Text className="mt-2 text-xl font-black text-ink">{SET_TYPE_LABELS[setType]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
