import { useSSO, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleSSO = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      setLoading(strategy);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri({ scheme: "circletrack" }),
        });
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        Alert.alert(t("error"), msg);
      } finally {
        setLoading(null);
      }
    },
    [startSSOFlow, t]
  );

  const styles = makeStyles(colors);

  return (
    <TabletContainer>
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="people-circle" size={56} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{t("appName")}</Text>
          <Text style={styles.tagline}>{t("appTagline")}</Text>
        </View>

        <View style={styles.featuresSection}>
          {([
            { icon: "lock-closed-outline" as const, key: "featurePrivate" as const },
            { icon: "phone-portrait-outline" as const, key: "featurePhone" as const },
            { icon: "people-outline" as const, key: "featureControl" as const },
          ] as const).map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primary + "18" }]}>
                <Ionicons name={f.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{t(f.key)}</Text>
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

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          {t("signInDesc")}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
    </TabletContainer>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 28,
      justifyContent: "center",
      gap: 32,
    },
    logoSection: {
      alignItems: "center",
    },
    logoCircle: {
      width: 88,
      height: 88,
      borderRadius: 24,
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
    disclaimer: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 20,
    },
    pressed: { opacity: 0.75 },
  });
}
