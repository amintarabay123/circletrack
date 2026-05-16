import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLang } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_W } = Dimensions.get("window");

interface Slide {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  title: string;
  desc: string;
}

interface Props {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Slide>>(null);

  const slides: Slide[] = [
    {
      icon: "people-circle",
      iconColor: colors.primary,
      title: t("onboarding1Title"),
      desc: t("onboarding1Desc"),
    },
    {
      icon: "add-circle",
      iconColor: "#f59e0b",
      title: t("onboarding2Title"),
      desc: t("onboarding2Desc"),
    },
    {
      icon: "cash",
      iconColor: colors.success,
      title: t("onboarding3Title"),
      desc: t("onboarding3Desc"),
    },
    {
      icon: "star",
      iconColor: "#8b5cf6",
      title: t("onboarding4Title"),
      desc: t("onboarding4Desc"),
    },
  ];

  const isLast = activeIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      const next = activeIndex + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 32 : insets.bottom + 24;

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background, zIndex: 9999 }]}>
      {/* Skip button */}
      {!isLast && (
        <Pressable
          style={[styles.skipBtn, { top: topPad + 12, right: 20 }]}
          onPress={onComplete}
          hitSlop={12}
        >
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t("skip")}</Text>
        </Pressable>
      )}

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_W, paddingTop: topPad + 56 }]}>
            <View style={[styles.iconWrap, { backgroundColor: item.iconColor + "18" }]}>
              <Ionicons name={item.icon} size={88} color={item.iconColor} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots + CTA */}
      <View style={[styles.bottom, { paddingBottom: bottomPad }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? colors.primary : colors.primary + "38",
                  width: i === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
            {isLast ? t("getStarted") : t("next")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skipBtn: {
    position: "absolute",
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 33,
  },
  desc: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 26,
  },
  bottom: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  btn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
});
