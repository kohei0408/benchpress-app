import { useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface WeightStepperProps {
  value: number;
  onChange: (value: number) => void;
}

const DELTAS = [-5, -2.5, 2.5, 5] as const;

export function WeightStepper({ value, onChange }: WeightStepperProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRepeat = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    timeoutRef.current = null;
    intervalRef.current = null;
  };

  const applyDelta = (delta: number) => onChange(Math.max(20, Math.round((value + delta) * 10) / 10));

  const startRepeat = (delta: number) => {
    stopRepeat();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => applyDelta(delta), 100);
    }, 500);
  };

  return (
    <View>
      <Text className="mb-2 text-xs font-bold text-steel">重量</Text>
      <View className="min-h-16 flex-row items-center rounded-lg bg-panel px-4 py-3">
        <TextInput
          className="flex-1 text-center text-4xl font-black text-ink"
          keyboardType="numeric"
          onChangeText={(text) => onChange(Number(text) || 20)}
          value={String(value)}
        />
        <Text className="text-xl font-black text-steel">kg</Text>
      </View>
      <View className="mt-3 flex-row flex-wrap">
        {DELTAS.map((delta) => (
          <TouchableOpacity
            accessibilityRole="button"
            className="mb-2 mr-2 h-12 min-w-[72px] flex-1 items-center justify-center rounded-lg bg-ink"
            key={delta}
            onLongPress={() => startRepeat(delta)}
            onPress={() => applyDelta(delta)}
            onPressOut={stopRepeat}
          >
            <Text className="text-sm font-black text-white">
              {delta > 0 ? "+" : ""}
              {delta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
