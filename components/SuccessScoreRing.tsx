import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface SuccessScoreRingProps {
  score: number;
  targetWeight: number;
  estimatedOneRm: number;
}

export function SuccessScoreRing({ score, targetWeight, estimatedOneRm }: SuccessScoreRingProps) {
  const radius = 82;
  const stroke = 18;
  const size = 208;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / 100));
  const strokeDashoffset = circumference * (1 - progress);
  const gap = Math.max(0, targetWeight - estimatedOneRm);

  return (
    <View className="overflow-hidden rounded-lg bg-ink px-5 pb-5 pt-6">
      <View className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lift/20" />
      <View className="flex-row items-start justify-between">
        <Text className="text-xl font-black text-white">成功予測</Text>
        <View className="rounded-lg bg-lift px-3 py-2">
          <Text className="text-xs font-black text-ink">TARGET {targetWeight} kg</Text>
        </View>
      </View>

      <View className="mt-3 items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#26301f"
            strokeWidth={stroke}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#b7f34b"
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-xs font-black text-white/55">成功予測</Text>
          <Text className="text-6xl font-black text-white">{score}%</Text>
        </View>
      </View>

      <View className="mt-3 flex-row">
        <View className="mr-2 flex-1 rounded-lg border border-lift/20 bg-white/5 px-4 py-3">
          <Text className="text-xs font-bold text-lift">推定1RM</Text>
          <Text className="mt-1 text-2xl font-black text-white">{estimatedOneRm.toFixed(1)} kg</Text>
        </View>
        <View className="ml-2 flex-1 rounded-lg border border-lift/20 bg-white/5 px-4 py-3">
          <Text className="text-xs font-bold text-lift">目標まで</Text>
          <Text className="mt-1 text-2xl font-black text-white">{gap.toFixed(1)} kg</Text>
        </View>
      </View>
    </View>
  );
}
