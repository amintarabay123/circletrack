import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetRoscaDashboard,
  useGetMemberRatings,
  useDeleteRosca,
  getGetRoscaDashboardQueryKey,
  getGetMemberRatingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";
import type { TranslationKeys } from "@/constants/i18n";
import type { DashboardSummary, MemberStatus } from "@workspace/api-client-react";

type Tab = "dashboard" | "payments" | "members";

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const circleId = Number(id);
  const { data: dashboard, isLoading, error, refetch } = useGetRoscaDashboard(circleId, {
    query: {
      enabled: !isNaN(circleId),
      queryKey: getGetRoscaDashboardQueryKey(circleId),
    },
  });
  const { data: ratings, refetch: refetchRatings } = useGetMemberRatings(circleId, {
    query: {
      enabled: !isNaN(circleId),
      queryKey: getGetMemberRatingsQueryKey(circleId),
    },
  });

  const { mutate: deleteRosca } = useDeleteRosca();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const styles = makeStyles(colors);

  function showOptions() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("cancelBtn"), t("edit"), t("deleteCircle")],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        (idx) => {
          if (idx === 1) router.push(`/circle/${id}/edit`);
          if (idx === 2) confirmDelete();
        }
      );
    } else {
      Alert.alert(t("options"), undefined, [
        { text: t("edit"), onPress: () => router.push(`/circle/${id}/edit`) },
        { text: t("deleteCircle"), style: "destructive", onPress: confirmDelete },
        { text: t("cancelBtn"), style: "cancel" },
      ]);
    }
  }

  function confirmDelete() {
    Alert.alert(t("deleteCircle"), t("deleteCircleConfirm"), [
      { text: t("deleteConfirmNo"), style: "cancel" },
      {
        text: t("deleteConfirmYes"),
        style: "destructive",
        onPress: () => {
          deleteRosca(
            { id: circleId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["listRoscas"] });
                router.back();
              },
            }
          );
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: topPad }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={[styles.centered, { paddingTop: topPad }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={styles.errorText}>{t("error")}</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={[styles.retryText, { color: colors.primary }]}>{t("retry")}</Text>
        </Pressable>
      </View>
    );
  }

  const collectionPct = Math.round(dashboard.collectionRate * 100);
  const freqMap: Record<string, string> = {
    weekly: t("weekly"),
    biweekly: t("biweekly"),
    monthly: t("monthly"),
    semimonthly: t("semimonthly"),
  };
  const freq = freqMap[dashboard.rosca.frequency] ?? dashboard.rosca.frequency;

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: t("dashboard") },
    { key: "payments", label: t("payments") },
    { key: "members", label: t("members") },
  ];

  return (
    <TabletContainer>
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{dashboard.rosca.name}</Text>
          <Text style={styles.headerSub}>{freq} · {t("cycle")} {dashboard.currentCycle}/{dashboard.rosca.totalCycles}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.moreBtn, pressed && { opacity: 0.6 }]}
          onPress={showOptions}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {tabs.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[styles.tab, activeTab === key && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, { color: activeTab === key ? colors.primary : colors.mutedForeground }]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => { refetch(); refetchRatings(); }}
            tintColor={colors.primary}
          />
        }
      >
        {activeTab === "dashboard" && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                label={t("potAmount")}
                value={`$${dashboard.potAmount.toLocaleString()}`}
                color={colors.primary}
                colors={colors}
              />
              <StatCard
                label={t("collectionRate")}
                value={`${collectionPct}%`}
                color={collectionPct >= 80 ? colors.success : colors.destructive}
                colors={colors}
              />
            </View>

            <View style={styles.statsRow}>
              <StatCard
                label={t("paidCount")}
                value={String(dashboard.paidCount)}
                color={colors.success}
                colors={colors}
              />
              <StatCard
                label={t("unpaidCount")}
                value={String(dashboard.unpaidCount)}
                color={colors.mutedForeground}
                colors={colors}
              />
              <StatCard
                label={t("lateCount")}
                value={String(dashboard.lateCount)}
                color={colors.destructive}
                colors={colors}
              />
            </View>

            {dashboard.potRecipient && (
              <View style={styles.recipientCard}>
                <Ionicons name="gift-outline" size={20} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.recipientLabel}>{t("potRecipient")}</Text>
                  <Text style={styles.recipientName}>{dashboard.potRecipient}</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>{t("paymentStatus")}</Text>
            {dashboard.memberStatuses.map((ms) => (
              <MemberStatusRow
                key={ms.memberId}
                memberStatus={ms}
                circleId={circleId}
                colors={colors}
                t={t}
                onRecordPayment={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/circle/${id}/record-payment?memberId=${ms.memberId}&memberName=${encodeURIComponent(ms.memberName)}&amountDue=${ms.amountDue}`);
                }}
              />
            ))}
          </>
        )}

        {activeTab === "payments" && (
          <PaymentsPreview
            dashboard={dashboard}
            id={id!}
            colors={colors}
            t={t}
            router={router}
          />
        )}

        {activeTab === "members" && (
          <>
            <Text style={styles.sectionTitle}>{t("memberRatings")}</Text>
            {(!ratings || ratings.length === 0) && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>{t("noMembers")}</Text>
              </View>
            )}
            {ratings?.map((r) => (
              <RatingRow
                key={r.memberId}
                rating={r}
                colors={colors}
                t={t}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/circle/${id}/member/${r.memberId}/report`);
                }}
              />
            ))}
          </>
        )}
      </ScrollView>

      {activeTab === "dashboard" && (
        <View style={[styles.fab, { bottom: bottomPad + 20 }]}>
          <Pressable
            style={({ pressed }) => [styles.fabBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.85 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/circle/${id}/add-member`);
            }}
            testID="add-member-fab"
          >
            <Ionicons name="person-add-outline" size={22} color={colors.primaryForeground} />
            <Text style={[styles.fabText, { color: colors.primaryForeground }]}>{t("addMember")}</Text>
          </Pressable>
        </View>
      )}

      {activeTab === "payments" && (
        <View style={[styles.fab, { bottom: bottomPad + 20 }]}>
          <Pressable
            style={({ pressed }) => [styles.fabBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.85 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/circle/${id}/payments`);
            }}
          >
            <Ionicons name="card-outline" size={22} color={colors.primaryForeground} />
            <Text style={[styles.fabText, { color: colors.primaryForeground }]}>{t("payments")}</Text>
          </Pressable>
        </View>
      )}
    </View>
    </TabletContainer>
  );
}

function PaymentsPreview({
  dashboard, id, colors, t, router,
}: {
  dashboard: DashboardSummary;
  id: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  t: (key: TranslationKeys) => string;
  router: ReturnType<typeof import("expo-router").useRouter>;
}) {
  const pStyles = StyleSheet.create({
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
    title: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.6 },
    viewAll: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.primary },
    card: {
      flexDirection: "row", alignItems: "center",
      backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1,
      borderRadius: 12, padding: 12, marginBottom: 8, gap: 10,
    },
    avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 15, fontFamily: "Inter_700Bold", color: colors.primary },
    info: { flex: 1 },
    name: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    sub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20 },
    badgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  });

  return (
    <View>
      <View style={pStyles.header}>
        <Text style={pStyles.title}>{t("paymentStatus")}</Text>
        <Pressable onPress={() => router.push(`/circle/${id}/payments` as never)}>
          <Text style={pStyles.viewAll}>{t("viewAll")} →</Text>
        </Pressable>
      </View>
      {dashboard.memberStatuses.map((ms: MemberStatus) => (
        <View key={ms.memberId} style={pStyles.card}>
          <View style={pStyles.avatar}>
            <Text style={pStyles.avatarText}>{ms.memberName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={pStyles.info}>
            <Text style={pStyles.name}>{ms.memberName}</Text>
            <Text style={pStyles.sub}>${ms.amountPaid.toLocaleString()} / ${ms.amountDue.toLocaleString()}</Text>
          </View>
          <View style={[pStyles.badge, { backgroundColor: (ms.isPaid ? colors.success : ms.isLate ? colors.destructive : colors.mutedForeground) + "20" }]}>
            <Text style={[pStyles.badgeText, { color: ms.isPaid ? colors.success : ms.isLate ? colors.destructive : colors.mutedForeground }]}>
              {ms.isPaid ? t("paid") : ms.isLate ? t("late") : t("unpaid")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function StatCard({
  label, value, color, colors,
}: {
  label: string;
  value: string;
  color: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  value: { fontSize: 22, fontFamily: "Inter_700Bold" },
  label: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },
});

function MemberStatusRow({
  memberStatus, circleId, colors, t, onRecordPayment,
}: {
  memberStatus: {
    memberId: number;
    memberName: string;
    shares: number;
    amountDue: number;
    amountPaid: number;
    isPaid: boolean;
    isLate: boolean;
    paidAt?: string | null;
  };
  circleId: number;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  t: (key: TranslationKeys) => string;
  onRecordPayment: () => void;
}) {
  const isPaid = memberStatus.isPaid;
  const isLate = memberStatus.isLate;

  const statusColor = isPaid ? colors.success : isLate ? colors.destructive : colors.mutedForeground;
  const statusLabel = isPaid ? t("paid") : isLate ? t("late") : t("unpaid");

  return (
    <View style={[rowStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[rowStyles.initials, { backgroundColor: colors.primary + "20" }]}>
        <Text style={[rowStyles.initialsText, { color: colors.primary }]}>
          {memberStatus.memberName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={rowStyles.info}>
        <Text style={[rowStyles.name, { color: colors.foreground }]}>{memberStatus.memberName}</Text>
        <Text style={[rowStyles.sub, { color: colors.mutedForeground }]}>
          ${memberStatus.amountPaid.toLocaleString()} / ${memberStatus.amountDue.toLocaleString()}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <View style={[rowStyles.badge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[rowStyles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        {!isPaid && (
          <Pressable
            style={({ pressed }) => [
              rowStyles.recordBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.75 },
            ]}
            onPress={onRecordPayment}
            testID={`record-payment-${memberStatus.memberId}`}
          >
            <Ionicons name="add-circle-outline" size={13} color={colors.primaryForeground} />
            <Text style={[rowStyles.recordText, { color: colors.primaryForeground }]}>{t("record")}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  initials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

function RatingRow({
  rating, colors, t, onPress,
}: {
  rating: {
    memberId: number;
    memberName: string;
    shares: number;
    totalPayments: number;
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
    reliabilityScore: number;
    rating: "excellent" | "good" | "fair" | "poor";
  };
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  t: (key: TranslationKeys) => string;
  onPress: () => void;
}) {
  const ratingColors = {
    excellent: colors.success,
    good: colors.primary,
    fair: "#f59e0b",
    poor: colors.destructive,
  };
  const ratingColor = ratingColors[rating.rating] ?? colors.mutedForeground;
  const ratingLabel = t(rating.rating);
  const score = Math.round(rating.reliabilityScore * 100);

  return (
    <Pressable
      style={({ pressed }) => [ratingStyles.card, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.75 }]}
      onPress={onPress}
    >
      <View style={[ratingStyles.initials, { backgroundColor: ratingColor + "20" }]}>
        <Text style={[ratingStyles.initialsText, { color: ratingColor }]}>
          {rating.memberName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={ratingStyles.info}>
        <Text style={[ratingStyles.name, { color: colors.foreground }]}>{rating.memberName}</Text>
        <View style={ratingStyles.row}>
          <Text style={[ratingStyles.stat, { color: colors.success }]}>✓ {rating.onTimePayments}</Text>
          <Text style={[ratingStyles.stat, { color: "#f59e0b" }]}>! {rating.latePayments}</Text>
          <Text style={[ratingStyles.stat, { color: colors.destructive }]}>✗ {rating.missedPayments}</Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[ratingStyles.score, { color: ratingColor }]}>{score}%</Text>
        <View style={[ratingStyles.badge, { backgroundColor: ratingColor + "20" }]}>
          <Text style={[ratingStyles.badgeText, { color: ratingColor }]}>{ratingLabel}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const ratingStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  initials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row", gap: 10, marginTop: 4 },
  stat: { fontSize: 12, fontFamily: "Inter_500Medium" },
  score: { fontSize: 18, fontFamily: "Inter_700Bold" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 10,
      paddingTop: 6,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      marginHorizontal: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    headerSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 1,
    },
    moreBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    tabs: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginHorizontal: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginTop: 20,
      marginBottom: 10,
    },
    recipientCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "10",
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    recipientLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    recipientName: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 10,
    },
    fab: {
      position: "absolute",
      right: 16,
      left: 16,
      alignItems: "center",
    },
    fabBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 30,
    },
    fabText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    errorText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      marginTop: 12,
    },
    retryBtn: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
    },
    retryText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
