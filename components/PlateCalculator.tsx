import { Text, View } from "react-native";
import { calculatePlates } from "@/constants/plates";

interface PlateCalculatorProps {
  totalWeight: number;
  barWeight: number;
}

export function PlateCalculator({ totalWeight, barWeight }: PlateCalculatorProps) {
  const plates = calculatePlates(totalWeight, barWeight);

  return (
    <View className="rounded-lg bg-panel p-4">
      <Text className="text-xs font-bold text-steel">プレート計算 片側</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {plates.length > 0 ? (
          plates.map((plate, index) => (
            <View key={`${plate}-${index}`} className="rounded-lg bg-ink px-3 py-2">
              <Text className="text-sm font-black text-white">{plate} kg</Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-steel">バーのみ</Text>
        )}
      </View>
      <Text className="mt-3 text-xs text-steel">
        {totalWeight} kg = バー {barWeight} kg + 片側 {Math.max(0, (totalWeight - barWeight) / 2)} kg
      </Text>
    </View>
  );
}
