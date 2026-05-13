import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LanguageContext";
import { useIsTablet } from "@/hooks/useIsTablet";

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const isTablet = useIsTablet();

  const tabIconSize = isTablet ? 34 : 30;
  const tabLabelSize = isTablet ? 18 : 15;
  const tabBarPadTop = isTablet ? 14 : 10;
  const tabBarPadBottom = isWeb ? (isTablet ? 16 : 12) : Math.max(insets.bottom, isTablet ? 16 : 12);
  const tabBarMinHeight = (isWeb ? (isTablet ? 84 : 72) : (isTablet ? 72 : 58)) + tabBarPadTop + tabBarPadBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: tabLabelSize,
          fontFamily: "Inter_700Bold",
          marginTop: isTablet ? 6 : 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: isTablet ? 6 : 4,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          paddingTop: tabBarPadTop,
          paddingBottom: tabBarPadBottom,
          minHeight: tabBarMinHeight,
          ...(isWeb ? { height: tabBarMinHeight } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("circles"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.3" tintColor={color} size={tabIconSize} />
            ) : (
              <Ionicons name="people-circle-outline" size={tabIconSize} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gear" tintColor={color} size={tabIconSize} />
            ) : (
              <Ionicons name="settings-outline" size={tabIconSize} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
