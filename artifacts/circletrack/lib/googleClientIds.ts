import Constants from "expo-constants";

/** Google OAuth client IDs — must be in app config `extra` for EAS production builds. */
export function getGoogleClientIds(): {
  webClientId?: string;
  iosClientId?: string;
  iosUrlScheme?: string;
} {
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;
  const webClientId =
    extra?.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID ??
    process.env.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID;
  const iosClientId =
    extra?.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID ??
    process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID;
  const iosUrlScheme =
    extra?.EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME ??
    process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME;
  return { webClientId, iosClientId, iosUrlScheme };
}

export function isGoogleNativeSignInConfigured(): boolean {
  const { webClientId } = getGoogleClientIds();
  return Boolean(webClientId);
}
