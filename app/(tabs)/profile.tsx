import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenFlex, scrollContent } from "@/constants/layout";
import { MuscleMap } from "@/components/MuscleMap";
import { useDb } from "@/contexts/DbContext";
import { useFatigueStore } from "@/stores/fatigueStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { FatigueLog, MuscleGroup, OneRmFormula } from "@/types";

function calcFatigueScore(sleepHours: number, soreMuscles: MuscleGroup[]): number {
  const sleepPenalty = sleepHours < 7 ? 30 : 0;
  const musclePenalty = Math.min(70, soreMuscles.length * 15);
  return Math.max(0, Math.min(100, sleepPenalty + musclePenalty));
}

export default function ProfileScreen() {
  const db = useDb();
  const profile = useSessionStore((state) => state.profile);
  const updateProfile = useSessionStore((state) => state.updateProfile);
  const fatigue = useFatigueStore((state) => state.latest);
  const setSleepHours = useFatigueStore((state) => state.setSleepHours);
  const toggleMuscle = useFatigueStore((state) => state.toggleMuscle);
  const saveLog = useFatigueStore((state) => state.saveLog);

  const handleSave = async () => {
    if (!db) {
      return;
    }
    const log: FatigueLog = {
      date: new Date().toISOString().split("T")[0],
      sleepHours: fatigue.sleepHours,
      soreMuscles: fatigue.soreMuscles,
      fatigueScore: calcFatigueScore(fatigue.sleepHours, fatigue.soreMuscles),
    };
    try {
      await saveLog(db, log);
    } catch (err) {
      console.error("Fatigue log save error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-panel" style={screenFlex} edges={["top"]}>
      <ScrollView style={screenFlex} contentContainerStyle={scrollContent}>
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

        <TouchableOpacity
          accessibilityRole="button"
          className="mt-5 h-14 items-center justify-center rounded-lg bg-lift"
          onPress={() => void handleSave()}
        >
          <Text className="text-base font-black text-white">疲労ログを保存</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
