import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { useIsTablet } from "@/hooks/useIsTablet";
import { TabletContainer } from "@/components/TabletContainer";
import { tokenCache } from "@/lib/tokenCache";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, setLang, t } = useLang();
  const isTablet = useIsTablet();
  const { signOut, getToken } = useAuth();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + (isTablet ? 124 : 96) : insets.bottom + (isTablet ? 124 : 96);

  const handleSignOut = () => {
    Alert.alert(t("signOut"), t("signOut") + "?", [
      { text: t("cancelBtn"), style: "cancel" },
      {
        text: t("signOut"),
        style: "destructive",
        onPress: async () => {
          await tokenCache.clearToken?.("__clerk_client_jwt");
          await signOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("deleteAccount"), t("deleteAccountConfirm"), [
      { text: t("cancelBtn"), style: "cancel" },
      {
        text: t("deleteAccount"),
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            const token = await getToken();
            const domain = process.env.EXPO_PUBLIC_DOMAIN;
            await fetch(`https://${domain}/api/account`, {
              method: "DELETE",
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            await user?.delete();
          } catch {
            setIsDeleting(false);
            Alert.alert(t("error"), t("deleteAccountError"));
          }
        },
      },
    ]);
  };

  const styles = makeStyles(colors, isTablet);

  return (
    <TabletContainer>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>{t("settings")}</Text>

      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("account")}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name="person" size={isTablet ? 30 : 26} color={colors.primary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user.fullName || user.username || user.primaryEmailAddress?.emailAddress}
                </Text>
                <Text style={styles.userEmail}>
                  {user.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t("language")}</Text>
        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [
              styles.langRow,
              pressed && styles.pressed,
            ]}
            onPress={() => setLang("es")}
          >
            <Text style={styles.langText}>{t("spanish")}</Text>
            {lang === "es" && (
              <Ionicons name="checkmark" size={22} color={colors.primary} />
            )}
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={({ pressed }) => [
              styles.langRow,
              pressed && styles.pressed,
            ]}
            onPress={() => setLang("en")}
          >
            <Text style={styles.langText}>{t("english")}</Text>
            {lang === "en" && (
              <Ionicons name="checkmark" size={22} color={colors.primary} />
            )}
          </Pressable>
        </View>
      </View>

      {user && (
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutBtn,
              { borderColor: colors.destructive + "40" },
              pressed && styles.pressed,
            ]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>
              {t("signOut")}
            </Text>
          </Pressable>
        </View>
      )}

      {user && (
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.deleteAccountBtn,
              { borderColor: colors.destructive, backgroundColor: colors.destructive + "10" },
              pressed && styles.pressed,
            ]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={22} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>
              {isDeleting ? "..." : t("deleteAccount")}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
    </TabletContainer>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>, isTablet: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: isTablet ? 38 : 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 28,
      marginTop: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: isTablet ? 15 : 13,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.9,
      marginBottom: 8,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      padding: isTablet ? 22 : 18,
      gap: 12,
    },
    avatar: {
      width: isTablet ? 56 : 48,
      height: isTablet ? 56 : 48,
      borderRadius: isTablet ? 28 : 24,
      alignItems: "center",
      justifyContent: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: isTablet ? 21 : 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    userEmail: {
      fontSize: isTablet ? 16 : 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    langRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isTablet ? 22 : 18,
    },
    langText: {
      fontSize: isTablet ? 20 : 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    divider: {
      height: 1,
      marginHorizontal: 16,
    },
    signOutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: isTablet ? 22 : 18,
      borderRadius: 14,
      borderWidth: 1,
    },
    deleteAccountBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: isTablet ? 22 : 18,
      borderRadius: 14,
      borderWidth: 1.5,
    },
    signOutText: {
      fontSize: isTablet ? 20 : 17,
      fontFamily: "Inter_700Bold",
    },
    pressed: {
      opacity: 0.7,
    },
  });
}
