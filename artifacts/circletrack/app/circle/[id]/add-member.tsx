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
import { useAddMember } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

export default function AddMemberScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState("1");
  const [turnOrder, setTurnOrder] = useState("");

  const { mutate: addMember, isPending } = useAddMember();
  const circleId = Number(id);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert(t("error"), t("requireNameError"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addMember(
      {
        id: circleId,
        data: {
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          shares: parseInt(shares) || 1,
          turnOrder: turnOrder ? parseInt(turnOrder) : null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["listMembers", circleId] });
          queryClient.invalidateQueries({ queryKey: ["getRoscaDashboard", circleId] });
          queryClient.invalidateQueries({ queryKey: ["getMemberRatings", circleId] });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
        onError: () => {
          Alert.alert(t("error"), "No se pudo agregar el integrante.");
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
          <Text style={styles.title}>{t("addMember")}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: isPending ? colors.muted : colors.primary },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleAdd}
            disabled={isPending}
            testID="add-member-submit"
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
            testID="member-name-input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("phone")} <Text style={styles.optional}>({t("optional")})</Text></Text>
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
          <Text style={styles.label}>{t("email")} <Text style={styles.optional}>({t("optional")})</Text></Text>
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
            <Text style={styles.label}>{t("shares")}</Text>
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
            <Text style={styles.label}>{t("turnOrder")} <Text style={styles.optional}>({t("optional")})</Text></Text>
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
