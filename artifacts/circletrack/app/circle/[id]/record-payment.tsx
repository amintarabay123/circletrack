import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { useRecordPayment, useGetRoscaDashboard } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

export default function RecordPaymentScreen() {
  const { id, memberId, memberName, amountDue } = useLocalSearchParams<{
    id: string;
    memberId: string;
    memberName: string;
    amountDue: string;
  }>();

  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const circleId = Number(id);
  const { data: dashboard } = useGetRoscaDashboard(circleId, {
    query: { enabled: !isNaN(circleId) },
  });

  const [amount, setAmount] = useState(amountDue ? parseFloat(amountDue).toFixed(2) : "");
  const [notes, setNotes] = useState("");
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().split("T")[0]);

  const { mutate: recordPayment, isPending } = useRecordPayment();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleRecord = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert(t("error"), t("requireAmountError"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    recordPayment(
      {
        id: circleId,
        data: {
          memberId: Number(memberId),
          cycle: dashboard?.currentCycle ?? 1,
          amount: parseFloat(amount),
          paidAt: new Date(paidAt).toISOString(),
          notes: notes.trim() || null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getRoscaDashboard", circleId] });
          queryClient.invalidateQueries({ queryKey: ["listPayments", circleId] });
          queryClient.invalidateQueries({ queryKey: ["getMemberRatings", circleId] });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: () => {
          Alert.alert(t("error"), "No se pudo registrar el pago.");
        },
      }
    );
  };

  const styles = makeStyles(colors);

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
          <Text style={styles.title}>{t("recordPayment")}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: isPending ? colors.muted : colors.primary },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleRecord}
            disabled={isPending}
            testID="record-payment-submit"
          >
            <Text style={[styles.saveBtnText, { color: isPending ? colors.mutedForeground : colors.primaryForeground }]}>
              {isPending ? "..." : t("record")}
            </Text>
          </Pressable>
        </View>

        {memberName && (
          <View style={[styles.memberBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
            <View style={[styles.memberInitials, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.memberInitialsText, { color: colors.primary }]}>
                {decodeURIComponent(memberName).charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.memberBadgeText, { color: colors.foreground }]}>
              {decodeURIComponent(memberName)}
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>{t("amount")}</Text>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.prefix, { color: colors.mutedForeground }]}>$</Text>
            <TextInput
              style={[styles.inputInner, { color: colors.foreground }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="decimal-pad"
              autoFocus
              testID="payment-amount-input"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("paymentDate")}</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
            value={paidAt}
            onChangeText={setPaidAt}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("notes")} <Text style={styles.optional}>({t("optional")})</Text></Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas adicionales..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            testID="payment-notes-input"
          />
        </View>
      </ScrollView>
    </TabletContainer>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    content: { padding: 20 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
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
    saveBtn: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 20,
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    memberBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      borderWidth: 1,
    },
    memberInitials: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    memberInitialsText: { fontSize: 16, fontFamily: "Inter_700Bold" },
    memberBadgeText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
    field: { marginBottom: 20 },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    optional: { fontSize: 12, fontFamily: "Inter_400Regular", textTransform: "none" },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
    },
    prefix: { fontSize: 16, fontFamily: "Inter_500Medium", marginRight: 4 },
    inputInner: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
    },
  });
}
