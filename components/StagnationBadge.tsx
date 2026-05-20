import { Text, TouchableOpacity } from "react-native";

interface StagnationBadgeProps {
  message: string;
  onPress?: () => void;
}

export function StagnationBadge({ message, onPress }: StagnationBadgeProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      className="rounded-lg border border-lift/30 bg-lift/10 px-4 py-3"
      onPress={onPress}
    >
      <Text className="text-sm font-black text-lift">停滞検知</Text>
      <Text className="mt-1 text-xs leading-4 text-ink">{message}</Text>
    </TouchableOpacity>
  );
}
