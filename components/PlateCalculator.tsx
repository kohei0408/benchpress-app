import { Text, View } from "react-native";
import { calculatePlates } from "@/constants/plates";

interface PlateCalculatorProps {
  totalWeight: number;
  barWeight: number;
}

export function PlateCalculator({ totalWeight, barWeight }: PlateCalculatorProps) {
  const plates = calculatePlates(totalWeight, barWeight);

  return (
    <View className="rounded-lg border border-white/10 bg-[#171a21] p-4">
      <Text className="text-xs font-bold text-white/45">プレート計算 片側</Text>
      <View className="mt-3 flex-row flex-wrap">
        {plates.length > 0 ? (
          plates.map((plate, index) => (
            <View key={`${plate}-${index}`} className="mb-2 mr-2 rounded-lg bg-white px-3 py-2">
              <Text className="text-sm font-black text-ink">{plate} kg</Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-white/60">バーのみ</Text>
        )}
      </View>
      <Text className="mt-2 text-xs text-white/45">
        {totalWeight} kg = バー {barWeight} kg + 片側 {Math.max(0, (totalWeight - barWeight) / 2)} kg
      </Text>
    </View>
  );
}
