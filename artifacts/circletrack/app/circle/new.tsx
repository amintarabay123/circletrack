import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateRosca, getListRoscasQueryKey, CreateRoscaBodyFrequency } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";
import { CURRENCIES, getCurrencySymbol } from "@/constants/currencies";

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  return new Date(y || new Date().getFullYear(), (m || 1) - 1, d || 1);
}

function formatCreateFailureMessage(err: unknown, fallback: string): string {
  let raw = fallback;
  if (err instanceof Error && err.message.trim()) {
    raw = err.message;
  } else if (typeof err === "string" && err.trim()) {
    raw = err;
  }
  const msg = raw.trim() || fallback;
  return msg.length > 320 ? `${msg.slice(0, 320)}…` : msg;
}

type NewFrequency =
  | typeof CreateRoscaBodyFrequency.weekly
  | typeof CreateRoscaBodyFrequency.first_fifteenth
  | typeof CreateRoscaBodyFrequency.monthly;

export default function NewCircleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, lang } = useLang();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<NewFrequency>(CreateRoscaBodyFrequency.monthly);
  const [amount, setAmount] = useState("");
  const [totalCycles, setTotalCycles] = useState("12");
  const [startDate, setStartDate] = useState(() => toYMD(new Date()));
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(() => parseYMD(toYMD(new Date())));

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
          totalCycles: parseInt(totalCycles, 10) || 12,
          startDate,
          currency,
        },
      },
      {
        onSuccess: () => {
          router.back();
          queueMicrotask(() => {
            queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: (err) => {
          Alert.alert(t("error"), formatCreateFailureMessage(err, t("createError")));
        },
      }
    );
  };

  const styles = makeStyles(colors);
  const freqOptions: { key: NewFrequency; label: string }[] = [
    { key: CreateRoscaBodyFrequency.weekly, label: t("weekly") },
    { key: CreateRoscaBodyFrequency.first_fifteenth, label: t("firstFifteenth") },
    { key: CreateRoscaBodyFrequency.monthly, label: t("monthly") },
  ];

  const openPicker = () => {
    setDraftDate(parseYMD(startDate));
    setPickerOpen(true);
  };

  const formatStartDisplay = (ymd: string) => {
    try {
      const d = parseYMD(ymd);
      return d.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return ymd;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TabletContainer>
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
              {freqOptions.map((opt, i) => (
                <Pressable
                  key={opt.key}
                  style={[
                    styles.segment,
                    frequency === opt.key && {
                      backgroundColor: colors.primary,
                    },
                    { borderColor: colors.border },
                    i === freqOptions.length - 1 && { borderRightWidth: 0 },
                  ]}
                  onPress={() => setFrequency(opt.key)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: frequency === opt.key ? colors.primaryForeground : colors.foreground },
                    ]}
                    numberOfLines={2}
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
                <Text style={[styles.prefix, { color: colors.mutedForeground }]}>{getCurrencySymbol(currency)}</Text>
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
            <Text style={styles.label}>{t("currency")}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.input,
                { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderColor: showCurrencyPicker ? colors.primary : colors.border, backgroundColor: colors.card },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
            >
              <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 15 }}>
                {CURRENCIES.find((c) => c.code === currency)?.label ?? currency}
              </Text>
              <Ionicons name={showCurrencyPicker ? "chevron-up" : "chevron-down"} size={16} color={showCurrencyPicker ? colors.primary : colors.mutedForeground} />
            </Pressable>
            {showCurrencyPicker && (
              <View style={[styles.currencyList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {CURRENCIES.map((c, idx) => (
                  <Pressable
                    key={c.code}
                    style={({ pressed }) => [
                      styles.currencyItem,
                      idx < CURRENCIES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                      c.code === currency && { backgroundColor: colors.primary + "12" },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => {
                      setCurrency(c.code);
                      setShowCurrencyPicker(false);
                      Haptics.selectionAsync();
                    }}
                  >
                    <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 15, flex: 1 }}>
                      {c.label}
                    </Text>
                    {c.code === currency && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("startDate")}</Text>
            {Platform.OS === "web" ? (
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
              />
            ) : (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.dateBtn,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={openPicker}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.dateBtnPrimary, { color: colors.foreground }]}>{formatStartDisplay(startDate)}</Text>
                    <Text style={[styles.dateBtnHint, { color: colors.mutedForeground }]}>{t("chooseStartDate")}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color={colors.mutedForeground} />
                </Pressable>

                {Platform.OS === "ios" ? (
                  <Modal visible={pickerOpen} transparent animationType="slide">
                    <View style={styles.modalRoot}>
                      <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)} />
                      <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalBar, { borderBottomColor: colors.border }]}>
                          <Pressable onPress={() => setPickerOpen(false)}>
                            <Text style={[styles.modalBtn, { color: colors.mutedForeground }]}>{t("cancelBtn")}</Text>
                          </Pressable>
                          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t("startDate")}</Text>
                          <Pressable
                            onPress={() => {
                              setStartDate(toYMD(draftDate));
                              setPickerOpen(false);
                              Haptics.selectionAsync();
                            }}
                          >
                            <Text style={[styles.modalBtn, { color: colors.primary }]}>{t("done")}</Text>
                          </Pressable>
                        </View>
                        <DateTimePicker
                          value={draftDate}
                          mode="date"
                          display="spinner"
                          themeVariant={colors.background === "#111638" ? "dark" : "light"}
                          onChange={(_: DateTimePickerEvent, date?: Date) => {
                            if (date) setDraftDate(date);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : (
                  pickerOpen && (
                    <DateTimePicker
                      value={draftDate}
                      mode="date"
                      display="default"
                      onChange={(ev: DateTimePickerEvent, date?: Date) => {
                        setPickerOpen(false);
                        if (ev.type === "set" && date) {
                          setStartDate(toYMD(date));
                        }
                      }}
                    />
                  )
                )}
              </>
            )}
          </View>
        </ScrollView>
      </TabletContainer>
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
      paddingVertical: 10,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: colors.border,
      minHeight: 52,
    },
    segmentText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      textAlign: "center",
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    currencyList: {
      marginTop: 4,
      borderWidth: 1,
      borderRadius: 12,
      overflow: "hidden",
    },
    currencyItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    dateBtn: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    dateBtnPrimary: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    dateBtnHint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    modalRoot: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    modalBackdrop: {
      flex: 1,
    },
    modalSheet: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 28,
    },
    modalBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    modalBtn: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
