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
    <View className="rounded-lg border border-black/5 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-black text-ink">AI 次回メニュー</Text>
        <TouchableOpacity
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-lg bg-panel"
          onPress={onRefresh}
        >
          <Text className="text-lg font-black text-ink">{isLoading ? "..." : "↻"}</Text>
        </TouchableOpacity>
      </View>
      <Text className="mt-3 text-sm leading-5 text-steel">{recommendation.comment}</Text>
      <View className="mt-4 rounded-lg bg-panel p-3">
        <Text className="text-xs font-bold text-steel">{SET_TYPE_LABELS[recommendation.setType]}</Text>
        <Text className="mt-1 text-xl font-black text-ink">
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
