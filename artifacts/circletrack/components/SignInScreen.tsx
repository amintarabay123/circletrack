import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSSO = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      setLoading(strategy);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: Linking.createURL("/", { scheme: "circletrack" }),
        });
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch (err) {
        console.error("SSO error:", err);
      } finally {
        setLoading(null);
      }
    },
    [startSSOFlow]
  );

  const styles = makeStyles(colors);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
      ]}
    >
      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="people-circle" size={56} color={colors.primary} />
        </View>
        <Text style={styles.appName}>{t("appName")}</Text>
        <Text style={styles.tagline}>{t("appTagline")}</Text>
      </View>

      <View style={styles.featuresSection}>
        {[
          { icon: "lock-closed-outline" as const, key: "Datos privados y seguros" },
          { icon: "phone-portrait-outline" as const, key: "Gestiona desde tu teléfono" },
          { icon: "people-outline" as const, key: "Controla tu tanda completa" },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name={f.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>{f.key}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.googleBtn,
            { borderColor: colors.border },
            pressed && styles.pressed,
          ]}
          onPress={() => handleSSO("oauth_google")}
          disabled={!!loading}
          testID="sign-in-google"
        >
          {loading === "oauth_google" ? (
            <ActivityIndicator size="small" color={colors.foreground} />
          ) : (
            <Ionicons name="logo-google" size={20} color="#4285F4" />
          )}
          <Text style={[styles.btnText, { color: colors.foreground }]}>
            {t("signInWithGoogle")}
          </Text>
        </Pressable>

        {Platform.OS !== "android" && (
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.appleBtn,
              { backgroundColor: colors.foreground },
              pressed && styles.pressed,
            ]}
            onPress={() => handleSSO("oauth_apple")}
            disabled={!!loading}
            testID="sign-in-apple"
          >
            {loading === "oauth_apple" ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Ionicons name="logo-apple" size={22} color={colors.background} />
            )}
            <Text style={[styles.btnText, { color: colors.background }]}>
              {t("signInWithApple")}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 28,
      justifyContent: "space-between",
    },
    logoSection: {
      alignItems: "center",
      paddingTop: 20,
    },
    logoCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    appName: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 6,
      textAlign: "center",
    },
    featuresSection: {
      gap: 14,
      paddingVertical: 20,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    featureIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    featureText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    buttonSection: {
      gap: 12,
    },
    btn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 15,
      borderRadius: 14,
    },
    googleBtn: {
      backgroundColor: colors.card,
      borderWidth: 1,
    },
    appleBtn: {},
    btnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    pressed: { opacity: 0.75 },
  });
}
