import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlateCalculator } from "@/components/PlateCalculator";
import { WeightStepper } from "@/components/WeightStepper";
import { modalScrollContent, screenFlex } from "@/constants/layout";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { useSessionStore } from "@/stores/sessionStore";

export default function RecordingScreen() {
  const draft = useSessionStore((state) => state.draft);
  const profile = useSessionStore((state) => state.profile);
  const sessions = useSessionStore((state) => state.sessions);
  const addDraftSet = useSessionStore((state) => state.addDraftSet);
  const updateDraftSet = useSessionStore((state) => state.updateDraftSet);
  const nextSet = useSessionStore((state) => state.nextSet);

  if (!draft) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-panel px-5" edges={["top", "bottom"]}>
        <Text className="text-center text-lg font-black text-ink">記録中のセットがありません</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="mt-5 min-h-12 rounded-lg bg-ink px-5 py-3"
          onPress={() => router.replace("/(modal)/set-select")}
        >
          <Text className="font-black text-white">セットを選ぶ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentSet = draft.sets[draft.currentIndex] ?? draft.sets[0];
  const previousSameType = sessions.find((session) => session.setType === draft.setType);
  const previousSet = previousSameType?.sets.find((set) => set.setNumber === currentSet.setNumber);
  const canGoNext = draft.currentIndex < draft.sets.length - 1;

  const complete = () => {
    router.replace("/(modal)/result");
  };

  return (
    <SafeAreaView className="flex-1 bg-panel" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={12}
      >
        <ScrollView
          style={screenFlex}
          contentContainerStyle={modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <TouchableOpacity
              accessibilityRole="button"
              className="min-h-11 min-w-20 items-center justify-center rounded-lg bg-white px-4"
              onPress={() => router.back()}
            >
              <Text className="text-base font-black text-ink">戻る</Text>
            </TouchableOpacity>
            <View className="ml-3 flex-1 items-end">
              <Text className="text-sm font-bold text-lift">{SET_TYPE_LABELS[draft.setType]}</Text>
              <Text className="text-2xl font-black text-ink">
                {currentSet.setNumber} セット目 / {draft.sets.length}
              </Text>
            </View>
          </View>

          <View className="rounded-lg bg-white p-4">
            <WeightStepper
              onChange={(weight) => updateDraftSet(currentSet.setNumber, { weight })}
              value={currentSet.weight}
            />
            {previousSet ? (
              <Text className="mt-2 text-xs font-semibold text-steel">
                前回同一セット: {previousSet.weight} kg x {previousSet.reps}
              </Text>
            ) : null}
          </View>

          <View className="mt-4 rounded-lg bg-white p-4">
            <Text className="mb-3 text-xs font-bold text-steel">回数</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                accessibilityRole="button"
                className="h-14 w-14 items-center justify-center rounded-lg bg-ink"
                onPress={() => updateDraftSet(currentSet.setNumber, { reps: Math.max(1, currentSet.reps - 1) })}
              >
                <Text className="text-3xl font-black text-white">-</Text>
              </TouchableOpacity>
              <Text className="mx-4 flex-1 text-center text-5xl font-black text-ink">{currentSet.reps}</Text>
              <TouchableOpacity
                accessibilityRole="button"
                className="h-14 w-14 items-center justify-center rounded-lg bg-ink"
                onPress={() => updateDraftSet(currentSet.setNumber, { reps: currentSet.reps + 1 })}
              >
                <Text className="text-3xl font-black text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4">
            <PlateCalculator barWeight={profile.barWeight} totalWeight={currentSet.weight} />
          </View>

          <View className="mt-5 rounded-lg bg-white p-4">
            <Text className="text-sm font-black text-ink">セット操作</Text>
            <View className="mt-3 flex-row">
              <TouchableOpacity
                accessibilityRole="button"
                className={`mr-2 h-14 flex-1 items-center justify-center rounded-lg ${
                  canGoNext ? "bg-ink" : "bg-steel/30"
                }`}
                disabled={!canGoNext}
                onPress={nextSet}
              >
                <Text className="text-base font-black text-white">次のセットへ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                className="ml-2 h-14 flex-1 items-center justify-center rounded-lg bg-panel"
                onPress={addDraftSet}
              >
                <Text className="text-base font-black text-ink">セット追加</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              className="mt-3 h-16 items-center justify-center rounded-lg bg-lift"
              onPress={complete}
            >
              <Text className="text-lg font-black text-white">記録終了</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
