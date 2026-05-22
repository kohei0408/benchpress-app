import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { totalVolume } from "@/constants/formulas";
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
  }, []);

  useEffect(() => {
    if (!db || !session) {
      return;
    }
    saveWorkoutSession(db, session).catch((err) => console.error("DB save error:", err));
  }, [db, session]);

  const latest = session ?? sessions[0];
  const previous = sessions.find((item) => item.id !== latest?.id);

  if (!latest) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-panel px-5">
        <Text className="text-lg font-black text-ink">表示できる記録がありません</Text>
      </SafeAreaView>
    );
  }

  const latestVolume = totalVolume(latest.sets);
  const previousVolume = previous ? totalVolume(previous.sets) : 0;
  const volumeDiff = latestVolume - previousVolume;
  const challenge = Math.ceil((latest.estimated1RM * 0.97) / 2.5) * 2.5;

  return (
    <SafeAreaView className="flex-1 bg-panel">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-3xl font-black text-ink">リザルト</Text>
        <View className="mt-6 rounded-lg bg-ink p-6">
          <Text className="text-sm font-bold text-white/60">{SET_TYPE_LABELS[latest.setType]}</Text>
          <Text className="mt-2 text-5xl font-black text-white">{latest.estimated1RM.toFixed(1)} kg</Text>
          <Text className="mt-2 text-sm font-semibold text-white/70">推定 1RM</Text>
        </View>

        <View className="mt-4 rounded-lg bg-white p-5">
          <Text className="text-base font-black text-ink">
            {challenge} kg が挙がる可能性が高いです
          </Text>
          <Text className="mt-2 text-sm leading-5 text-steel">
            今日の最高セットから見ると、次回はフォームを崩さず小さく更新を狙える状態です。
          </Text>
        </View>

        <View className="mt-4 rounded-lg bg-white p-5">
          <Text className="text-sm font-black text-ink">今回のボリューム</Text>
          <Text className="mt-2 text-3xl font-black text-ink">{latestVolume.toLocaleString()} kg</Text>
          <Text className={`mt-1 text-sm font-bold ${volumeDiff >= 0 ? "text-recovery" : "text-lift"}`}>
            前回比 {volumeDiff >= 0 ? "+" : ""}
            {volumeDiff.toLocaleString()} kg
          </Text>
        </View>

        <View className="mt-4 rounded-lg bg-white p-5">
          {latest.sets.map((set) => (
            <View className="mb-2 flex-row justify-between" key={set.setNumber}>
              <Text className="font-bold text-steel">{set.setNumber} セット目</Text>
              <Text className="font-black text-ink">
                {set.weight} kg x {set.reps}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          className="mt-auto mb-6 h-16 items-center justify-center rounded-lg bg-lift"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-lg font-black text-white">ホームへ戻る</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
