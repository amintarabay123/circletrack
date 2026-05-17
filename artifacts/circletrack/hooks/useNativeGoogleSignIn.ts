import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { getGoogleClientIds } from "@/lib/googleClientIds";

export type NativeGoogleSignInResult = {
  createdSessionId: string | null;
  setActive?: ReturnType<typeof useSignIn>["setActive"];
  signIn?: ReturnType<typeof useSignIn>["signIn"];
  signUp?: ReturnType<typeof useSignUp>["signUp"];
};

/**
 * Native Google Sign-In for iOS/Android (no browser OAuth redirect).
 * Exchanges a Google ID token with Clerk using the same pattern as useSignInWithApple on iOS.
 */
export function useNativeGoogleSignIn() {
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    const { webClientId, iosClientId } = getGoogleClientIds();
    if (!webClientId) return;
    GoogleSignin.configure({
      webClientId,
      iosClientId: iosClientId || undefined,
      offlineAccess: false,
    });
  }, []);

  const startGoogleAuthenticationFlow = useCallback(async (): Promise<NativeGoogleSignInResult> => {
    const empty: NativeGoogleSignInResult = {
      createdSessionId: null,
      signIn,
      signUp,
      setActive,
    };

    if (!isSignInLoaded || !isSignUpLoaded || !signIn || !signUp) {
      return empty;
    }

    const { webClientId } = getGoogleClientIds();
    if (!webClientId) {
      throw new Error(
        "Google Sign-In is not configured. Set EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID (and iOS client ID) in EAS and app config extra.",
      );
    }

    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) {
      return empty;
    }
    if (!isSuccessResponse(response)) {
      throw new Error("Google Sign-In did not complete.");
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new Error("No Google ID token received.");
    }

    const completeSignIn = async () => {
      const userNeedsToBeCreated = signIn.firstFactorVerification?.status === "transferable";
      if (userNeedsToBeCreated) {
        await signUp.create({ transfer: true });
        return signUp.createdSessionId ?? null;
      }
      return signIn.createdSessionId ?? null;
    };

    try {
      await signIn.create({
        strategy: "google_one_tap",
        token: idToken,
      });
      const createdSessionId = await completeSignIn();
      return { createdSessionId, setActive, signIn, signUp };
    } catch (signInError: unknown) {
      if (
        isClerkAPIResponseError(signInError) &&
        signInError.errors?.some((e) => e.code === "external_account_not_found")
      ) {
        await signUp.create({
          strategy: "google_one_tap",
          token: idToken,
        });
        return {
          createdSessionId: signUp.createdSessionId ?? null,
          setActive,
          signIn,
          signUp,
        };
      }
      throw signInError;
    }
  }, [isSignInLoaded, isSignUpLoaded, signIn, signUp, setActive]);

  return { startGoogleAuthenticationFlow };
}

export function isGoogleSignInCancelledError(err: unknown): boolean {
  if (isErrorWithCode(err)) {
    return err.code === statusCodes.SIGN_IN_CANCELLED || err.code === "-5";
  }
  return false;
}
