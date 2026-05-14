import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { ClerkApiReadyGate } from "@/components/ClerkApiReadyGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { tokenCache } from "@/lib/tokenCache";

SplashScreen.preventAutoHideAsync();

// Module-level token cache — prevents N concurrent getToken() calls for N simultaneous queries,
// which was causing intermittent 401s when multiple queries fired on navigation.
let _cachedToken: string | null = null;
let _tokenExpiry = 0;
const TOKEN_TTL_MS = 50_000; // 50 s — JWT is valid 60 s; refresh 10 s before expiry

function clearTokenCache() {
  _cachedToken = null;
  _tokenExpiry = 0;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // One retry: Clerk sometimes attaches the session JWT a tick after isSignedIn.
        if (error?.status === 401 && failureCount < 1) return true;
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

interface ClerkConfig {
  publishableKey: string;
  proxyUrl?: string;
}

function AuthSetup({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const qc = useQueryClient();
  const wasSignedIn = useRef(false);

  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        const now = Date.now();
        if (_cachedToken && now < _tokenExpiry) return _cachedToken;
        const token = await getToken();
        if (token) {
          _cachedToken = token;
          _tokenExpiry = now + TOKEN_TTL_MS;
        } else {
          clearTokenCache();
        }
        return token;
      } catch {
        clearTokenCache();
        return null;
      }
    });
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    const signed = Boolean(isSignedIn);
    if (signed && !wasSignedIn.current) {
      clearTokenCache();
      qc.invalidateQueries();
    }
    if (!signed && wasSignedIn.current) {
      clearTokenCache();
    }
    wasSignedIn.current = signed;
  }, [isSignedIn, isLoaded, qc]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="circle/new"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/add-member"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/record-payment"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/edit"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/edit-member"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/payments"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="circle/[id]/member/[memberId]/report"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsReady, setFontsReady] = useState(Platform.OS === "web");

  useEffect(() => {
    if (Platform.OS === "web") return;
    Font.loadAsync({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
    })
      .catch(() => {/* non-fatal — fall back to system fonts */})
      .finally(() => setFontsReady(true));
  }, []);

  const [clerkConfig, setClerkConfig] = useState<ClerkConfig | null>(null);

  useEffect(() => {
    const envKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
    const domain = process.env.EXPO_PUBLIC_DOMAIN?.trim();

    if (!domain) {
      setClerkConfig({ publishableKey: envKey });
      return;
    }

    const baseUrl = `https://${domain}`;
    setBaseUrl(baseUrl);

    const ac = new AbortController();
    const timeoutMs = 10_000;
    const t = setTimeout(() => ac.abort(), timeoutMs);

    (async () => {
      try {
        const r = await fetch(`${baseUrl}/api/config`, { signal: ac.signal });
        if (!r.ok) throw new Error(`config HTTP ${r.status}`);
        const cfg = (await r.json()) as ClerkConfig;
        const key = cfg.publishableKey && cfg.publishableKey.length > 0 ? cfg.publishableKey : envKey;
        setClerkConfig({ publishableKey: key, ...(cfg.proxyUrl ? { proxyUrl: cfg.proxyUrl } : {}) });
      } catch {
        setClerkConfig({ publishableKey: envKey });
      } finally {
        clearTimeout(t);
      }
    })();

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, []);

  const appReady = fontsReady && clerkConfig !== null;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!fontsReady) {
    return null;
  }

  if (!clerkConfig) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f6f8fb" }}>
        <ActivityIndicator size="large" color="#18a574" />
      </View>
    );
  }

  if (!clerkConfig.publishableKey) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f6f8fb", padding: 24 }}>
        <Text style={{ fontSize: 16, textAlign: "center", color: "#141c2e" }}>
          Missing Clerk configuration. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY for this build.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      tokenCache={tokenCache}
      {...(clerkConfig.proxyUrl ? { proxyUrl: clerkConfig.proxyUrl } : {})}
    >
      <ClerkLoaded>
        <SafeAreaProvider>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <LanguageProvider>
                  <AuthSetup>
                    <ClerkApiReadyGate>
                      <RootLayoutNav />
                    </ClerkApiReadyGate>
                  </AuthSetup>
                </LanguageProvider>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
