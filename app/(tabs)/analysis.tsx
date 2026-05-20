import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { totalVolume } from "@/constants/formulas";
import { useStagnationDetect } from "@/hooks/useStagnationDetect";
import { useSessionStore } from "@/stores/sessionStore";

const FILTERS = ["1M", "3M", "6M", "ALL"] as const;

export default function AnalysisScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const stagnation = useStagnationDetect(sessions);
  const ordered = [...sessions].reverse();
  const lineData = ordered.map((session) => ({
    value: session.estimated1RM,
    label: new Date(session.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
  }));
  const barData = ordered.map((session) => ({
    value: totalVolume(session.sets),
    label: new Date(session.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
    frontColor: "#121417",
  }));
  const best = Math.max(...ordered.map((session) => session.estimated1RM));

  return (
    <SafeAreaView className="flex-1 bg-panel">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8 pt-4">
        <Text className="text-3xl font-black text-ink">グラフ分析</Text>
        <View className="mt-4 flex-row gap-2">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              accessibilityRole="button"
              className={`h-10 flex-1 items-center justify-center rounded-lg ${
                filter === "1M" ? "bg-ink" : "bg-white"
              }`}
              key={filter}
            >
              <Text className={`font-black ${filter === "1M" ? "text-white" : "text-steel"}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {stagnation.isStagnating ? (
          <View className="mt-4 rounded-lg bg-lift/10 p-4">
            <Text className="text-sm font-black text-lift">停滞期間を検知</Text>
            <Text className="mt-1 text-xs text-ink">{stagnation.message}</Text>
          </View>
        ) : null}

        <View className="mt-5 rounded-lg bg-white p-4">
          <Text className="mb-3 text-base font-black text-ink">推定1RM推移</Text>
          <LineChart
            areaChart
            color="#e23d28"
            data={lineData}
            dataPointsColor="#e23d28"
            height={190}
            initialSpacing={12}
            maxValue={Math.ceil(best / 10) * 10}
            noOfSections={4}
            spacing={72}
            thickness={4}
            yAxisTextStyle={{ color: "#6b7280", fontSize: 10 }}
          />
          <Text className="mt-3 text-xs font-bold text-lift">自己ベスト {best.toFixed(1)} kg</Text>
        </View>

        <View className="mt-5 rounded-lg bg-white p-4">
          <Text className="mb-3 text-base font-black text-ink">週間ボリューム</Text>
          <BarChart
            barBorderRadius={5}
            barWidth={30}
            data={barData}
            height={190}
            noOfSections={4}
            spacing={34}
            yAxisTextStyle={{ color: "#6b7280", fontSize: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
