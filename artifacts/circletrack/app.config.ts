import type { ConfigContext, ExpoConfig } from "expo/config";

import appJson from "./app.json";

const base = appJson.expo as ExpoConfig;

export default ({ config }: ConfigContext): ExpoConfig => {
  const webClientId = process.env.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID ?? "";
  const iosClientId = process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID ?? "";
  const iosUrlSchemeEnv = process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME ?? "";
  const iosClientPrefix = iosClientId.replace(/\.apps\.googleusercontent\.com$/i, "");
  const iosUrlScheme =
    iosUrlSchemeEnv ||
    (iosClientPrefix ? `com.googleusercontent.apps.${iosClientPrefix}` : "");

  const plugins: NonNullable<ExpoConfig["plugins"]> = [...(base.plugins ?? [])];
  if (iosUrlScheme) {
    plugins.push([
      "@react-native-google-signin/google-signin",
      { iosUrlScheme },
    ]);
  }

  return {
    ...config,
    ...base,
    plugins,
    extra: {
      ...(base.extra as Record<string, unknown>),
      EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID: webClientId,
      EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID: iosClientId,
      EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME: iosUrlScheme,
    },
  };
};
