import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { getCurrencySymbol } from "@/constants/currencies";
import React, { useMemo, useState } from "react";
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
  useDeleteMember,
  getGetRoscaDashboardQueryKey,
  getGetMemberRatingsQueryKey,
  getListRoscasQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";
import { useIsTablet } from "@/hooks/useIsTablet";
import type { TranslationKeys } from "@/constants/i18n";
import type { DashboardSummary, MemberStatus } from "@workspace/api-client-react";

type Tab = "dashboard" | "payments" | "members";

function normalizePercent(value: number): number {
  // API may return 0-1 or 0-100 depending on source version.
  if (!isFinite(value)) return 0;
  return value <= 1 ? Math.round(value * 100) : Math.round(value);
}

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const isTablet = useIsTablet();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const circleId = Number(id);
  const { data: dashboard, isLoading, error, refetch } = useGetRoscaDashboard(circleId, {
    query: {
      enabled: !isNaN(circleId),
      queryKey: getGetRoscaDashboardQueryKey(circleId),
    },
  });
  const currencySymbol = getCurrencySymbol(dashboard?.rosca.currency ?? "USD");
  const {
    data: ratings,
    refetch: refetchRatings,
    isError: ratingsIsError,
    isLoading: ratingsLoading,
    error: ratingsQueryError,
  } = useGetMemberRatings(circleId, {
    query: {
      enabled: !isNaN(circleId),
      queryKey: getGetMemberRatingsQueryKey(circleId),
    },
  });

  const { mutate: deleteRosca } = useDeleteRosca();
  const { mutate: deleteMemberMutate } = useDeleteMember();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? (isTablet ? 46 : 34) : insets.bottom;

  const styles = useMemo(() => makeStyles(colors, isTablet), [colors, isTablet]);

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
                router.back();
                queueMicrotask(() => {
                  queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
                });
              },
              onError: (err) => {
                Alert.alert(
                  t("error"),
                  String((err as { message?: string })?.message ?? err),
                );
              },
            }
          );
        },
      },
    ]);
  }

  function showMemberOptions(memberId: number, memberName: string, memberShares: number, memberTurnOrder: number | null) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const goEdit = () =>
      router.push(
        `/circle/${id}/edit-member?memberId=${memberId}&memberName=${encodeURIComponent(memberName)}&memberShares=${memberShares}&memberTurnOrder=${memberTurnOrder ?? ""}` as never
      );
    const options = [t("cancelBtn"), t("editMember"), t("deleteMember")];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0, destructiveButtonIndex: 2 },
        (idx) => {
          if (idx === 1) goEdit();
          if (idx === 2) confirmDeleteMember(memberId, memberName);
        }
      );
    } else {
      Alert.alert(memberName, undefined, [
        { text: t("editMember"), onPress: goEdit },
        { text: t("deleteMember"), style: "destructive", onPress: () => confirmDeleteMember(memberId, memberName) },
        { text: t("cancelBtn"), style: "cancel" },
      ]);
    }
  }

  function confirmDeleteMember(memberId: number, memberName: string) {
    Alert.alert(t("deleteMember"), t("deleteMemberConfirm"), [
      { text: t("deleteConfirmNo"), style: "cancel" },
      {
        text: t("deleteConfirmYes"),
        style: "destructive",
        onPress: () => {
          deleteMemberMutate(
            { id: circleId, memberId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(circleId) });
                queryClient.invalidateQueries({ queryKey: getGetMemberRatingsQueryKey(circleId) });
              },
              onError: (err) => Alert.alert(t("error"), String((err as { message?: string })?.message ?? err)),
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

  const collectionPct = normalizePercent(dashboard.collectionRate);
  const freqMap: Record<string, string> = {
    weekly: t("weekly"),
    biweekly: t("biweekly"),
    first_fifteenth: t("firstFifteenth"),
    monthly: t("monthly"),
    semimonthly: t("semimonthly"),
  };
  const freq = freqMap[dashboard.rosca.frequency] ?? dashboard.rosca.frequency;

  const tabs: { key: Tab; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
    { key: "dashboard", label: t("dashboard"), icon: "home-outline" },
    { key: "payments", label: t("payments"), icon: "card-outline" },
    { key: "members", label: t("members"), icon: "people-outline" },
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
        {tabs.map(({ key, label, icon }) => (
          <Pressable
            key={key}
            style={[styles.tab, activeTab === key && { borderBottomColor: colors.primary }]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab(key);
            }}
          >
            <Ionicons
              name={icon}
              size={isTablet ? 26 : 18}
              color={activeTab === key ? colors.primary : colors.mutedForeground}
              style={{ marginBottom: isTablet ? 6 : 4 }}
            />
            <Text style={[styles.tabText, { color: activeTab === key ? colors.primary : colors.mutedForeground }]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
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
            <View style={styles.quickLinks}>
              <Pressable
                style={({ pressed }) => [styles.quickLink, { borderColor: colors.border, backgroundColor: colors.card }, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTab("payments");
                }}
              >
                <Ionicons name="card-outline" size={22} color={colors.primary} />
                <Text style={[styles.quickLinkText, { color: colors.foreground }]}>{t("payments")}</Text>
                <Text style={[styles.quickLinkHint, { color: colors.mutedForeground }]}>{t("paymentHistory")}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.quickLink, { borderColor: colors.border, backgroundColor: colors.card }, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTab("members");
                }}
              >
                <Ionicons name="star-outline" size={22} color={colors.primary} />
                <Text style={[styles.quickLinkText, { color: colors.foreground }]}>{t("ratings")}</Text>
                <Text style={[styles.quickLinkHint, { color: colors.mutedForeground }]}>{t("memberRatings")}</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <StatCard
                label={t("potAmount")}
                value={`${currencySymbol}${dashboard.potAmount.toLocaleString()}`}
                color={colors.primary}
                colors={colors}
                isTablet={isTablet}
              />
              <StatCard
                label={t("collectionRate")}
                value={`${collectionPct}%`}
                color={collectionPct >= 80 ? colors.success : colors.destructive}
                colors={colors}
                isTablet={isTablet}
              />
            </View>

            <View style={styles.statsRow}>
              <StatCard
                label={t("paidCount")}
                value={String(dashboard.paidCount)}
                color={colors.success}
                colors={colors}
                isTablet={isTablet}
              />
              <StatCard
                label={t("unpaidCount")}
                value={String(dashboard.unpaidCount)}
                color={colors.mutedForeground}
                colors={colors}
                isTablet={isTablet}
              />
              <StatCard
                label={t("lateCount")}
                value={String(dashboard.lateCount)}
                color={colors.destructive}
                colors={colors}
                isTablet={isTablet}
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
                isTablet={isTablet}
                currencySymbol={currencySymbol}
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
            isTablet={isTablet}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === "members" && (
          <>
            <Text style={styles.sectionTitle}>{t("members")}</Text>
            {dashboard.memberStatuses.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>{t("noMembers")}</Text>
              </View>
            )}
            {dashboard.memberStatuses.map((ms) => (
              <Pressable
                key={`member-${ms.memberId}`}
                style={({ pressed }) => [
                  styles.memberCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/circle/${id}/member/${ms.memberId}/report`);
                }}
              >
                <View style={[styles.memberInitials, { backgroundColor: colors.primary + "20" }]}>
                  <Text style={[styles.memberInitialsText, { color: colors.primary }]}>
                    {ms.memberName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: colors.foreground }]}>{ms.memberName}</Text>
                  <Text style={[styles.memberSub, { color: colors.mutedForeground }]}>
                    {currencySymbol}{ms.amountPaid.toLocaleString()} / {currencySymbol}{ms.amountDue.toLocaleString()}
                  </Text>
                </View>
                <Pressable
                  hitSlop={12}
                  onPress={(e) => {
                    e.stopPropagation();
                    showMemberOptions(ms.memberId, ms.memberName, ms.shares, null);
                  }}
                  style={({ pressed }) => [{ padding: 6, borderRadius: 20 }, pressed && { opacity: 0.5 }]}
                >
                  <Ionicons name="ellipsis-horizontal" size={isTablet ? 22 : 18} color={colors.mutedForeground} />
                </Pressable>
              </Pressable>
            ))}

            <Text style={styles.sectionTitle}>{t("memberRatings")}</Text>
            {ratingsIsError && (
              <View style={styles.emptyState}>
                <Ionicons name="alert-circle-outline" size={40} color={colors.destructive} />
                <Text style={[styles.emptyText, { textAlign: "center" }]}>{t("ratingsLoadError")}</Text>
                <Text style={[styles.emptyText, { fontSize: 12, marginTop: 6 }]} selectable>
                  {String((ratingsQueryError as Error)?.message ?? ratingsQueryError)}
                </Text>
                <Pressable style={[styles.retryBtn, { marginTop: 12 }]} onPress={() => refetchRatings()}>
                  <Text style={[styles.retryText, { color: colors.primary }]}>{t("retry")}</Text>
                </Pressable>
              </View>
            )}
            {!ratingsIsError && ratingsLoading && (
              <View style={styles.emptyState}>
                <ActivityIndicator color={colors.primary} />
              </View>
            )}
            {!ratingsIsError && !ratingsLoading && (!ratings || ratings.length === 0) && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>{t("noMembers")}</Text>
              </View>
            )}
            {!ratingsIsError && ratings?.map((r) => (
              <RatingRow
                key={r.memberId}
                rating={r}
                colors={colors}
                t={t}
                isTablet={isTablet}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/circle/${id}/member/${r.memberId}/report`);
                }}
              />
            ))}
          </>
        )}
      </ScrollView>

      {activeTab === "members" && (
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
  dashboard, id, colors, t, router, isTablet, currencySymbol,
}: {
  dashboard: DashboardSummary;
  id: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  t: (key: TranslationKeys) => string;
  router: ReturnType<typeof import("expo-router").useRouter>;
  isTablet: boolean;
  currencySymbol: string;
}) {
  const pStyles = StyleSheet.create({
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },
    title: { fontSize: isTablet ? 24 : 14, fontFamily: "Inter_700Bold", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: isTablet ? 1 : 0.6 },
    viewAll: { fontSize: isTablet ? 20 : 13, fontFamily: "Inter_700Bold", color: colors.primary },
    card: {
      flexDirection: "row", alignItems: "center",
      backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1,
      borderRadius: 12, padding: isTablet ? 22 : 12, marginBottom: 8, gap: isTablet ? 14 : 10,
    },
    avatar: { width: isTablet ? 56 : 38, height: isTablet ? 56 : 38, borderRadius: isTablet ? 28 : 19, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: isTablet ? 24 : 15, fontFamily: "Inter_700Bold", color: colors.primary },
    info: { flex: 1 },
    name: { fontSize: isTablet ? 24 : 14, fontFamily: "Inter_700Bold", color: colors.foreground },
    sub: { fontSize: isTablet ? 17 : 12, fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    badge: { paddingHorizontal: isTablet ? 12 : 7, paddingVertical: isTablet ? 6 : 3, borderRadius: 20 },
    badgeText: { fontSize: isTablet ? 15 : 10, fontFamily: "Inter_700Bold" },
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
            <Text style={pStyles.sub}>{currencySymbol}{ms.amountPaid.toLocaleString()} / {currencySymbol}{ms.amountDue.toLocaleString()}</Text>
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
  label, value, color, colors, isTablet,
}: {
  label: string;
  value: string;
  color: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  isTablet: boolean;
}) {
  const statStyles = createStatStyles(isTablet);
  return (
    <View style={[statStyles.card, { backgroundColor: colors.card, borderColor: colors.border, flex: 1, padding: isTablet ? 18 : 14 }]}>
      <Text style={[statStyles.value, { color, fontSize: isTablet ? 28 : 22 }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground, fontSize: isTablet ? 14 : 12 }]}>{label}</Text>
    </View>
  );
}

function createStatStyles(isTablet: boolean) {
  return StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: isTablet ? 18 : 14,
      borderWidth: 1,
      alignItems: "center",
    },
    value: { fontSize: isTablet ? 30 : 22, fontFamily: "Inter_700Bold" },
    label: { fontSize: isTablet ? 15 : 12, fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular", marginTop: 2, textAlign: "center" },
  });
}

function MemberStatusRow({
  memberStatus, circleId, colors, t, onRecordPayment, isTablet, currencySymbol,
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
  currencySymbol: string;
  isTablet: boolean;
}) {
  const isPaid = memberStatus.isPaid;
  const isLate = memberStatus.isLate;

  const statusColor = isPaid ? colors.success : isLate ? colors.destructive : colors.mutedForeground;
  const statusLabel = isPaid ? t("paid") : isLate ? t("late") : t("unpaid");

  const rowStyles = createRowStyles(isTablet);
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
          {currencySymbol}{memberStatus.amountPaid.toLocaleString()} / {currencySymbol}{memberStatus.amountDue.toLocaleString()}
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
            <Ionicons name="add-circle-outline" size={isTablet ? 16 : 13} color={colors.primaryForeground} />
            <Text style={[rowStyles.recordText, { color: colors.primaryForeground }]}>{t("record")}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function createRowStyles(isTablet: boolean) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: isTablet ? 18 : 12,
      marginBottom: 8,
      borderWidth: 1,
      gap: isTablet ? 14 : 10,
    },
    initials: {
      width: isTablet ? 52 : 40,
      height: isTablet ? 52 : 40,
      borderRadius: isTablet ? 26 : 20,
      alignItems: "center",
      justifyContent: "center",
    },
    initialsText: { fontSize: isTablet ? 22 : 16, fontFamily: "Inter_700Bold" },
    info: { flex: 1 },
    name: { fontSize: isTablet ? 24 : 15, fontFamily: "Inter_700Bold" },
    sub: { fontSize: isTablet ? 17 : 12, fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular", marginTop: 2 },
    badge: {
      paddingHorizontal: isTablet ? 10 : 8,
      paddingVertical: isTablet ? 5 : 3,
      borderRadius: 20,
    },
    badgeText: { fontSize: isTablet ? 14 : 11, fontFamily: "Inter_700Bold" },
    recordBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: isTablet ? 10 : 8,
      paddingVertical: isTablet ? 6 : 4,
      borderRadius: 8,
    },
    recordText: { fontSize: isTablet ? 14 : 11, fontFamily: "Inter_700Bold" },
  });
}

function RatingRow({
  rating, colors, t, onPress, isTablet,
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
  isTablet: boolean;
}) {
  const ratingColors = {
    excellent: colors.success,
    good: colors.primary,
    fair: "#f59e0b",
    poor: colors.destructive,
  };
  const ratingColor = ratingColors[rating.rating] ?? colors.mutedForeground;
  const ratingLabel = t(rating.rating);
  const score = normalizePercent(rating.reliabilityScore);
  const ratingStyles = createRatingStyles(isTablet);

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
      <Ionicons name="chevron-forward" size={isTablet ? 20 : 16} color={colors.mutedForeground} />
    </Pressable>
  );
}

function createRatingStyles(isTablet: boolean) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: isTablet ? 18 : 12,
      marginBottom: 8,
      borderWidth: 1,
      gap: isTablet ? 14 : 10,
    },
    initials: {
      width: isTablet ? 52 : 40,
      height: isTablet ? 52 : 40,
      borderRadius: isTablet ? 26 : 20,
      alignItems: "center",
      justifyContent: "center",
    },
    initialsText: { fontSize: isTablet ? 22 : 16, fontFamily: "Inter_700Bold" },
    info: { flex: 1 },
    name: { fontSize: isTablet ? 24 : 15, fontFamily: "Inter_700Bold" },
    row: { flexDirection: "row", gap: isTablet ? 14 : 10, marginTop: 4 },
    stat: { fontSize: isTablet ? 16 : 12, fontFamily: "Inter_500Medium" },
    score: { fontSize: isTablet ? 28 : 18, fontFamily: "Inter_700Bold" },
    badge: {
      paddingHorizontal: isTablet ? 10 : 8,
      paddingVertical: isTablet ? 4 : 2,
      borderRadius: 20,
      marginTop: 4,
    },
    badgeText: { fontSize: isTablet ? 14 : 11, fontFamily: "Inter_700Bold" },
  });
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>, isTablet: boolean) {
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
      paddingHorizontal: isTablet ? 22 : 16,
      paddingBottom: isTablet ? 14 : 10,
      paddingTop: isTablet ? 10 : 6,
    },
    backBtn: {
      width: isTablet ? 44 : 36,
      height: isTablet ? 44 : 36,
      borderRadius: isTablet ? 22 : 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      marginHorizontal: 12,
    },
    headerTitle: {
      fontSize: isTablet ? 34 : 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    headerSub: {
      fontSize: isTablet ? 20 : 12,
      fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: isTablet ? 2 : 1,
    },
    moreBtn: {
      width: isTablet ? 44 : 36,
      height: isTablet ? 44 : 36,
      borderRadius: isTablet ? 22 : 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    tabs: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginHorizontal: isTablet ? 22 : 16,
    },
    tab: {
      flex: 1,
      paddingVertical: isTablet ? 14 : 10,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabText: {
      fontSize: isTablet ? 22 : 13,
      fontFamily: "Inter_600SemiBold",
      textAlign: "center",
    },
    quickLinks: {
      flexDirection: "row",
      gap: isTablet ? 14 : 10,
      marginTop: isTablet ? 16 : 12,
      marginBottom: 4,
    },
    quickLink: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: isTablet ? 18 : 12,
      paddingHorizontal: isTablet ? 14 : 10,
      alignItems: "center",
    },
    quickLinkText: {
      fontSize: isTablet ? 24 : 14,
      fontFamily: "Inter_700Bold",
      marginTop: isTablet ? 8 : 6,
    },
    quickLinkHint: {
      fontSize: isTablet ? 18 : 11,
      fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular",
      marginTop: 2,
      textAlign: "center",
    },
    statsRow: {
      flexDirection: "row",
      gap: isTablet ? 14 : 10,
      marginTop: isTablet ? 18 : 14,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: isTablet ? 24 : 14,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: isTablet ? 0.9 : 0.6,
      marginTop: isTablet ? 26 : 20,
      marginBottom: isTablet ? 14 : 10,
    },
    recipientCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "10",
      borderRadius: 12,
      padding: isTablet ? 18 : 14,
      marginTop: isTablet ? 16 : 12,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    recipientLabel: {
      fontSize: isTablet ? 16 : 12,
      fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular",
      color: colors.mutedForeground,
    },
    recipientName: {
      fontSize: isTablet ? 24 : 16,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: isTablet ? 19 : 15,
      fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular",
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
      paddingVertical: isTablet ? 20 : 14,
      paddingHorizontal: isTablet ? 40 : 28,
      borderRadius: isTablet ? 36 : 30,
    },
    fabText: {
      fontSize: isTablet ? 26 : 15,
      fontFamily: "Inter_700Bold",
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
      fontSize: isTablet ? 18 : 15,
      fontFamily: "Inter_700Bold",
    },
    memberCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: isTablet ? 16 : 12,
      marginBottom: 8,
      borderWidth: 1,
      gap: 10,
    },
    memberInitials: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 48 : 40,
      borderRadius: isTablet ? 24 : 20,
      alignItems: "center",
      justifyContent: "center",
    },
    memberInitialsText: {
      fontSize: isTablet ? 20 : 16,
      fontFamily: "Inter_700Bold",
    },
    memberName: {
      fontSize: isTablet ? 24 : 15,
      fontFamily: "Inter_700Bold",
    },
    memberSub: {
      fontSize: isTablet ? 17 : 12,
      fontFamily: isTablet ? "Inter_500Medium" : "Inter_400Regular",
      marginTop: 2,
    },
  });
}
