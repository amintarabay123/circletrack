import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import type { TranslationKeys } from "@/constants/i18n";

type Colors = ReturnType<typeof import("@/hooks/useColors").useColors>;

function polarToCartesian(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = polarToCartesian(cx, cy, r, startDeg);
  const [ex, ey] = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

function donutSlice(
  cx: number, cy: number, outerR: number, innerR: number,
  startDeg: number, endDeg: number
): string {
  const delta = endDeg - startDeg;
  if (delta <= 0) return "";
  const safe = Math.min(delta, 359.9);
  const [ox1, oy1] = polarToCartesian(cx, cy, outerR, startDeg);
  const [ox2, oy2] = polarToCartesian(cx, cy, outerR, startDeg + safe);
  const [ix1, iy1] = polarToCartesian(cx, cy, innerR, startDeg);
  const [ix2, iy2] = polarToCartesian(cx, cy, innerR, startDeg + safe);
  const large = safe > 180 ? 1 : 0;
  return `M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

export function CollectionGauge({
  collectionRate,
  potAmount,
  currencySymbol,
  paidCount,
  unpaidCount,
  lateCount,
  colors,
  isTablet,
  t,
}: {
  collectionRate: number;
  potAmount: number;
  currencySymbol: string;
  paidCount: number;
  unpaidCount: number;
  lateCount: number;
  colors: Colors;
  isTablet: boolean;
  t: (k: TranslationKeys) => string;
}) {
  const rate = Math.max(0, Math.min(1, collectionRate));
  const pct = Math.round(rate * 100);

  const GAUGE_START = 135;
  const GAUGE_RANGE = 270;
  const cx = 100, cy = 90, r = 72, sw = 12;
  const filledEnd = GAUGE_START + GAUGE_RANGE * rate;
  const trackPath = arc(cx, cy, r, GAUGE_START, GAUGE_START + GAUGE_RANGE);
  const fillPath = rate > 0.005 ? arc(cx, cy, r, GAUGE_START, filledEnd - 0.001) : null;
  const [ndx, ndy] = polarToCartesian(cx, cy, r, filledEnd);

  const gaugeColor = pct >= 80 ? colors.success : pct >= 50 ? "#f59e0b" : colors.destructive;

  return (
    <View style={[gStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[gStyles.title, { color: colors.mutedForeground }]}>{t("collectionRate").toUpperCase()}</Text>

      <View style={gStyles.gaugeRow}>
        <Svg width={200} height={150} viewBox="0 0 200 150">
          <Path d={trackPath} fill="none" stroke={colors.border} strokeWidth={sw} strokeLinecap="round" />
          {fillPath && (
            <Path d={fillPath} fill="none" stroke={gaugeColor} strokeWidth={sw} strokeLinecap="round" />
          )}
          {rate > 0.005 && (
            <Circle cx={ndx} cy={ndy} r={sw / 2 + 1} fill={gaugeColor} />
          )}
          <SvgText
            x={cx} y={cy + 6}
            textAnchor="middle" fill={colors.foreground}
            fontSize={isTablet ? 28 : 22} fontFamily="Inter_700Bold"
          >
            {pct}%
          </SvgText>
          <SvgText
            x={cx} y={cy + 22}
            textAnchor="middle" fill={colors.mutedForeground}
            fontSize={10} fontFamily="Inter_400Regular"
          >
            {t("collectionRate")}
          </SvgText>
        </Svg>

        <View style={gStyles.sideStats}>
          <Text style={[gStyles.potLabel, { color: colors.mutedForeground }]}>{t("potAmount")}</Text>
          <Text style={[gStyles.potValue, { color: colors.primary }]}>
            {currencySymbol}{potAmount.toLocaleString()}
          </Text>

          <View style={gStyles.countRow}>
            <View style={gStyles.countItem}>
              <Text style={[gStyles.countNum, { color: colors.success }]}>{paidCount}</Text>
              <Text style={[gStyles.countLbl, { color: colors.mutedForeground }]}>{t("paid")}</Text>
            </View>
            <View style={gStyles.countItem}>
              <Text style={[gStyles.countNum, { color: "#f59e0b" }]}>{lateCount}</Text>
              <Text style={[gStyles.countLbl, { color: colors.mutedForeground }]}>{t("late")}</Text>
            </View>
            <View style={gStyles.countItem}>
              <Text style={[gStyles.countNum, { color: colors.mutedForeground }]}>{unpaidCount}</Text>
              <Text style={[gStyles.countLbl, { color: colors.mutedForeground }]}>{t("unpaid")}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const gStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 14,
  },
  title: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  gaugeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideStats: {
    flex: 1,
    paddingLeft: 8,
    gap: 6,
  },
  potLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  potValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  countRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  countItem: {
    alignItems: "center",
    flex: 1,
  },
  countNum: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  countLbl: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
});

export function PaymentDonut({
  paidCount,
  unpaidCount,
  lateCount,
  colors,
  isTablet,
  t,
}: {
  paidCount: number;
  unpaidCount: number;
  lateCount: number;
  colors: Colors;
  isTablet: boolean;
  t: (k: TranslationKeys) => string;
}) {
  const total = paidCount + unpaidCount + lateCount;
  const cx = 70, cy = 70, outerR = 58, innerR = 38;

  const paidDeg = total > 0 ? (paidCount / total) * 360 : 0;
  const lateDeg = total > 0 ? (lateCount / total) * 360 : 0;
  const unpaidDeg = total > 0 ? (unpaidCount / total) * 360 : 0;

  const START = -90;
  const paidPath = donutSlice(cx, cy, outerR, innerR, START, START + paidDeg);
  const latePath = donutSlice(cx, cy, outerR, innerR, START + paidDeg, START + paidDeg + lateDeg);
  const unpaidPath = donutSlice(cx, cy, outerR, innerR, START + paidDeg + lateDeg, START + paidDeg + lateDeg + unpaidDeg);

  const segments = [
    { label: t("paid"), count: paidCount, color: colors.success },
    { label: t("late"), count: lateCount, color: "#f59e0b" },
    { label: t("unpaid"), count: unpaidCount, color: colors.mutedForeground },
  ];

  return (
    <View style={[dStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[dStyles.title, { color: colors.mutedForeground }]}>{t("paymentStatus").toUpperCase()}</Text>

      <View style={dStyles.row}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          {total === 0 ? (
            <Path d={donutSlice(cx, cy, outerR, innerR, -90, 269.9)} fill={colors.border} />
          ) : (
            <>
              {paidPath ? <Path d={paidPath} fill={colors.success} /> : null}
              {latePath ? <Path d={latePath} fill="#f59e0b" /> : null}
              {unpaidPath ? <Path d={unpaidPath} fill={colors.mutedForeground} /> : null}
            </>
          )}
          <Circle cx={cx} cy={cy} r={innerR - 2} fill={colors.card} />
          <SvgText
            x={cx} y={cy - 4}
            textAnchor="middle" fill={colors.foreground}
            fontSize={isTablet ? 22 : 18} fontFamily="Inter_700Bold"
          >
            {total}
          </SvgText>
          <SvgText
            x={cx} y={cy + 12}
            textAnchor="middle" fill={colors.mutedForeground}
            fontSize={10} fontFamily="Inter_400Regular"
          >
            {t("members")}
          </SvgText>
        </Svg>

        <View style={dStyles.legend}>
          {segments.map(({ label, count, color }) => (
            <View key={label} style={dStyles.legendRow}>
              <View style={[dStyles.dot, { backgroundColor: color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[dStyles.legendLabel, { color: colors.mutedForeground }]}>{label}</Text>
                <Text style={[dStyles.legendCount, { color }]}>{count}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const dStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 12,
  },
  title: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  legendCount: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    lineHeight: 24,
  },
});

export function MemberProgressBar({
  amountPaid,
  amountDue,
  isPaid,
  isLate,
  colors,
}: {
  amountPaid: number;
  amountDue: number;
  isPaid: boolean;
  isLate: boolean;
  colors: Colors;
}) {
  const pct = amountDue > 0 ? Math.min(1, amountPaid / amountDue) : 0;
  const barColor = isPaid ? colors.success : isLate ? "#f59e0b" : colors.mutedForeground;

  return (
    <View style={[pbStyles.track, { backgroundColor: colors.border }]}>
      {pct > 0 && (
        <View
          style={[
            pbStyles.fill,
            { width: `${pct * 100}%` as never, backgroundColor: barColor },
          ]}
        />
      )}
    </View>
  );
}

const pbStyles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 6,
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});
