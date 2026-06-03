import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MuscleMap } from "@/components/MuscleMap";
import { screenFlex, scrollContent } from "@/constants/layout";
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
    await saveLog(db, log);
  };

  return (
    <SafeAreaView className="flex-1 bg-panel" style={screenFlex} edges={["top"]}>
      <ScrollView style={screenFlex} contentContainerStyle={scrollContent} keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-black text-ink">プロフィール</Text>
        <View className="mt-5 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="text-sm font-black text-lift">目標重量</Text>
          <View className="mt-2 min-h-16 flex-row items-center rounded-lg bg-white/5 px-4 py-3">
            <TextInput
              className="flex-1 text-3xl font-black text-white"
              keyboardType="numeric"
              onChangeText={(text) => updateProfile({ targetWeight: Number(text) || 0 })}
              value={String(profile.targetWeight)}
            />
            <Text className="text-lg font-black text-white/55">kg</Text>
          </View>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="text-sm font-black text-lift">バー重量</Text>
          <View className="mt-2 min-h-16 flex-row items-center rounded-lg bg-white/5 px-4 py-3">
            <TextInput
              className="flex-1 text-3xl font-black text-white"
              keyboardType="numeric"
              onChangeText={(text) => updateProfile({ barWeight: Number(text) || 20 })}
              value={String(profile.barWeight)}
            />
            <Text className="text-lg font-black text-white/55">kg</Text>
          </View>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="text-sm font-black text-lift">1RM 計算式</Text>
          <View className="mt-3 flex-row">
            {(["epley", "brzycki"] as OneRmFormula[]).map((formula, index) => (
              <TouchableOpacity
                accessibilityRole="button"
                className={`h-11 flex-1 items-center justify-center rounded-lg ${
                  index === 0 ? "mr-1" : "ml-1"
                } ${profile.oneRmFormula === formula ? "bg-lift" : "bg-white/10"}`}
                key={formula}
                onPress={() => updateProfile({ oneRmFormula: formula })}
              >
                <Text
                  className={`font-black ${
                    profile.oneRmFormula === formula ? "text-ink" : "text-white"
                  }`}
                >
                  {formula === "epley" ? "Epley" : "Brzycki"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="text-sm font-black text-lift">睡眠時間</Text>
          <View className="mt-3 flex-row items-center">
            <TouchableOpacity
              accessibilityRole="button"
              className="h-12 w-12 items-center justify-center rounded-lg bg-white/10"
              onPress={() => setSleepHours(Math.max(0, fatigue.sleepHours - 0.5))}
            >
              <Text className="text-xl font-black text-white">-</Text>
            </TouchableOpacity>
            <Text className="mx-3 flex-1 text-center text-3xl font-black text-white">
              {fatigue.sleepHours.toFixed(1)} h
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              className="h-12 w-12 items-center justify-center rounded-lg bg-lift"
              onPress={() => setSleepHours(Math.min(12, fatigue.sleepHours + 0.5))}
            >
              <Text className="text-xl font-black text-ink">+</Text>
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
          <Text className="text-base font-black text-ink">疲労ログを保存</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
