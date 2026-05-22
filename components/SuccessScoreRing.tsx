import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface SuccessScoreRingProps {
  score: number;
  targetWeight: number;
  estimatedOneRm: number;
}

export function SuccessScoreRing({ score, targetWeight, estimatedOneRm }: SuccessScoreRingProps) {
  const radius = 86;
  const stroke = 16;
  const size = 210;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / 100));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center rounded-lg bg-ink px-5 py-6">
      <View className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2b3037"
            strokeWidth={stroke}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f05a3d"
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
          <Text className="text-sm font-semibold text-white/70">成功予測</Text>
          <Text className="text-5xl font-black text-white">{score}%</Text>
          <Text className="text-xs font-semibold text-white/60">TARGET {targetWeight} kg</Text>
        </View>
      </View>
      <View className="mt-4 flex-row gap-3">
        <View className="rounded-lg bg-white/10 px-4 py-3">
          <Text className="text-xs text-white/60">推定1RM</Text>
          <Text className="text-lg font-bold text-white">{estimatedOneRm.toFixed(1)} kg</Text>
        </View>
        <View className="rounded-lg bg-white/10 px-4 py-3">
          <Text className="text-xs text-white/60">目標まで</Text>
          <Text className="text-lg font-bold text-white">
            {Math.max(0, targetWeight - estimatedOneRm).toFixed(1)} kg
          </Text>
        </View>
      </View>
    </View>
  );
}
