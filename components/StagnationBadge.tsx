import { Text, TouchableOpacity, View } from "react-native";

interface StagnationBadgeProps {
  message: string;
  onPress?: () => void;
}

export function StagnationBadge({ message, onPress }: StagnationBadgeProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      className="rounded-lg border border-lift/40 bg-[#2a1616] px-4 py-3"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-black text-[#ff7a64]">停滞検知</Text>
      </View>
      <Text className="mt-1 text-xs font-semibold leading-4 text-white/80">{message}</Text>
    </TouchableOpacity>
  );
}
