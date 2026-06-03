import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { totalVolume } from "@/constants/formulas";
import { modalScrollContent, screenFlex } from "@/constants/layout";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { useDb } from "@/contexts/DbContext";
import { saveWorkoutSession } from "@/db/queries";
import { useSessionStore } from "@/stores/sessionStore";
import type { WorkoutSession } from "@/types";

export default function ResultScreen() {
  const db = useDb();
  const finishDraft = useSessionStore((state) => state.finishDraft);
  const addSession = useSessionStore((state) => state.addSession);
  const sessions = useSessionStore((state) => state.sessions);
  const [session, setSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    const finished = finishDraft();
    if (finished) {
      addSession(finished);
      setSession(finished);
    }
  }, [addSession, finishDraft]);

  useEffect(() => {
    if (!db || !session) {
      return;
    }
    void saveWorkoutSession(db, session);
  }, [db, session]);

  const latest = session ?? sessions[0];
  const previous = sessions.find((item) => item.id !== latest?.id);

  if (!latest) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-panel px-5" edges={["top", "bottom"]}>
        <Text className="text-center text-lg font-black text-ink">表示できる記録がありません</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="mt-5 min-h-12 rounded-lg bg-lift px-5 py-3"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="font-black text-ink">ホームへ戻る</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const latestVolume = totalVolume(latest.sets);
  const previousVolume = previous ? totalVolume(previous.sets) : 0;
  const volumeDiff = latestVolume - previousVolume;
  const challenge = Math.ceil((latest.estimated1RM * 0.97) / 2.5) * 2.5;

  return (
    <SafeAreaView className="flex-1 bg-panel" edges={["top", "bottom"]}>
      <ScrollView style={screenFlex} contentContainerStyle={modalScrollContent}>
        <View className="mb-5 flex-row items-center justify-between">
          <TouchableOpacity
            accessibilityRole="button"
            className="min-h-11 min-w-20 items-center justify-center rounded-lg bg-ink px-4"
            onPress={() => router.back()}
          >
            <Text className="text-base font-black text-white">戻る</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-right text-3xl font-black text-ink">リザルト</Text>
        </View>

        <View className="rounded-lg bg-ink p-6">
          <Text className="text-sm font-bold text-lift">{SET_TYPE_LABELS[latest.setType]}</Text>
          <Text className="mt-2 text-5xl font-black text-white">{latest.estimated1RM.toFixed(1)} kg</Text>
          <Text className="mt-2 text-sm font-semibold text-white/70">推定 1RM</Text>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-5">
          <Text className="text-base font-black text-white">
            {challenge} kg が挙がる可能性が高いです
          </Text>
          <Text className="mt-2 text-sm leading-5 text-white/65">
            今日の最高セットから見ると、次回はフォームを崩さず小さく更新を狙える状態です。
          </Text>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-5">
          <Text className="text-sm font-black text-lift">今回のボリューム</Text>
          <Text className="mt-2 text-3xl font-black text-white">{latestVolume.toLocaleString()} kg</Text>
          <Text className="mt-1 text-sm font-bold text-lift">
            前回比 {volumeDiff >= 0 ? "+" : ""}
            {volumeDiff.toLocaleString()} kg
          </Text>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-5">
          {latest.sets.map((set) => (
            <View className="mb-2 flex-row justify-between" key={set.setNumber}>
              <Text className="font-bold text-white/65">{set.setNumber} セット目</Text>
              <Text className="font-black text-white">
                {set.weight} kg x {set.reps}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          className="mt-5 h-16 items-center justify-center rounded-lg bg-lift"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-lg font-black text-ink">ホームへ戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
