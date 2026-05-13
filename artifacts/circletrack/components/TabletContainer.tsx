import React from "react";
import { View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useIsTablet } from "@/hooks/useIsTablet";

interface TabletContainerProps {
  children: React.ReactNode;
  style?: object;
}

export function TabletContainer({ children, style }: TabletContainerProps) {
  const isTablet = useIsTablet();
  const colors = useColors();

  if (!isTablet) {
    return <>{children}</>;
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}
