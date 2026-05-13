import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUpdateRosca, useGetRosca, getGetRoscaDashboardQueryKey, getGetRoscaQueryKey, getListRoscasQueryKey, CreateRoscaBodyFrequency } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

const FREQUENCIES = [
  CreateRoscaBodyFrequency.weekly,
  CreateRoscaBodyFrequency.biweekly,
  CreateRoscaBodyFrequency.first_fifteenth,
  CreateRoscaBodyFrequency.semimonthly,
  CreateRoscaBodyFrequency.monthly,
] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function EditCircleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const circleId = Number(id);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [contributionAmount, setContributionAmount] = useState("100");
  const [totalCycles, setTotalCycles] = useState("10");

  const { data: rosca, isLoading } = useGetRosca(circleId, {
    query: {
      enabled: !!circleId,
      queryKey: getGetRoscaQueryKey(circleId),
    },
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const styles = makeStyles(colors);

  const freqLabel = (f: Frequency): string => {
    const map: Record<Frequency, string> = {
      weekly: t("weekly"),
      biweekly: t("biweekly"),
      first_fifteenth: t("firstFifteenth"),
      semimonthly: t("semimonthly"),
      monthly: t("monthly"),
    };
    return map[f];
  };

  useEffect(() => {
    if (!rosca) return;
    setName(rosca.name ?? "");
    setStartDate(rosca.startDate?.slice(0, 10) ?? "");
    setFrequency((rosca.frequency as Frequency) ?? "monthly");
    setContributionAmount(String(rosca.contributionAmount ?? 100));
    setTotalCycles(String(rosca.totalCycles ?? 10));
  }, [rosca]);

  const { mutate: updateRosca, isPending } = useUpdateRosca({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(circleId) });
        queryClient.invalidateQueries({ queryKey: getGetRoscaQueryKey(circleId) });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      },
      onError: () => {
        Alert.alert(t("error"), t("updateError"));
      },
    },
  });

  function handleSave() {
    const amount = parseFloat(contributionAmount);
    const cycles = parseInt(totalCycles, 10);
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert(t("error"), t("requireNameError"));
      return;
    }
    if (!startDate) {
      Alert.alert(t("error"), t("startDate") + " " + t("requireNameError").toLowerCase());
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t("error"), t("requireAmountError"));
      return;
    }
    if (isNaN(cycles) || cycles < 1) {
      Alert.alert(t("error"), t("totalCycles") + " inválido");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateRosca({
      id: circleId,
      data: {
        name: name.trim(),
        startDate,
        frequency,
        contributionAmount: amount,
        totalCycles: cycles,
      },
    });
  }

  function pickFrequency() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("cancelBtn"), ...FREQUENCIES.map(freqLabel)],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx > 0) setFrequency(FREQUENCIES[idx - 1]);
        }
      );
    } else {
      Alert.alert(
        t("frequency"),
        undefined,
        [
          ...FREQUENCIES.map((f) => ({ text: freqLabel(f), onPress: () => setFrequency(f) })),
          { text: t("cancelBtn"), style: "cancel" },
        ]
      );
    }
  }

  return (
    <TabletContainer>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.container, { paddingTop: topPad }]}>
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={22} color={colors.foreground} />
            </Pressable>
            <Text style={styles.headerTitle}>{t("editCircle")}</Text>
            <View style={{ width: 36 }} />
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.form}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.label}>{t("circleName")}</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={t("circleName")}
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>{t("startDate")}</Text>
                <TextInput
                  style={styles.input}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>{t("frequency")}</Text>
                <Pressable
                  style={({ pressed }) => [styles.input, styles.picker, pressed && { opacity: 0.7 }]}
                  onPress={pickFrequency}
                >
                  <Text style={[styles.pickerText, { color: colors.foreground }]}>{freqLabel(frequency)}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>

              <View style={styles.row}>
                <View style={[styles.section, { flex: 1 }]}>
                  <Text style={styles.label}>{t("baseAmount")}</Text>
                  <View style={styles.amountRow}>
                    <Text style={styles.dollar}>$</Text>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={contributionAmount}
                      onChangeText={setContributionAmount}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      placeholderTextColor={colors.mutedForeground}
                    />
                  </View>
                </View>

                <View style={[styles.section, { flex: 1 }]}>
                  <Text style={styles.label}>{t("totalCycles")}</Text>
                  <TextInput
                    style={styles.input}
                    value={totalCycles}
                    onChangeText={setTotalCycles}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.saveBtn,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.85 },
                  isPending && { opacity: 0.6 },
                ]}
                onPress={handleSave}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color={colors.primaryForeground} size="small" />
                ) : (
                  <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>{t("saveChanges")}</Text>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </TabletContainer>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 12,
      paddingTop: 6,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    form: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 },
    section: { marginBottom: 20 },
    row: { flexDirection: "row", gap: 12 },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    picker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    pickerText: { fontSize: 16, fontFamily: "Inter_400Regular" },
    amountRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    dollar: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginRight: 2,
    },
    saveBtn: {
      marginTop: 12,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    saveBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  });
}
