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
import {
  useUpdateMember,
  getGetRoscaDashboardQueryKey,
  getGetMemberRatingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

export default function EditMemberScreen() {
  const { id, memberId, memberName, memberShares, memberTurnOrder } =
    useLocalSearchParams<{
      id: string;
      memberId: string;
      memberName: string;
      memberShares: string;
      memberTurnOrder: string;
    }>();

  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const [name, setName] = useState(decodeURIComponent(memberName ?? ""));
  const [shares, setShares] = useState(memberShares ?? "1");
  const [turnOrder, setTurnOrder] = useState(
    memberTurnOrder && memberTurnOrder !== "null" ? memberTurnOrder : ""
  );

  const { mutate: updateMember, isPending } = useUpdateMember();
  const circleId = Number(id);
  const memberIdNum = Number(memberId);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t("error"), t("requireNameError"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateMember(
      {
        id: circleId,
        memberId: memberIdNum,
        data: {
          name: name.trim(),
          shares: parseInt(shares) || 1,
          turnOrder: turnOrder ? parseInt(turnOrder) : undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetRoscaDashboardQueryKey(circleId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetMemberRatingsQueryKey(circleId),
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: (err) => {
          Alert.alert(
            t("error"),
            String((err as { message?: string })?.message ?? err)
          );
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
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomPad + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={22} color={colors.foreground} />
            </Pressable>
            <Text style={styles.title}>{t("editMember")}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: isPending
                    ? colors.muted
                    : colors.primary,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSave}
              disabled={isPending}
              testID="edit-member-submit"
            >
              <Text
                style={[
                  styles.saveBtnText,
                  {
                    color: isPending
                      ? colors.mutedForeground
                      : colors.primaryForeground,
                  },
                ]}
              >
                {isPending ? "..." : t("saveBtn")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("memberName")}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Nombre completo"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              testID="edit-member-name-input"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>{t("shares")}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                value={shares}
                onChangeText={setShares}
                placeholder="1"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>
                {t("turnOrder")}{" "}
                <Text style={styles.optional}>({t("optional")})</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
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

function makeStyles(
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>
) {
  return StyleSheet.create({
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
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
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
