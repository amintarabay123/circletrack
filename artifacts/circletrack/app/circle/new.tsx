import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
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
import { useCreateRosca } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

type Frequency = "weekly" | "biweekly" | "monthly";

export default function NewCircleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState("");
  const [totalCycles, setTotalCycles] = useState("12");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const { mutate: createRosca, isPending } = useCreateRosca();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert(t("error"), t("requireNameError"));
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert(t("error"), t("requireAmountError"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createRosca(
      {
        data: {
          name: name.trim(),
          frequency,
          contributionAmount: parseFloat(amount),
          totalCycles: parseInt(totalCycles) || 12,
          startDate,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["listRoscas"] });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: () => {
          Alert.alert(t("error"), "No se pudo crear la tanda.");
        },
      }
    );
  };

  const styles = makeStyles(colors);
  const freqOptions: { key: Frequency; label: string }[] = [
    { key: "weekly", label: t("weekly") },
    { key: "biweekly", label: t("biweekly") },
    { key: "monthly", label: t("monthly") },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={styles.title}>{t("newCircle")}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.createBtn,
              { backgroundColor: isPending ? colors.muted : colors.primary },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleCreate}
            disabled={isPending}
            testID="create-circle-submit"
          >
            <Text style={[styles.createBtnText, { color: isPending ? colors.mutedForeground : colors.primaryForeground }]}>
              {isPending ? "..." : t("createBtn")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("circleName")}</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Tanda Navidad 2025"
            placeholderTextColor={colors.mutedForeground}
            autoFocus
            testID="circle-name-input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("frequency")}</Text>
          <View style={styles.segmented}>
            {freqOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.segment,
                  frequency === opt.key && {
                    backgroundColor: colors.primary,
                  },
                  { borderColor: colors.border },
                ]}
                onPress={() => setFrequency(opt.key)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: frequency === opt.key ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>{t("contributionAmount")}</Text>
            <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.prefix, { color: colors.mutedForeground }]}>$</Text>
              <TextInput
                style={[styles.inputInner, { color: colors.foreground }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="500"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
                testID="circle-amount-input"
              />
            </View>
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>{t("totalCycles")}</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
              value={totalCycles}
              onChangeText={setTotalCycles}
              placeholder="12"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("startDate")}</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    content: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    createBtn: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 20,
    },
    createBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    field: {
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
    },
    prefix: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      marginRight: 4,
    },
    inputInner: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
    },
    segmented: {
      flexDirection: "row",
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    segment: {
      flex: 1,
      paddingVertical: 11,
      alignItems: "center",
      borderRightWidth: 1,
    },
    segmentText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
  });
}
