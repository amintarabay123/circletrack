import { useAuth } from "@clerk/clerk-expo";
import { getCurrencySymbol } from "@/constants/currencies";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useListRoscas } from "@workspace/api-client-react";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { useIsTablet } from "@/hooks/useIsTablet";
import SignInScreen from "@/components/SignInScreen";
import { TabletContainer } from "@/components/TabletContainer";
import type { Rosca } from "@workspace/api-client-react";

export default function CirclesScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (!isSignedIn) {
    return <SignInScreen />;
  }

  return <CirclesList />;
}

function LoadingView() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

function CirclesList() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const isTablet = useIsTablet();

  const { data: circles, isLoading, error, refetch } = useListRoscas({});

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  /** Space for enlarged tab bar + safe area (keep in sync with app/(tabs)/_layout.tsx). */
  const bottomPad = Platform.OS === "web" ? 34 + (isTablet ? 124 : 96) : insets.bottom + (isTablet ? 124 : 96);

  const styles = makeStyles(colors, isTablet);

  return (
    <TabletContainer>
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("myCircles")}</Text>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/circle/new");
          }}
          testID="add-circle-btn"
        >
          <Ionicons name="add" size={isTablet ? 32 : 28} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {error && !isLoading && (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.emptyTitle}>{t("error")}</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground, fontSize: 11 }]} selectable>
            {String((error as any)?.message ?? error)}
          </Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={[styles.retryText, { color: colors.primary }]}>{t("retry")}</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={circles}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CircleCard
              circle={item}
              onPress={() => router.push(`/circle/${item.id}`)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: isTablet ? 28 : 20, paddingBottom: bottomPad, paddingTop: isTablet ? 12 : 8 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!circles?.length}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="people-circle-outline" size={72} color={colors.mutedForeground} />
              <Text style={styles.emptyTitle}>{t("noCircles")}</Text>
              <Text style={styles.emptyDesc}>{t("noCirclesDesc")}</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
    </TabletContainer>
  );
}

function CircleCard({ circle, onPress }: { circle: Rosca; onPress: () => void }) {
  const colors = useColors();
  const { t } = useLang();
  const isTablet = useIsTablet();

  const freqMap: Record<string, string> = {
    weekly: t("weekly"),
    biweekly: t("biweekly"),
    first_fifteenth: t("firstFifteenth"),
    monthly: t("monthly"),
    semimonthly: t("semimonthly"),
  };
  const freq = freqMap[circle.frequency] ?? circle.frequency;
  const progress = circle.totalCycles > 0 ? circle.currentCycle / circle.totalCycles : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: colors.card,
          borderRadius: isTablet ? 20 : 18,
          marginBottom: isTablet ? 16 : 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      onPress={onPress}
      testID={`circle-card-${circle.id}`}
    >
      {/* Accent bar */}
      <View style={{ height: 4, backgroundColor: circle.isActive ? colors.primary : colors.muted }} />

      <View style={{ padding: isTablet ? 20 : 16 }}>
        {/* Top row: name + status badge */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <Text
            style={{ fontSize: isTablet ? 22 : 18, fontFamily: "Inter_700Bold", color: colors.foreground, flex: 1 }}
            numberOfLines={1}
          >
            {circle.name}
          </Text>
          <View style={{
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            backgroundColor: circle.isActive ? colors.primary + "18" : colors.muted,
          }}>
            <Text style={{
              fontSize: isTablet ? 13 : 11, fontFamily: "Inter_700Bold",
              color: circle.isActive ? colors.primary : colors.mutedForeground,
            }}>
              {circle.isActive ? t("active") : t("inactive")}
            </Text>
          </View>
        </View>

        {/* Meta row: frequency + cycle text */}
        <View style={{ flexDirection: "row", gap: isTablet ? 16 : 12, marginTop: isTablet ? 10 : 8, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="repeat-outline" size={isTablet ? 16 : 14} color={colors.mutedForeground} />
            <Text style={{ fontSize: isTablet ? 14 : 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground }}>
              {freq}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="layers-outline" size={isTablet ? 16 : 14} color={colors.mutedForeground} />
            <Text style={{ fontSize: isTablet ? 14 : 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground }}>
              {t("cycle")} {circle.currentCycle}/{circle.totalCycles}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ marginTop: isTablet ? 14 : 12 }}>
          <View style={{
            height: isTablet ? 6 : 5, borderRadius: 3,
            backgroundColor: colors.muted, overflow: "hidden",
          }}>
            <View style={{
              height: "100%",
              width: `${Math.min(progress * 100, 100)}%`,
              borderRadius: 3,
              backgroundColor: circle.isActive ? colors.primary : colors.mutedForeground,
            }} />
          </View>
        </View>

        {/* Bottom row: amount + chevron */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: isTablet ? 14 : 12 }}>
          <View>
            <Text style={{ fontSize: isTablet ? 28 : 24, fontFamily: "Inter_700Bold", color: colors.primary, lineHeight: isTablet ? 34 : 28 }}>
              {getCurrencySymbol(circle.currency)}{circle.contributionAmount.toLocaleString()}
            </Text>
            <Text style={{ fontSize: isTablet ? 13 : 11, fontFamily: "Inter_500Medium", color: colors.mutedForeground, marginTop: 2 }}>
              {t("contributionAmount")}
            </Text>
          </View>
          <View style={{
            width: isTablet ? 36 : 30, height: isTablet ? 36 : 30, borderRadius: isTablet ? 18 : 15,
            backgroundColor: colors.primary + "14",
            alignItems: "center", justifyContent: "center",
          }}>
            <Ionicons name="chevron-forward" size={isTablet ? 18 : 16} color={colors.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>, isTablet: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 8,
      paddingTop: 8,
    },
    headerTitle: {
      fontSize: isTablet ? 38 : 32,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    addBtn: {
      backgroundColor: colors.primary,
      width: isTablet ? 56 : 48,
      height: isTablet ? 56 : 48,
      borderRadius: isTablet ? 28 : 24,
      alignItems: "center",
      justifyContent: "center",
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingTop: 60,
    },
    emptyTitle: {
      fontSize: isTablet ? 24 : 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginTop: 12,
      textAlign: "center",
    },
    emptyDesc: {
      fontSize: isTablet ? 17 : 15,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginTop: 6,
      textAlign: "center",
    },
    retryBtn: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
    },
    retryText: {
      fontSize: isTablet ? 18 : 16,
      fontFamily: "Inter_700Bold",
    },
    pressed: { opacity: 0.8 },
  });
}
