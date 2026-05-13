import { Platform, useWindowDimensions } from "react-native";

export function useIsTablet(): boolean {
  const { width } = useWindowDimensions();
  if (Platform.OS === "ios" && Platform.isPad) return true;
  // Keep a width fallback for Android tablets / larger web layouts.
  return width >= 768;
}
