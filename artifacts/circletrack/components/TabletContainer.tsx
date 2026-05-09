import React from "react";
import { View, StyleSheet } from "react-native";
import { useIsTablet } from "@/hooks/useIsTablet";

const MAX_WIDTH = 680;

interface TabletContainerProps {
  children: React.ReactNode;
  style?: object;
}

export function TabletContainer({ children, style }: TabletContainerProps) {
  const isTablet = useIsTablet();

  if (!isTablet) {
    return <>{children}</>;
  }

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
  },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
  },
});
