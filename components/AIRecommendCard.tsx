import { Text, TouchableOpacity, View } from "react-native";
import { SET_TYPE_LABELS } from "@/constants/setTypes";
import type { AIRecommendation } from "@/types";

interface AIRecommendCardProps {
  recommendation: AIRecommendation;
  isLoading?: boolean;
  onRefresh: () => void;
}

export function AIRecommendCard({ recommendation, isLoading, onRefresh }: AIRecommendCardProps) {
  const mainSet = recommendation.sets[0];

  return (
    <View className="overflow-hidden rounded-lg border border-[#1f2937] bg-[#171a21] p-4">
      <View className="absolute right-0 top-0 h-24 w-24 rounded-full bg-lift/20" />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-black uppercase text-[#19a7a1]">AI</Text>
          <Text className="mt-1 text-xl font-black text-white">AI 次回メニュー</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-lg bg-white/10"
          onPress={onRefresh}
        >
          <Text className="text-lg font-black text-white">{isLoading ? "..." : "↻"}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 rounded-lg bg-black/25 p-4">
        <Text className="text-xs font-bold text-white/50">{SET_TYPE_LABELS[recommendation.setType]}</Text>
        <Text className="mt-1 text-4xl font-black text-white">
          {mainSet ? `${mainSet.weight}kg` : "--"}
        </Text>
        <Text className="mt-1 text-base font-black text-[#f7c948]">
          {recommendation.sets.map((set) => `${set.weight}kg x ${set.reps}`).join("  /  ")}
        </Text>
      </View>

      <Text className="mt-4 text-sm font-semibold leading-5 text-white/75">{recommendation.comment}</Text>

      {recommendation.challengeWeight ? (
        <View className="mt-4 rounded-lg bg-lift px-4 py-3">
          <Text className="text-sm font-black text-white">
            {recommendation.challengeWeight} kg に挑戦できる可能性があります
          </Text>
        </View>
      ) : null}
    </View>
  );
}
