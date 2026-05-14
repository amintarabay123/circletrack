import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
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
import {
  useUpdateMember,
  useListMembers,
  getGetRoscaDashboardQueryKey,
  getGetMemberRatingsQueryKey,
  getListMembersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

export default function EditMemberScreen() {
  const { id, memberId } = useLocalSearchParams<{ id: string; memberId: string }>();

  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const circleId = Number(id);
  const memberIdNum = Number(memberId);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState("1");
  const [turnOrder, setTurnOrder] = useState("");
  const [ready, setReady] = useState(false);

  const { data: members, isLoading: membersLoading } = useListMembers(circleId, {
    query: {
      enabled: !!circleId,
      queryKey: getListMembersQueryKey(circleId),
    },
  });

  useEffect(() => {
    if (!members) return;
    const member = members.find((m) => m.id === memberIdNum);
    if (member) {
      setName(member.name);
      setPhone(member.phone ?? "");
      setEmail(member.email ?? "");
      setShares(String(member.shares));
      setTurnOrder(member.turnOrder != null ? String(member.turnOrder) : "");
      setReady(true);
    }
  }, [members, memberIdNum]);

  const { mutate: updateMember, isPending } = useUpdateMember();

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t("error"), t("requireNameError"));
      return;
    }
    if (!turnOrder || isNaN(parseInt(turnOrder))) {
      Alert.alert(t("error"), t("requireTurnOrderError"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateMember(
      {
        id: circleId,
        memberId: memberIdNum,
        data: {
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          shares: parseInt(shares) || 1,
          turnOrder: parseInt(turnOrder),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(circleId) });
          queryClient.invalidateQueries({ queryKey: getGetMemberRatingsQueryKey(circleId) });
          queryClient.invalidateQueries({ queryKey: getListMembersQueryKey(circleId) });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: (err) => {
          Alert.alert(t("error"), String((err as { message?: string })?.message ?? err));
        },
      }
    );
  };

  const styles = makeStyles(colors);

  if (membersLoading || !ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

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
            <Text style={styles.title}>{t("editMember")}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: isPending ? colors.muted : colors.primary },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSave}
              disabled={isPending}
              testID="edit-member-submit"
            >
              <Text style={[styles.saveBtnText, { color: isPending ? colors.mutedForeground : colors.primaryForeground }]}>
                {isPending ? "..." : t("saveBtn")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("memberName")}</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
              value={name}
              onChangeText={setName}
              placeholder="Nombre completo"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              testID="edit-member-name-input"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              {t("phone")} <Text style={styles.optional}>({t("optional")})</Text>
            </Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+52 55 1234 5678"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              {t("email")} <Text style={styles.optional}>({t("optional")})</Text>
            </Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t("shares")}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
                value={shares}
                onChangeText={setShares}
                placeholder="1"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t("turnOrder")}</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
                value={turnOrder}
                onChangeText={setTurnOrder}
                placeholder="1"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </ScrollView>
      </TabletContainer>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    content: { padding: 20 },
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
    saveBtn: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 20,
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    field: { marginBottom: 20 },
    labelRow: {
      minHeight: 28,
      justifyContent: "flex-end",
      marginBottom: 8,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    optional: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      textTransform: "none",
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
    },
    row: { flexDirection: "row", gap: 12 },
  });
}
