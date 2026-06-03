import { Text, TouchableOpacity, View } from "react-native";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import type { AIRecommendation } from "@/types";

interface AIRecommendCardProps {
  recommendation: AIRecommendation;
  isLoading?: boolean;
  onRefresh: () => void;
}

export function AIRecommendCard({ recommendation, isLoading, onRefresh }: AIRecommendCardProps) {
  return (
    <View className="rounded-lg border border-lift/20 bg-ink p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-black text-white">AI 次回メニュー</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-lg bg-lift"
          onPress={onRefresh}
        >
          <Text className="text-lg font-black text-ink">{isLoading ? "..." : "↻"}</Text>
        </TouchableOpacity>
      </View>
      <Text className="mt-3 text-sm leading-5 text-white/70">{recommendation.comment}</Text>
      <View className="mt-4 rounded-lg bg-white/5 p-3">
        <Text className="text-xs font-bold text-lift">{SET_TYPE_LABELS[recommendation.setType]}</Text>
        <Text className="mt-1 text-xl font-black text-white">
          {recommendation.sets.map((set) => `${set.weight}kg x ${set.reps}`).join(" / ")}
        </Text>
        {recommendation.challengeWeight ? (
          <Text className="mt-2 text-sm font-bold text-lift">
            {recommendation.challengeWeight} kg に挑戦できる可能性があります
          </Text>
        ) : null}
      </View>
    </View>
  );
}
