import { Link } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenFlex, scrollContent } from "@/constants/layout";
import { AIRecommendCard } from "@/components/AIRecommendCard";
import { StagnationBadge } from "@/components/StagnationBadge";
import { SuccessScoreRing } from "@/components/SuccessScoreRing";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import { totalVolume } from "@/constants/formulas";
import { useAIRecommendation } from "@/hooks/useAIRecommendation";
import { useStagnationDetect } from "@/hooks/useStagnationDetect";
import { useSuccessScore } from "@/hooks/useSuccessScore";
import { useFatigueStore } from "@/stores/fatigueStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { WorkoutSession } from "@/types";

function HistoryRow({ item }: { item: WorkoutSession }) {
  return (
    <TouchableOpacity accessibilityRole="button" className="mb-2 rounded-lg bg-white px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-black text-ink">{SET_TYPE_LABELS[item.setType]}</Text>
          <Text className="mt-1 text-xs text-steel">{new Date(item.date).toLocaleDateString("ja-JP")}</Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-black text-ink">{item.estimated1RM.toFixed(1)} kg</Text>
          <Text className="text-xs text-steel">VOL {totalVolume(item.sets).toLocaleString()} kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const profile = useSessionStore((state) => state.profile);
  const fatigue = useFatigueStore((state) => state.latest);
  const stagnation = useStagnationDetect(sessions);
  const score = useSuccessScore(sessions, fatigue, stagnation.weeks);
  const latestOneRm = sessions[0]?.estimated1RM ?? 0;
  const ai = useAIRecommendation(sessions, fatigue);

  return (
    <SafeAreaView className="flex-1 bg-panel" style={screenFlex} edges={["top"]}>
      <ScrollView style={screenFlex} contentContainerStyle={scrollContent}>
        <View className="mb-4">
          <Text className="text-3xl font-black text-ink">BenchMax</Text>
          <Text className="mt-1 text-sm font-semibold text-steel">ベンチプレス更新に全振り</Text>
        </View>

        <SuccessScoreRing
          estimatedOneRm={latestOneRm}
          score={score.score}
          targetWeight={profile.targetWeight}
        />

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1 rounded-lg bg-white p-3">
            <Text className="text-xs font-bold text-steel">睡眠</Text>
            <Text className="mt-1 text-xl font-black text-ink">{fatigue.sleepHours.toFixed(1)} h</Text>
          </View>
          <View className="flex-1 rounded-lg bg-white p-3">
            <Text className="text-xs font-bold text-steel">疲労</Text>
            <Text className="mt-1 text-xl font-black text-ink">{fatigue.fatigueScore}/100</Text>
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

        <Link asChild href="/(modal)/set-select">
          <TouchableOpacity
            accessibilityRole="button"
            className="mt-5 h-16 items-center justify-center rounded-lg bg-lift"
          >
            <Text className="text-lg font-black text-white">記録を始める</Text>
          </TouchableOpacity>
        </Link>

        <View className="mt-6">
          <Text className="mb-3 text-lg font-black text-ink">直近5件</Text>
          {sessions.slice(0, 5).map((item) => (
            <HistoryRow item={item} key={item.id} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
