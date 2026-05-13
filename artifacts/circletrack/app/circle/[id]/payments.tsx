import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useListPayments,
  useDeletePayment,
  useRecordPayment,
  useGetRoscaDashboard,
  useListMembers,
  getListPaymentsQueryKey,
  getGetRoscaDashboardQueryKey,
  getListMembersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function PaymentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const circleId = Number(id);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const [cycleFilter, setCycleFilter] = useState<number | undefined>(undefined);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0);
  const [paymentCycle, setPaymentCycle] = useState("1");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const styles = makeStyles(colors);

  const { data: dashboard } = useGetRoscaDashboard(circleId, {
    query: { enabled: !!circleId, queryKey: getGetRoscaDashboardQueryKey(circleId) },
  });
  const { data: members } = useListMembers(circleId, {
    query: { enabled: !!circleId, queryKey: getListMembersQueryKey(circleId) },
  });
  const { data: payments, isLoading, refetch } = useListPayments(
    circleId,
    { cycle: cycleFilter },
    {
      query: {
        enabled: !!circleId,
        queryKey: getListPaymentsQueryKey(circleId, { cycle: cycleFilter }),
      },
    },
  );

  const totalCycles = dashboard?.rosca.totalCycles ?? 1;
  const currentCycle = dashboard?.rosca.currentCycle ?? 1;
  const contributionAmount = dashboard?.rosca.contributionAmount ?? 0;
  const cycleOptions = Array.from({ length: totalCycles }, (_, i) => i + 1);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey(circleId) });
    queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(circleId) });
  };

  const { mutate: deletePayment } = useDeletePayment({
    mutation: { onSuccess: () => { invalidate(); } },
  });

  const { mutate: recordPayment, isPending: recording } = useRecordPayment({
    mutation: {
      onSuccess: () => {
        invalidate();
        setAddOpen(false);
        resetForm();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Alert.alert(t("error"), t("requireAmountError")),
    },
  });

  function resetForm() {
    setSelectedMemberId(members?.[0]?.id ?? 0);
    setPaymentCycle(String(currentCycle));
    setPaymentAmount(String(contributionAmount));
    setPaymentNotes("");
  }

  function openAdd() {
    resetForm();
    setAddOpen(true);
  }

  function handleDelete(paymentId: number) {
    Alert.alert(t("deletePayment"), t("deletePaymentConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deletePayment({ id: circleId, paymentId });
        },
      },
    ]);
  }

  function handleSubmit() {
    const amount = parseFloat(paymentAmount);
    const cycle = parseInt(paymentCycle, 10);
    if (!selectedMemberId) { Alert.alert(t("error"), t("selectMember")); return; }
    if (isNaN(amount) || amount <= 0) { Alert.alert(t("error"), t("requireAmountError")); return; }
    if (isNaN(cycle) || cycle < 1) { Alert.alert(t("error"), t("cycle") + " inválido"); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    recordPayment({
      id: circleId,
      data: {
        memberId: selectedMemberId,
        cycle,
        amount,
        paidAt: new Date().toISOString(),
        notes: paymentNotes || null,
      },
    });
  }

  function pickMember() {
    if (!members?.length) return;
    Alert.alert(
      t("selectMember"),
      undefined,
      [
        ...members.map((m) => ({
          text: `${m.name} — $${(contributionAmount * m.shares).toLocaleString()}`,
          onPress: () => {
            setSelectedMemberId(m.id);
            setPaymentAmount(String(contributionAmount * m.shares));
          },
        })),
        { text: t("cancel"), style: "cancel" },
      ]
    );
  }

  const selectedMember = members?.find((m) => m.id === selectedMemberId);

  return (
    <TabletContainer>
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t("payments")}</Text>
            {dashboard && (
              <Text style={styles.headerSub}>{dashboard.rosca.name}</Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.8 }]}
            onPress={openAdd}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>

        {/* Cycle filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          <Text style={styles.pillLabel}>{t("filterByCycle")}</Text>
          <Pressable
            style={[styles.pill, !cycleFilter && { backgroundColor: colors.primary }]}
            onPress={() => setCycleFilter(undefined)}
          >
            <Text style={[styles.pillText, { color: !cycleFilter ? colors.primaryForeground : colors.mutedForeground }]}>
              {t("all")}
            </Text>
          </Pressable>
          {cycleOptions.map((c) => (
            <Pressable
              key={c}
              style={[styles.pill, cycleFilter === c && { backgroundColor: colors.primary }]}
              onPress={() => setCycleFilter(c)}
            >
              <Text style={[styles.pillText, { color: cycleFilter === c ? colors.primaryForeground : colors.mutedForeground }]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Payment list */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : !payments || payments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>{t("noPayments")}</Text>
            <Text style={styles.emptyDesc}>{t("noPaymentsDesc")}</Text>
            <Pressable
              style={({ pressed }) => [styles.emptyBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.8 }]}
              onPress={openAdd}
            >
              <Ionicons name="add" size={16} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>{t("recordPayment")}</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 20, paddingTop: 8 }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
            }
          >
            {payments.map((payment) => {
              const isLate = payment.isLate;
              return (
                <View key={payment.id} style={[styles.paymentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {(payment.memberName ?? "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={[styles.paymentName, { color: colors.foreground }]}>{payment.memberName}</Text>
                    <Text style={[styles.paymentSub, { color: colors.mutedForeground }]}>
                      {t("cycle")} {payment.cycle} · {formatDate(payment.paidAt)}
                    </Text>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={[styles.paymentAmount, { color: colors.foreground }]}>
                      ${Number(payment.amount).toLocaleString()}
                    </Text>
                    <View style={[
                      styles.badge,
                      { backgroundColor: isLate ? "#f59e0b20" : colors.success + "20" },
                    ]}>
                      <Text style={[styles.badgeText, { color: isLate ? "#f59e0b" : colors.success }]}>
                        {isLate ? t("lateBadge") : t("onTimeBadge")}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
                    onPress={() => handleDelete(payment.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.destructive} />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Add Payment Modal */}
        <Modal visible={addOpen} animationType="slide" transparent presentationStyle="overFullScreen">
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Pressable style={styles.modalOverlay} onPress={() => setAddOpen(false)} />
            <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: bottomPad + 20 }]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t("recordPayment")}</Text>

              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t("member")}</Text>
              <Pressable
                style={({ pressed }) => [styles.fieldInput, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.7 }]}
                onPress={pickMember}
              >
                <Text style={{ color: selectedMember ? colors.foreground : colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 16 }}>
                  {selectedMember
                    ? `${selectedMember.name} — $${(contributionAmount * selectedMember.shares).toLocaleString()}`
                    : t("selectMember")}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
              </Pressable>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t("cycle")}</Text>
                  <TextInput
                    style={[styles.fieldInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    value={paymentCycle}
                    onChangeText={setPaymentCycle}
                    keyboardType="number-pad"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t("amount")}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 16, marginRight: 4 }}>$</Text>
                    <TextInput
                      style={[styles.fieldInput, { flex: 1, backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                      value={paymentAmount}
                      onChangeText={setPaymentAmount}
                      keyboardType="decimal-pad"
                      placeholderTextColor={colors.mutedForeground}
                    />
                  </View>
                </View>
              </View>

              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t("notes")}</Text>
              <TextInput
                style={[styles.fieldInput, styles.notesInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                value={paymentNotes}
                onChangeText={setPaymentNotes}
                placeholder={t("notesPlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.modalCancelBtn, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}
                  onPress={() => setAddOpen(false)}
                >
                  <Text style={[styles.modalCancelText, { color: colors.foreground }]}>{t("cancel")}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.modalSaveBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.85 }, recording && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={recording}
                >
                  {recording
                    ? <ActivityIndicator color={colors.primaryForeground} size="small" />
                    : <Text style={[styles.modalSaveText, { color: colors.primaryForeground }]}>{t("record")}</Text>
                  }
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
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
      paddingBottom: 10,
      paddingTop: 6,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center", justifyContent: "center",
    },
    headerCenter: { flex: 1, marginHorizontal: 12 },
    headerTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 1 },
    addBtn: {
      width: 36, height: 36, borderRadius: 18,
      alignItems: "center", justifyContent: "center",
    },
    pillsRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 6,
    },
    pillLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginRight: 4,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.muted,
      minWidth: 36,
      alignItems: "center",
    },
    pillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
    emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginTop: 12 },
    emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 6, textAlign: "center" },
    emptyBtn: {
      flexDirection: "row", alignItems: "center", gap: 6,
      marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24,
    },
    emptyBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
    paymentCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      gap: 10,
    },
    avatar: {
      width: 38, height: 38, borderRadius: 19,
      alignItems: "center", justifyContent: "center",
    },
    avatarText: { fontSize: 15, fontFamily: "Inter_700Bold" },
    paymentInfo: { flex: 1 },
    paymentName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
    paymentSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
    paymentRight: { alignItems: "flex-end", gap: 4 },
    paymentAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
    badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20 },
    badgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
    deleteBtn: {
      width: 32, height: 32, borderRadius: 8,
      alignItems: "center", justifyContent: "center",
      backgroundColor: colors.destructive + "12",
    },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    modalSheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHandle: {
      width: 40, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 16 },
    fieldLabel: {
      fontSize: 12, fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase", letterSpacing: 0.5,
      marginBottom: 6, marginTop: 12,
    },
    fieldInput: {
      borderWidth: 1, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 12,
      fontSize: 16, fontFamily: "Inter_400Regular",
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    },
    notesInput: { height: 72, textAlignVertical: "top" },
    modalActions: { flexDirection: "row", gap: 10, marginTop: 20 },
    modalCancelBtn: {
      flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1,
      alignItems: "center",
    },
    modalCancelText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
    modalSaveBtn: {
      flex: 2, paddingVertical: 14, borderRadius: 12,
      alignItems: "center",
    },
    modalSaveText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  });
}
