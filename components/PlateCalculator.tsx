import { Text, View } from "react-native";
import { calculatePlates } from "@/constants/plates";

interface PlateCalculatorProps {
  totalWeight: number;
  barWeight: number;
}

export function PlateCalculator({ totalWeight, barWeight }: PlateCalculatorProps) {
  const plates = calculatePlates(totalWeight, barWeight);

  return (
    <View className="rounded-lg border border-lift/20 bg-ink p-4">
      <Text className="text-xs font-bold text-lift">プレート計算 片側</Text>
      <View className="mt-3 flex-row flex-wrap">
        {plates.length > 0 ? (
          plates.map((plate, index) => (
            <View key={`${plate}-${index}`} className="mb-2 mr-2 rounded-lg bg-lift px-3 py-2">
              <Text className="text-sm font-black text-ink">{plate} kg</Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-white/65">バーのみ</Text>
        )}
      </View>
      <Text className="mt-2 text-xs text-white/50">
        {totalWeight} kg = バー {barWeight} kg + 片側 {Math.max(0, (totalWeight - barWeight) / 2)} kg
      </Text>
    </View>
  );
}
