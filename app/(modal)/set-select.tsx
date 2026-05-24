import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { modalScrollContent, screenFlex } from "@/constants/layout";
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
    <SafeAreaView className="flex-1 bg-panel" edges={["top", "bottom"]}>
      <ScrollView style={screenFlex} contentContainerStyle={modalScrollContent}>
        <View className="mb-5 flex-row items-center justify-between">
          <TouchableOpacity
            accessibilityRole="button"
            className="min-h-11 min-w-20 items-center justify-center rounded-lg bg-white px-4"
            onPress={() => router.back()}
          >
            <Text className="text-base font-black text-ink">戻る</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-right text-2xl font-black text-ink">セット構成</Text>
        </View>

        <View>
          {SET_TYPE_OPTIONS.map((setType, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              className="mb-3 min-h-[76px] rounded-lg bg-white p-4"
              key={setType}
              onPress={() => select(setType)}
            >
              <Text className="text-xs font-bold text-lift">0{index + 1}</Text>
              <Text className="mt-2 text-xl font-black text-ink">{SET_TYPE_LABELS[setType]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
