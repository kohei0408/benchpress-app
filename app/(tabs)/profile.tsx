import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MuscleMap } from "@/components/MuscleMap";
import { useFatigueStore } from "@/stores/fatigueStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { OneRmFormula } from "@/types";

export default function ProfileScreen() {
  const profile = useSessionStore((state) => state.profile);
  const updateProfile = useSessionStore((state) => state.updateProfile);
  const fatigue = useFatigueStore((state) => state.latest);
  const setSleepHours = useFatigueStore((state) => state.setSleepHours);
  const toggleMuscle = useFatigueStore((state) => state.toggleMuscle);

  return (
    <SafeAreaView className="flex-1 bg-panel">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8 pt-4">
        <Text className="text-3xl font-black text-ink">プロフィール</Text>
        <View className="mt-5 rounded-lg bg-white p-4">
          <Text className="text-sm font-black text-ink">目標重量</Text>
          <View className="mt-2 flex-row items-center rounded-lg bg-panel px-4 py-3">
            <TextInput
              className="flex-1 text-3xl font-black text-ink"
              keyboardType="numeric"
              onChangeText={(text) => updateProfile({ targetWeight: Number(text) || 0 })}
              value={String(profile.targetWeight)}
            />
            <Text className="text-lg font-black text-steel">kg</Text>
          </View>
        </View>

        <View className="mt-4 rounded-lg bg-white p-4">
          <Text className="text-sm font-black text-ink">バー重量</Text>
          <View className="mt-2 flex-row items-center rounded-lg bg-panel px-4 py-3">
            <TextInput
              className="flex-1 text-3xl font-black text-ink"
              keyboardType="numeric"
              onChangeText={(text) => updateProfile({ barWeight: Number(text) || 20 })}
              value={String(profile.barWeight)}
            />
            <Text className="text-lg font-black text-steel">kg</Text>
          </View>
        </View>

        <View className="mt-4 rounded-lg bg-white p-4">
          <Text className="text-sm font-black text-ink">1RM 計算式</Text>
          <View className="mt-3 flex-row gap-2">
            {(["epley", "brzycki"] as OneRmFormula[]).map((formula) => (
              <TouchableOpacity
                accessibilityRole="button"
                className={`h-11 flex-1 items-center justify-center rounded-lg ${
                  profile.oneRmFormula === formula ? "bg-ink" : "bg-panel"
                }`}
                key={formula}
                onPress={() => updateProfile({ oneRmFormula: formula })}
              >
                <Text
                  className={`font-black ${
                    profile.oneRmFormula === formula ? "text-white" : "text-steel"
                  }`}
                >
                  {formula === "epley" ? "Epley" : "Brzycki"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-4 rounded-lg bg-white p-4">
          <Text className="text-sm font-black text-ink">睡眠時間</Text>
          <View className="mt-3 flex-row items-center gap-3">
            <TouchableOpacity
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-lg bg-ink"
              onPress={() => setSleepHours(Math.max(0, fatigue.sleepHours - 0.5))}
            >
              <Text className="text-xl font-black text-white">-</Text>
            </TouchableOpacity>
            <Text className="flex-1 text-center text-3xl font-black text-ink">
              {fatigue.sleepHours.toFixed(1)} h
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-lg bg-ink"
              onPress={() => setSleepHours(Math.min(12, fatigue.sleepHours + 0.5))}
            >
              <Text className="text-xl font-black text-white">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          <MuscleMap onToggle={toggleMuscle} selected={fatigue.soreMuscles} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
