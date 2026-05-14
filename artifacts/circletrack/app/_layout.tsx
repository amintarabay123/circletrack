import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { ClerkApiReadyGate } from "@/components/ClerkApiReadyGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { tokenCache } from "@/lib/tokenCache";

SplashScreen.preventAutoHideAsync();

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
  /** Avoid refetching every mounted screen on each effect run; only refresh when session becomes signed-in. */
  const wasSignedIn = useRef(false);

  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        const token = await getToken();
        console.log("[Auth] getToken →", token ? `${token.slice(0, 30)}…` : "NULL");
        return token;
      } catch (e) {
        console.log("[Auth] getToken threw:", e);
        return null;
      }
    });
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    const signed = Boolean(isSignedIn);
    if (signed && !wasSignedIn.current) {
      console.log("[Auth] session became signed-in, invalidating queries");
      qc.invalidateQueries();
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
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [clerkConfig, setClerkConfig] = useState<ClerkConfig>({
    publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
  });

  useEffect(() => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    if (!domain) return;

    const baseUrl = `https://${domain}`;
    setBaseUrl(baseUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch(`${baseUrl}/api/config`, { signal: controller.signal })
      .then((r) => r.json())
      .then((cfg: ClerkConfig) => {
        clearTimeout(timeout);
        if (cfg.publishableKey) {
          console.log("[ClerkConfig] remote key:", cfg.publishableKey?.slice(0, 20), "proxyUrl:", cfg.proxyUrl ?? "none");
          setClerkConfig(cfg);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.log("[ClerkConfig] fetch failed, keeping env key:", err?.message);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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
