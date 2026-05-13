import { useAuth } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useColors } from "@/hooks/useColors";

/**
 * Clerk can report isSignedIn before getToken() returns a JWT. API calls then
 * go out without Authorization and the server responds 401. Wait until we
 * have a token before rendering children (when signed in).
 */
export function ClerkApiReadyGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const colors = useColors();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setTokenReady(false);
      return;
    }

    let cancelled = false;

    (async () => {
      for (let i = 0; i < 8; i++) {
        try {
          const t = await getToken();
          if (t) {
            if (!cancelled) setTokenReady(true);
            return;
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 120));
      }
      if (!cancelled) setTokenReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return <>{children}</>;
  }

  if (isSignedIn && !tokenReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
