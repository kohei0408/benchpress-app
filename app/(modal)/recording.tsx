import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { PlateCalculator } from "@/components/PlateCalculator";
import { WeightStepper } from "@/components/WeightStepper";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { useSessionStore } from "@/stores/sessionStore";

export default function RecordingScreen() {
  const draft = useSessionStore((state) => state.draft);
  const profile = useSessionStore((state) => state.profile);
  const sessions = useSessionStore((state) => state.sessions);
  const updateDraftSet = useSessionStore((state) => state.updateDraftSet);
  const nextSet = useSessionStore((state) => state.nextSet);
  const finishDraft = useSessionStore((state) => state.finishDraft);

  if (!draft) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-panel px-5">
        <Text className="text-center text-lg font-black text-ink">記録中のセットがありません</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="mt-5 rounded-lg bg-ink px-5 py-3"
          onPress={() => router.replace("/(modal)/set-select")}
        >
          <Text className="font-black text-white">セットを選ぶ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentSet = draft.sets[draft.currentIndex];
  const previousSameType = sessions.find((session) => session.setType === draft.setType);
  const previousSet = previousSameType?.sets.find((set) => set.setNumber === currentSet.setNumber);
  const isLast = draft.currentIndex === draft.sets.length - 1;

  const complete = () => {
    finishDraft();
    router.replace("/(modal)/result");
  };

  return (
    <SafeAreaView className="flex-1 bg-panel">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 px-5 pt-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-bold text-lift">{SET_TYPE_LABELS[draft.setType]}</Text>
            <Text className="text-3xl font-black text-ink">
              {currentSet.setNumber} セット目 / {draft.sets.length}
            </Text>
          </View>
          <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
            <Text className="text-base font-black text-steel">戻る</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 rounded-lg bg-white p-5">
          <WeightStepper
            onChange={(weight) => updateDraftSet(currentSet.setNumber, { weight })}
            value={currentSet.weight}
          />
          {previousSet ? (
            <Text className="mt-3 text-xs font-semibold text-steel/70">
              前回同一セット: {previousSet.weight} kg x {previousSet.reps}
            </Text>
          ) : null}
        </View>

        <View className="mt-4 rounded-lg bg-white p-5">
          <Text className="mb-3 text-xs font-bold text-steel">回数</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              accessibilityRole="button"
              className="h-14 w-14 items-center justify-center rounded-lg bg-ink"
              onPress={() => updateDraftSet(currentSet.setNumber, { reps: Math.max(1, currentSet.reps - 1) })}
            >
              <Text className="text-3xl font-black text-white">-</Text>
            </TouchableOpacity>
            <Text className="flex-1 text-center text-5xl font-black text-ink">{currentSet.reps}</Text>
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

        <View className="mt-auto pb-6">
          <TouchableOpacity
            accessibilityRole="button"
            className="h-16 items-center justify-center rounded-lg bg-lift"
            onPress={isLast ? complete : nextSet}
          >
            <Text className="text-lg font-black text-white">{isLast ? "記録終了" : "次のセットへ"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
