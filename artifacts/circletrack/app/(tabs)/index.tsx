import { useAuth } from "@clerk/clerk-expo";
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

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: isTablet ? 20 : 16,
      marginBottom: isTablet ? 16 : 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: { opacity: 0.8 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    name: { fontSize: isTablet ? 24 : 18, fontFamily: "Inter_700Bold", color: colors.foreground, flex: 1 },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
      backgroundColor: circle.isActive ? colors.primary + "20" : colors.muted,
    },
    badgeText: {
      fontSize: isTablet ? 14 : 12,
      fontFamily: "Inter_700Bold",
      color: circle.isActive ? colors.primary : colors.mutedForeground,
    },
    meta: { flexDirection: "row", gap: isTablet ? 16 : 12, marginTop: isTablet ? 12 : 10, alignItems: "center" },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: { fontSize: isTablet ? 18 : 14, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    divider: { flex: 1, height: 1, backgroundColor: colors.border, marginVertical: isTablet ? 14 : 10 },
    amount: { fontSize: isTablet ? 30 : 22, fontFamily: "Inter_700Bold", color: colors.primary },
    amountLabel: { fontSize: isTablet ? 15 : 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground, marginTop: 2 },
    cycleRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
    cycle: { fontSize: isTablet ? 18 : 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    cycleMuted: { fontSize: isTablet ? 18 : 14, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      testID={`circle-card-${circle.id}`}
    >
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{circle.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{circle.isActive ? t("active") : t("inactive")}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="repeat" size={isTablet ? 20 : 16} color={colors.mutedForeground} />
          <Text style={styles.metaText}>{freq}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={isTablet ? 20 : 16} color={colors.mutedForeground} />
          <Text style={styles.metaText}>{t("cycle")} {circle.currentCycle}/{circle.totalCycles}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View>
          <Text style={styles.amount}>${circle.contributionAmount.toLocaleString()}</Text>
          <Text style={styles.amountLabel}>{t("contributionAmount")}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.cycleRow}>
            <Text style={styles.cycle}>{t("cycle")} {circle.currentCycle}</Text>
            <Text style={styles.cycleMuted}>{t("of")} {circle.totalCycles}</Text>
          </View>
          <Ionicons name="chevron-forward" size={isTablet ? 24 : 20} color={colors.mutedForeground} style={{ marginTop: 4 }} />
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
