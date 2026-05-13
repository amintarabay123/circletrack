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
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { tokenCache } from "@/lib/tokenCache";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
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
  const { getToken, isSignedIn } = useAuth();
  const qc = useQueryClient();

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
    if (isSignedIn) {
      console.log("[Auth] isSignedIn=true, invalidating queries");
      qc.invalidateQueries();
    }
  }, [isSignedIn, qc]);

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

  const [clerkConfig, setClerkConfig] = useState<ClerkConfig | null>(null);

  useEffect(() => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;

    if (domain) {
      const baseUrl = `https://${domain}`;
      setBaseUrl(baseUrl);

      fetch(`${baseUrl}/api/config`)
        .then((r) => r.json())
        .then((cfg: ClerkConfig) => {
          console.log("[ClerkConfig] publishableKey:", cfg.publishableKey?.slice(0, 20), "proxyUrl:", cfg.proxyUrl ?? "none");
          setClerkConfig(cfg);
        })
        .catch((err) => {
          console.log("[ClerkConfig] fetch failed, using env fallback:", err?.message);
          setClerkConfig({
            publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
          });
        });
    } else {
      setClerkConfig({
        publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
      });
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if ((!fontsLoaded && !fontError) || !clerkConfig) return null;

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
                    <RootLayoutNav />
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
