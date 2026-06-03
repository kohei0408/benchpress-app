import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { totalVolume } from "@/constants/formulas";
import { screenFlex, scrollContent } from "@/constants/layout";
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
    frontColor: "#b7f34b",
  }));
  const best = ordered.length > 0 ? Math.max(...ordered.map((session) => session.estimated1RM)) : 0;

  return (
    <SafeAreaView className="flex-1 bg-panel" style={screenFlex} edges={["top"]}>
      <ScrollView style={screenFlex} contentContainerStyle={scrollContent}>
        <Text className="text-3xl font-black text-ink">グラフ分析</Text>
        <View className="mt-4 flex-row">
          {FILTERS.map((filter, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              className={`h-10 flex-1 items-center justify-center rounded-lg ${
                index === 0 ? "bg-lift" : "bg-ink"
              } ${index > 0 ? "ml-2" : ""}`}
              key={filter}
            >
              <Text className={`font-black ${index === 0 ? "text-ink" : "text-white"}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {stagnation.isStagnating ? (
          <View className="mt-4 rounded-lg border border-lift/20 bg-ink p-4">
            <Text className="text-sm font-black text-lift">停滞期間を検知</Text>
            <Text className="mt-1 text-xs text-white/75">{stagnation.message}</Text>
          </View>
        ) : null}

        <View className="mt-5 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="mb-3 text-base font-black text-white">推定1RM推移</Text>
          <LineChart
            areaChart
            color="#b7f34b"
            data={lineData}
            dataPointsColor="#b7f34b"
            height={190}
            initialSpacing={12}
            maxValue={Math.max(100, Math.ceil(best / 10) * 10)}
            noOfSections={4}
            spacing={72}
            thickness={4}
            yAxisTextStyle={{ color: "#d9e7c5", fontSize: 10 }}
          />
          <Text className="mt-3 text-xs font-bold text-lift">自己ベスト {best.toFixed(1)} kg</Text>
        </View>

        <View className="mt-5 rounded-lg border border-lift/20 bg-ink p-4">
          <Text className="mb-3 text-base font-black text-white">週間ボリューム</Text>
          <BarChart
            barBorderRadius={5}
            barWidth={30}
            data={barData}
            height={190}
            noOfSections={4}
            spacing={34}
            yAxisTextStyle={{ color: "#d9e7c5", fontSize: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
