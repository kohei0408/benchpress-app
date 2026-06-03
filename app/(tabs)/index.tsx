import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AIRecommendCard } from "@/components/AIRecommendCard";
import { StagnationBadge } from "@/components/StagnationBadge";
import { SuccessScoreRing } from "@/components/SuccessScoreRing";
import { totalVolume } from "@/constants/formulas";
import { screenFlex, scrollContent } from "@/constants/layout";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { useAIRecommendation } from "@/hooks/useAIRecommendation";
import { useStagnationDetect } from "@/hooks/useStagnationDetect";
import { useSuccessScore } from "@/hooks/useSuccessScore";
import { useFatigueStore } from "@/stores/fatigueStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { WorkoutSession } from "@/types";

function HistoryRow({ item, onPress }: { item: WorkoutSession; onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      className="mb-2 min-h-16 rounded-lg border border-lift/20 bg-ink px-4 py-3"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-sm font-black text-white">{SET_TYPE_LABELS[item.setType]}</Text>
          <Text className="mt-1 text-xs text-white/45">{new Date(item.date).toLocaleDateString("ja-JP")}</Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-black text-white">{item.estimated1RM.toFixed(1)} kg</Text>
          <Text className="text-xs font-bold text-lift">VOL {totalVolume(item.sets).toLocaleString()} kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const profile = useSessionStore((state) => state.profile);
  const fatigue = useFatigueStore((state) => state.latest);
  const setSleepHours = useFatigueStore((state) => state.setSleepHours);
  const stagnation = useStagnationDetect(sessions);
  const score = useSuccessScore(sessions, fatigue, stagnation.weeks, profile.targetWeight);
  const latestOneRm = sessions[0]?.estimated1RM ?? 0;
  const ai = useAIRecommendation(sessions, fatigue);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [sleepInput, setSleepInput] = useState(fatigue.sleepHours.toFixed(1));
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const saveSleep = () => {
    const next = Number(sleepInput);
    if (Number.isFinite(next)) {
      setSleepHours(Math.max(0, Math.min(14, next)));
    }
    setSleepModalOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-panel" style={screenFlex} edges={["top"]}>
      <View className="flex-1">
        <ScrollView style={screenFlex} contentContainerStyle={{ ...scrollContent, paddingBottom: 112 }}>
          <View className="mb-4">
            <Text className="text-4xl font-black text-ink">BenchMax</Text>
          </View>

          <SuccessScoreRing
            estimatedOneRm={latestOneRm}
            score={score.score}
            targetWeight={profile.targetWeight}
          />

          <View className="mt-4 flex-row">
            <TouchableOpacity
              accessibilityRole="button"
              className="mr-1 flex-1 rounded-lg border border-lift/25 bg-ink p-4"
              onPress={() => {
                setSleepInput(fatigue.sleepHours.toFixed(1));
                setSleepModalOpen(true);
              }}
            >
              <Text className="text-xs font-bold text-lift">睡眠</Text>
              <Text className="mt-1 text-2xl font-black text-white">{fatigue.sleepHours.toFixed(1)} h</Text>
            </TouchableOpacity>
            <View className="ml-1 flex-1 rounded-lg border border-lift/25 bg-ink p-4">
              <Text className="text-xs font-bold text-lift">疲労</Text>
              <Text className="mt-1 text-2xl font-black text-white">{fatigue.fatigueScore}/100</Text>
            </View>
          </View>

          {stagnation.isStagnating ? (
            <View className="mt-4">
              <StagnationBadge message={stagnation.message} />
            </View>
          ) : null}

          <View className="mt-4">
            <AIRecommendCard
              isLoading={ai.isLoading}
              onRefresh={ai.refresh}
              recommendation={ai.recommendation}
            />
          </View>

          <View className="mt-6">
            <Text className="mb-3 text-lg font-black text-ink">直近5件</Text>
            {sessions.slice(0, 5).map((item) => (
              <HistoryRow item={item} key={item.id} onPress={() => setSelectedSession(item)} />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          accessibilityRole="button"
          className="absolute bottom-6 right-5 h-16 w-16 items-center justify-center rounded-full bg-lift"
          onPress={() => router.push("/(modal)/set-select")}
        >
          <Text className="text-4xl font-black leading-[44px] text-ink">+</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent visible={sleepModalOpen}>
        <View className="flex-1 justify-end bg-black/55 px-5 pb-8">
          <View className="rounded-lg bg-panel p-5">
            <Text className="text-xl font-black text-ink">今日の睡眠時間</Text>
            <View className="mt-4 flex-row items-center rounded-lg border border-ink/15 bg-white px-4 py-3">
              <TextInput
                className="flex-1 text-3xl font-black text-ink"
                keyboardType="numeric"
                onChangeText={setSleepInput}
                value={sleepInput}
              />
              <Text className="text-lg font-black text-steel">h</Text>
            </View>
            <View className="mt-4 flex-row">
              <TouchableOpacity
                accessibilityRole="button"
                className="mr-2 h-12 flex-1 items-center justify-center rounded-lg bg-white"
                onPress={() => setSleepModalOpen(false)}
              >
                <Text className="font-black text-ink">戻る</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                className="ml-2 h-12 flex-1 items-center justify-center rounded-lg bg-lift"
                onPress={saveSleep}
              >
                <Text className="font-black text-ink">保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={selectedSession !== null}>
        <View className="flex-1 justify-end bg-black/55 px-5 pb-8">
          <View className="max-h-[78%] rounded-lg bg-panel p-5">
            {selectedSession ? (
              <ScrollView>
                <Text className="text-xl font-black text-ink">{SET_TYPE_LABELS[selectedSession.setType]}</Text>
                <Text className="mt-1 text-sm font-bold text-steel">
                  {new Date(selectedSession.date).toLocaleString("ja-JP")}
                </Text>
                <View className="mt-4 rounded-lg bg-ink p-4">
                  <Text className="text-xs font-bold text-lift">推定1RM</Text>
                  <Text className="mt-1 text-3xl font-black text-white">
                    {selectedSession.estimated1RM.toFixed(1)} kg
                  </Text>
                </View>
                <View className="mt-4">
                  {selectedSession.sets.map((set) => (
                    <View className="mb-2 flex-row justify-between rounded-lg bg-white px-4 py-3" key={set.setNumber}>
                      <Text className="font-black text-ink">{set.setNumber} セット目</Text>
                      <Text className="font-black text-ink">
                        {set.weight} kg x {set.reps}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null}
            <TouchableOpacity
              accessibilityRole="button"
              className="mt-4 h-12 items-center justify-center rounded-lg bg-lift"
              onPress={() => setSelectedSession(null)}
            >
              <Text className="font-black text-ink">閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
