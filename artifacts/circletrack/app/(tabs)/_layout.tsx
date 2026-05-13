import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LanguageContext";

const TAB_ICON_SIZE = 30;

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const { t } = useLang();
  const insets = useSafeAreaInsets();

  const tabBarPadTop = 10;
  const tabBarPadBottom = isWeb ? 12 : Math.max(insets.bottom, 12);
  const tabBarMinHeight = (isWeb ? 72 : 58) + tabBarPadTop + tabBarPadBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: "Inter_700Bold",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
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
              <SymbolView name="person.3" tintColor={color} size={TAB_ICON_SIZE} />
            ) : (
              <Ionicons name="people-circle-outline" size={TAB_ICON_SIZE} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gear" tintColor={color} size={TAB_ICON_SIZE} />
            ) : (
              <Ionicons name="settings-outline" size={TAB_ICON_SIZE} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
