import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { MuscleGroup } from "@/types";

interface MuscleMapProps {
  selected: MuscleGroup[];
  onToggle: (muscle: MuscleGroup) => void;
}

const MUSCLES: { id: MuscleGroup; label: string; d: string }[] = [
  { id: "pectoralis", label: "胸", d: "M62 58 C78 48 98 48 114 58 L108 98 C92 92 78 92 62 98 Z" },
  { id: "anterior-delt", label: "肩", d: "M40 60 C48 48 58 48 64 60 L54 92 C42 90 34 78 40 60 Z" },
  { id: "triceps", label: "三頭", d: "M116 62 C128 50 140 56 142 74 L132 112 C122 104 118 88 116 62 Z" },
  { id: "lat", label: "広背", d: "M58 104 C78 116 98 116 118 104 L108 152 C92 164 78 164 62 152 Z" },
  { id: "biceps", label: "二頭", d: "M28 78 C38 80 44 92 42 112 L34 146 C24 128 22 98 28 78 Z" },
];

export function MuscleMap({ selected, onToggle }: MuscleMapProps) {
  return (
    <View className="rounded-lg border border-lift/20 bg-ink p-4">
      <Text className="text-base font-black text-white">筋肉痛部位</Text>
      <View className="mt-3 flex-row items-center">
        <Svg width={160} height={200} viewBox="0 0 170 210">
          {MUSCLES.map((muscle) => (
            <Path
              d={muscle.d}
              fill={selected.includes(muscle.id) ? "#b7f34b" : "#2d3329"}
              key={muscle.id}
              onPress={() => onToggle(muscle.id)}
              stroke="#b7f34b"
              strokeOpacity={0.35}
              strokeWidth={2}
            />
          ))}
        </Svg>
        <View className="ml-3 flex-1">
          {MUSCLES.map((muscle) => (
            <TouchableOpacity
              accessibilityRole="button"
              className={`mb-2 rounded-lg px-3 py-2 ${
                selected.includes(muscle.id) ? "bg-lift" : "bg-white/10"
              }`}
              key={muscle.id}
              onPress={() => onToggle(muscle.id)}
            >
              <Text
                className={`text-sm font-bold ${
                  selected.includes(muscle.id) ? "text-ink" : "text-white"
                }`}
              >
                {muscle.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
