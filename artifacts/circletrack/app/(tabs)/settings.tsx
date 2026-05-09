import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
import { TabletContainer } from "@/components/TabletContainer";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, setLang, t } = useLang();
  const { signOut } = useAuth();
  const { user } = useUser();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSignOut = () => {
    Alert.alert(t("signOut"), t("signOut") + "?", [
      { text: t("cancelBtn"), style: "cancel" },
      {
        text: t("signOut"),
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const styles = makeStyles(colors);

  return (
    <TabletContainer>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>{t("settings")}</Text>

      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("account")}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name="person" size={22} color={colors.primary} />
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
              <Ionicons name="checkmark" size={20} color={colors.primary} />
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
              <Ionicons name="checkmark" size={20} color={colors.primary} />
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
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>
              {t("signOut")}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
    </TabletContainer>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 28,
      marginTop: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.8,
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
      padding: 16,
      gap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    userEmail: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    langRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    langText: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
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
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
    },
    signOutText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    pressed: {
      opacity: 0.7,
    },
  });
}
