import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { TabletContainer } from "@/components/TabletContainer";

interface CycleRow {
  cycle: number;
  dueDate: string;
  expectedAmount: number;
  totalPaid: number;
  balance: number;
  status: "paid" | "partial" | "missed" | "upcoming";
  isLate: boolean;
  payments: { id: number; amount: number; paidAt: string; isLate: boolean; notes: string | null }[];
}

interface ReportData {
  member: { id: number; name: string; phone: string | null; email: string | null; shares: number; turnOrder: number | null };
  rosca: { id: number; name: string; startDate: string; frequency: string; contributionAmount: number; totalCycles: number; currentCycle: number };
  cycles: CycleRow[];
  summary: { totalExpected: number; totalPaid: number; totalBalance: number; paidCycles: number; partialCycles: number; missedCycles: number };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function buildHtml(data: ReportData, lang: "es" | "en"): string {
  const isSpa = lang === "es";
  const { member, rosca, cycles, summary } = data;

  const statusLabel = (s: string, late: boolean) => {
    if (s === "paid") return late ? (isSpa ? "Tarde" : "Late") : (isSpa ? "A Tiempo" : "On Time");
    if (s === "partial") return isSpa ? "Parcial" : "Partial";
    if (s === "missed") return isSpa ? "No Pagó" : "Missed";
    return isSpa ? "Próximo" : "Upcoming";
  };

  const statusColor = (s: string, late: boolean) => {
    if (s === "paid") return late ? "#b45309" : "#059669";
    if (s === "partial") return "#c2410c";
    if (s === "missed") return "#dc2626";
    return "#6b7280";
  };

  const rows = cycles.map((c) => `
    <tr style="background:${c.status === "missed" ? "#fef2f2" : c.status === "partial" ? "#fff7ed" : "white"}">
      <td style="padding:10px 12px;font-weight:700">${isSpa ? "Turno" : "Cycle"} ${c.cycle}</td>
      <td style="padding:10px 12px;color:#6b7280;font-size:12px">${c.dueDate}</td>
      <td style="padding:10px 12px;text-align:right;color:#6b7280">${fmt(c.expectedAmount)}</td>
      <td style="padding:10px 12px;text-align:right;font-weight:600">${c.totalPaid > 0 ? fmt(c.totalPaid) : "—"}</td>
      <td style="padding:10px 12px;text-align:right;font-weight:700;color:${c.balance > 0 ? "#dc2626" : "#059669"}">${c.balance > 0 ? fmt(c.balance) : "—"}</td>
      <td style="padding:10px 12px;text-align:center;font-weight:700;font-size:12px;color:${statusColor(c.status, c.isLate)}">${statusLabel(c.status, c.isLate)}</td>
    </tr>
  `).join("");

  const freqLabel = ({ weekly: isSpa ? "Semanal" : "Weekly", biweekly: isSpa ? "Quincenal" : "Biweekly", monthly: isSpa ? "Mensual" : "Monthly", semimonthly: isSpa ? "Quincenal 15/30" : "Semi-monthly" } as Record<string, string>)[rosca.frequency] ?? rosca.frequency;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #1a1a1a; }
  .header { background: #0f766e; color: white; padding: 20px 24px; }
  .header h1 { margin: 0 0 2px; font-size: 20px; }
  .header p { margin: 0; font-size: 12px; opacity: 0.75; }
  .body { padding: 24px; }
  .member-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .member-name { font-size: 20px; font-weight: 800; margin: 0 0 4px; }
  .member-meta { font-size: 12px; color: #6b7280; }
  .summary-cards { display: flex; gap: 12px; margin-bottom: 24px; }
  .card { flex: 1; border-radius: 12px; padding: 14px; }
  .card.expected { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .card.paid { background: #ecfdf5; border: 1px solid #6ee7b7; }
  .card.balance { border: 1px solid #fecaca; }
  .card-label { font-size: 11px; color: #6b7280; margin: 0 0 4px; }
  .card-value { font-size: 18px; font-weight: 800; margin: 0; }
  .section-title { font-size: 14px; font-weight: 800; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; }
  table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
  thead { background: #0f766e; color: white; }
  thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  thead th:nth-child(3), thead th:nth-child(4), thead th:nth-child(5) { text-align: right; }
  thead th:nth-child(6) { text-align: center; }
  tfoot td { background: #f9fafb; padding: 10px 12px; font-weight: 800; border-top: 2px solid #e5e7eb; }
  tfoot td:nth-child(3), tfoot td:nth-child(4), tfoot td:nth-child(5) { text-align: right; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; }
</style>
</head>
<body>
<div class="header">
  <h1>CircleTrack</h1>
  <p>${isSpa ? "Reporte de Integrante" : "Member Report"} · ${new Date().toLocaleDateString()}</p>
</div>
<div class="body">
  <div class="member-row">
    <div>
      <p class="member-name">${member.name}</p>
      <p class="member-meta">
        ${rosca.name} · ${freqLabel}
        ${member.phone ? `<br/>📞 ${member.phone}` : ""}
        ${member.email ? `<br/>✉ ${member.email}` : ""}
        ${member.turnOrder ? `<br/>${isSpa ? "Turno #" : "Turn #"}${member.turnOrder}` : ""}
      </p>
    </div>
    <div style="text-align:right">
      <p class="member-meta">${member.shares === 2 ? (isSpa ? "Participación Doble" : "Double Share") : (isSpa ? "Participación Simple" : "Single Share")}</p>
    </div>
  </div>

  <div class="summary-cards">
    <div class="card expected">
      <p class="card-label">${isSpa ? "Total Esperado" : "Total Expected"}</p>
      <p class="card-value" style="color:#0f766e">${fmt(summary.totalExpected)}</p>
    </div>
    <div class="card paid">
      <p class="card-label">${isSpa ? "Total Pagado" : "Total Paid"}</p>
      <p class="card-value" style="color:#059669">${fmt(summary.totalPaid)}</p>
    </div>
    <div class="card balance" style="background:${summary.totalBalance > 0 ? "#fef2f2" : "#ecfdf5"}">
      <p class="card-label">${isSpa ? "Saldo Pendiente" : "Balance Due"}</p>
      <p class="card-value" style="color:${summary.totalBalance > 0 ? "#dc2626" : "#059669"}">${fmt(summary.totalBalance)}</p>
    </div>
  </div>

  <p class="section-title">${isSpa ? "Historial de Pagos" : "Payment History"}</p>
  <table>
    <thead>
      <tr>
        <th>${isSpa ? "Turno" : "Cycle"}</th>
        <th>${isSpa ? "Fecha Límite" : "Due Date"}</th>
        <th style="text-align:right">${isSpa ? "Esperado" : "Expected"}</th>
        <th style="text-align:right">${isSpa ? "Pagado" : "Paid"}</th>
        <th style="text-align:right">${isSpa ? "Saldo" : "Balance"}</th>
        <th style="text-align:center">${isSpa ? "Estado" : "Status"}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2">${isSpa ? "TOTAL" : "TOTAL"}</td>
        <td style="text-align:right">${fmt(summary.totalExpected)}</td>
        <td style="text-align:right">${fmt(summary.totalPaid)}</td>
        <td style="text-align:right;color:${summary.totalBalance > 0 ? "#dc2626" : "#059669"}">${fmt(summary.totalBalance)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <p class="footer">CircleTrack · ${new Date().toLocaleDateString()}</p>
</div>
</body>
</html>`;
}

export default function MemberReportScreen() {
  const { id, memberId } = useLocalSearchParams<{ id: string; memberId: string }>();
  const circleId = Number(id);
  const memberIdNum = Number(memberId);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lang, t } = useLang();
  const [sharing, setSharing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const styles = makeStyles(colors);

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ["member-report", circleId, memberIdNum],
    queryFn: async () => {
      const res = await fetch(`/api/roscas/${circleId}/members/${memberIdNum}/report`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!circleId && !!memberIdNum,
  });

  async function handleSharePdf() {
    if (!data) return;
    setSharing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const html = buildHtml(data, lang);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `${data.member.name} — CircleTrack`,
          UTI: "com.adobe.pdf",
        });
      }
    } catch {
      // user cancelled or error
    } finally {
      setSharing(false);
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: topPad, backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.centered, { paddingTop: topPad, backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 12 }}>{t("reportError")}</Text>
        <Pressable style={[styles.backBtn2, { borderColor: colors.border, marginTop: 16 }]} onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{t("retry")}</Text>
        </Pressable>
      </View>
    );
  }

  const { member, rosca, cycles, summary } = data;

  const statusColor = (s: CycleRow["status"], late: boolean) => {
    if (s === "paid") return late ? "#f59e0b" : colors.success;
    if (s === "partial") return "#f97316";
    if (s === "missed") return colors.destructive;
    return colors.mutedForeground;
  };

  const statusLabel = (s: CycleRow["status"], late: boolean): string => {
    if (s === "paid") return late ? t("lateBadge") : t("onTimeBadge");
    if (s === "partial") return t("partial");
    if (s === "missed") return t("missed");
    return t("upcoming");
  };

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
            <Text style={styles.headerTitle} numberOfLines={1}>{member.name}</Text>
            <Text style={styles.headerSub} numberOfLines={1}>{rosca.name}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.shareBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.8 }, sharing && { opacity: 0.6 }]}
            onPress={handleSharePdf}
            disabled={sharing}
          >
            {sharing
              ? <ActivityIndicator color={colors.primaryForeground} size="small" />
              : <Ionicons name="share-outline" size={18} color={colors.primaryForeground} />
            }
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 20 }}
        >
          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <Text style={[styles.summaryLabel, { color: colors.primary }]}>{t("totalExpected")}</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>{fmt(summary.totalExpected)}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>{t("totalPaid")}</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>{fmt(summary.totalPaid)}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: summary.totalBalance > 0 ? colors.destructive + "10" : colors.success + "10", borderColor: summary.totalBalance > 0 ? colors.destructive + "30" : colors.success + "30" }]}>
              <Text style={[styles.summaryLabel, { color: summary.totalBalance > 0 ? colors.destructive : colors.success }]}>{t("balanceDue")}</Text>
              <Text style={[styles.summaryValue, { color: summary.totalBalance > 0 ? colors.destructive : colors.success }]}>{fmt(summary.totalBalance)}</Text>
            </View>
          </View>

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.success }]}>✓ {summary.paidCycles} {t("paidCycles")}</Text>
            {summary.partialCycles > 0 && (
              <Text style={[styles.metaText, { color: "#f97316" }]}>◑ {summary.partialCycles} {t("partialCycles")}</Text>
            )}
            {summary.missedCycles > 0 && (
              <Text style={[styles.metaText, { color: colors.destructive }]}>✗ {summary.missedCycles} {t("missedCycles")}</Text>
            )}
          </View>

          {/* Member info */}
          {(member.phone || member.email || member.turnOrder) && (
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {member.turnOrder != null && (
                <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                  #{member.turnOrder} · {member.shares === 2 ? t("doubleShare") : t("singleShare")}
                </Text>
              )}
              {member.phone && <Text style={[styles.infoText, { color: colors.mutedForeground }]}>📞 {member.phone}</Text>}
              {member.email && <Text style={[styles.infoText, { color: colors.mutedForeground }]}>✉ {member.email}</Text>}
            </View>
          )}

          <Text style={styles.sectionTitle}>{t("paymentHistory")}</Text>

          {cycles.map((c) => (
            <View key={c.cycle} style={[
              styles.cycleCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              c.status === "missed" && { borderColor: colors.destructive + "40", backgroundColor: colors.destructive + "06" },
              c.status === "partial" && { borderColor: "#f9731640", backgroundColor: "#f9731606" },
              c.status === "upcoming" && { opacity: 0.6 },
            ]}>
              <View style={styles.cycleLeft}>
                <Text style={[styles.cycleNum, { color: colors.foreground }]}>{t("cycle")} {c.cycle}</Text>
                <Text style={[styles.cycleDue, { color: colors.mutedForeground }]}>{c.dueDate}</Text>
              </View>
              <View style={styles.cycleAmounts}>
                <Text style={[styles.cycleExpected, { color: colors.mutedForeground }]}>{fmt(c.expectedAmount)}</Text>
                {c.totalPaid > 0 && (
                  <Text style={[styles.cyclePaid, { color: colors.success }]}>{fmt(c.totalPaid)}</Text>
                )}
                {c.balance > 0 && (
                  <Text style={[styles.cycleBalance, { color: colors.destructive }]}>-{fmt(c.balance)}</Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(c.status, c.isLate) + "20" }]}>
                <Text style={[styles.statusBadgeText, { color: statusColor(c.status, c.isLate) }]}>
                  {statusLabel(c.status, c.isLate)}
                </Text>
              </View>
            </View>
          ))}

          {/* Total row */}
          <View style={[styles.totalRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
            <View style={styles.cycleAmounts}>
              <Text style={[styles.cycleExpected, { color: colors.mutedForeground }]}>{fmt(summary.totalExpected)}</Text>
              <Text style={[styles.cyclePaid, { color: colors.success }]}>{fmt(summary.totalPaid)}</Text>
              {summary.totalBalance > 0 && (
                <Text style={[styles.cycleBalance, { color: colors.destructive }]}>-{fmt(summary.totalBalance)}</Text>
              )}
            </View>
            <View style={{ width: 60 }} />
          </View>
        </ScrollView>
      </View>
    </TabletContainer>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: 16, paddingBottom: 10, paddingTop: 6,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center", justifyContent: "center",
    },
    backBtn2: {
      paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1,
    },
    headerCenter: { flex: 1, marginHorizontal: 12 },
    headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 1 },
    shareBtn: {
      width: 36, height: 36, borderRadius: 18,
      alignItems: "center", justifyContent: "center",
    },
    summaryRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 8 },
    summaryCard: {
      flex: 1, borderRadius: 12, padding: 12, borderWidth: 1,
    },
    summaryLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
    summaryValue: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 4 },
    metaRow: { flexDirection: "row", gap: 12, flexWrap: "wrap", marginBottom: 12 },
    metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
    infoCard: {
      borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 12, gap: 4,
    },
    infoText: { fontSize: 13, fontFamily: "Inter_400Regular" },
    sectionTitle: {
      fontSize: 12, fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground, textTransform: "uppercase",
      letterSpacing: 0.6, marginTop: 8, marginBottom: 10,
    },
    cycleCard: {
      flexDirection: "row", alignItems: "center",
      borderRadius: 12, padding: 12, marginBottom: 6,
      borderWidth: 1, gap: 8,
    },
    cycleLeft: { flex: 1 },
    cycleNum: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
    cycleDue: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
    cycleAmounts: { alignItems: "flex-end", gap: 2 },
    cycleExpected: { fontSize: 12, fontFamily: "Inter_400Regular" },
    cyclePaid: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
    cycleBalance: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, minWidth: 60, alignItems: "center" },
    statusBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
    totalRow: {
      flexDirection: "row", alignItems: "center",
      borderRadius: 12, padding: 12, marginTop: 4,
      borderWidth: 1, gap: 8,
    },
    totalLabel: { flex: 1, fontSize: 13, fontFamily: "Inter_700Bold" },
  });
}
