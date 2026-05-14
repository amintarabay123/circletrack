import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCurrencySymbol } from "@/constants/currencies";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

export interface ReceiptData {
  paymentId: number;
  circleName: string;
  memberName: string;
  amount: number;
  currency: string;
  cycle: number;
  totalCycles: number;
  paidAt: string;
  notes?: string | null;
}

interface Props {
  data: ReceiptData | null;
  onClose: () => void;
}

function formatReceiptDate(iso: string, lang: string): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function pad(n: number): string {
  return String(n).padStart(4, "0");
}

function buildShareText(d: ReceiptData, lang: string): string {
  const sym = getCurrencySymbol(d.currency);
  const dateStr = formatReceiptDate(d.paidAt, lang);
  const amtStr = `${sym}${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (lang === "es") {
    return [
      "🧾 *RECIBO DE PAGO — CircleTrack*",
      "─────────────────────────",
      `🏦 Círculo:     ${d.circleName}`,
      `👤 Integrante:  ${d.memberName}`,
      `💰 Monto:       ${amtStr}`,
      `🔄 Ciclo:       ${d.cycle} de ${d.totalCycles}`,
      `📅 Fecha:       ${dateStr}`,
      `🔖 Ref.:        #${pad(d.paymentId)}`,
      ...(d.notes ? [`📝 Notas:       ${d.notes}`] : []),
      "─────────────────────────",
      "✅ ¡Pago confirmado!",
      "¡Gracias por tu pago puntual! 🎉",
      "",
      "_Generado con CircleTrack_",
    ].join("\n");
  }
  return [
    "🧾 *PAYMENT RECEIPT — CircleTrack*",
    "─────────────────────────",
    `🏦 Circle:      ${d.circleName}`,
    `👤 Member:      ${d.memberName}`,
    `💰 Amount:      ${amtStr}`,
    `🔄 Cycle:       ${d.cycle} of ${d.totalCycles}`,
    `📅 Date:        ${dateStr}`,
    `🔖 Ref.:        #${pad(d.paymentId)}`,
    ...(d.notes ? [`📝 Notes:       ${d.notes}`] : []),
    "─────────────────────────",
    "✅ Payment confirmed!",
    "Thank you for your payment! 🎉",
    "",
    "_Generated with CircleTrack_",
  ].join("\n");
}

const DASH = "- - - - - - - - - - - - - - - - - - -";

export function PaymentReceiptModal({ data, onClose }: Props) {
  const { lang } = useLang();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  if (!data) return null;

  const sym = getCurrencySymbol(data.currency);
  const amtStr = data.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const dateStr = formatReceiptDate(data.paidAt, lang);
  const shareText = buildShareText(data, lang);

  const isEs = lang === "es";

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({ message: shareText });
    } catch {}
  };

  const handleWhatsApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Share.share({ message: shareText });
    }
  };

  return (
    <Modal
      visible={!!data}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* ═══════ THERMAL RECEIPT ═══════ */}
            <View style={styles.receipt}>

              {/* Perforated top edge */}
              <View style={styles.perfRow}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <View key={i} style={styles.perfHole} />
                ))}
              </View>

              {/* Header */}
              <Text style={styles.logo}>◆  CIRCLETRACK  ◆</Text>
              <Text style={styles.subtitle}>{isEs ? "RECIBO DE PAGO" : "PAYMENT RECEIPT"}</Text>
              <Text style={styles.dash}>{DASH}</Text>

              {/* Ref + date */}
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Ref. #{pad(data.paymentId)}</Text>
                <Text style={styles.metaText}>{data.paidAt.slice(0, 10)}</Text>
              </View>

              <Text style={styles.dash}>{DASH}</Text>

              {/* Circle name */}
              <Text style={styles.fieldKey}>{isEs ? "CÍRCULO" : "CIRCLE"}</Text>
              <Text style={styles.fieldVal}>{data.circleName}</Text>

              {/* Member */}
              <Text style={[styles.fieldKey, { marginTop: 12 }]}>{isEs ? "INTEGRANTE" : "MEMBER"}</Text>
              <Text style={styles.fieldVal}>{data.memberName}</Text>

              <Text style={styles.dash}>{DASH}</Text>

              {/* BIG AMOUNT */}
              <Text style={styles.amtLabel}>{isEs ? "MONTO PAGADO" : "AMOUNT PAID"}</Text>
              <Text style={styles.amt}>{sym}{amtStr}</Text>

              <Text style={styles.dash}>{DASH}</Text>

              {/* Info rows */}
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{isEs ? "CICLO" : "CYCLE"}</Text>
                <Text style={styles.infoVal}>{data.cycle} {isEs ? "de" : "of"} {data.totalCycles}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>{isEs ? "FECHA" : "DATE"}</Text>
                <Text style={[styles.infoVal, { flex: 1, textAlign: "right" }]}>{dateStr}</Text>
              </View>

              {data.notes ? (
                <View style={[styles.infoRow, { alignItems: "flex-start" }]}>
                  <Text style={styles.infoKey}>{isEs ? "NOTAS" : "NOTES"}</Text>
                  <Text style={[styles.infoVal, { flex: 1, textAlign: "right" }]}>{data.notes}</Text>
                </View>
              ) : null}

              <Text style={styles.dash}>{DASH}</Text>

              {/* Status */}
              <Text style={styles.confirmed}>✓  {isEs ? "PAGO CONFIRMADO" : "PAYMENT CONFIRMED"}</Text>

              <Text style={styles.dash}>{DASH}</Text>

              {/* Footer */}
              <Text style={styles.thanks}>
                {isEs ? "* GRACIAS POR SU PAGO *" : "* THANK YOU FOR YOUR PAYMENT *"}
              </Text>
              <Text style={styles.footer}>CircleTrack — {isEs ? "Tu círculo de confianza" : "Your trusted circle"}</Text>

              {/* Perforated bottom edge */}
              <View style={[styles.perfRow, { marginTop: 16 }]}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <View key={i} style={styles.perfHole} />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.waBtn, pressed && { opacity: 0.85 }]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.waBtnText}>WhatsApp</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.85 }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color={colors.primaryForeground} />
              <Text style={[styles.actionBtnText, { color: colors.primaryForeground }]}>
                {isEs ? "Compartir" : "Share"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.closeRow, pressed && { opacity: 0.6 }]}
            onPress={onClose}
          >
            <Text style={[styles.closeText, { color: colors.mutedForeground }]}>
              {isEs ? "Cerrar" : "Close"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  backdrop: { flex: 1 },
  sheet: {
    backgroundColor: "#EFEFEF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  scroll: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },

  // ── Receipt paper ─────────────────────────────────────
  receipt: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  // Perforated edge
  perfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: -22,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#EFEFEF",
  },
  perfHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Header
  logo: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#111",
    letterSpacing: 3,
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#666",
    letterSpacing: 4,
    marginBottom: 12,
  },
  dash: {
    textAlign: "center",
    fontSize: 9,
    color: "#ccc",
    letterSpacing: 1,
    marginVertical: 10,
  },

  // Meta row (ref + date)
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "#888",
    letterSpacing: 0.3,
  },

  // Field label/value
  fieldKey: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: "#aaa",
    letterSpacing: 2.5,
    marginBottom: 3,
  },
  fieldVal: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#111",
  },

  // Big amount
  amtLabel: {
    textAlign: "center",
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: "#aaa",
    letterSpacing: 3,
    marginBottom: 6,
  },
  amt: {
    textAlign: "center",
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    color: "#111",
    letterSpacing: -1,
  },

  // Info rows
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  infoKey: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: "#aaa",
    letterSpacing: 2,
    width: 72,
  },
  infoVal: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#333",
  },

  // Status + footer
  confirmed: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#16a34a",
    letterSpacing: 2,
    marginVertical: 4,
  },
  thanks: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#444",
    letterSpacing: 2,
    marginBottom: 6,
  },
  footer: {
    textAlign: "center",
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    color: "#aaa",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  // ── Buttons ───────────────────────────────────────────
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
  },
  waBtn: {
    backgroundColor: "#25D366",
  },
  waBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  closeRow: {
    alignItems: "center",
    paddingVertical: 14,
  },
  closeText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
