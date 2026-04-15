import { useEffect, useRef } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { RoscaNew } from "@/pages/rosca-new";
import { RoscaDashboard } from "@/pages/rosca-dashboard";
import { RoscaMembers } from "@/pages/rosca-members";
import { RoscaPayments } from "@/pages/rosca-payments";
import { RoscaRatings } from "@/pages/rosca-ratings";
import { MemberReport } from "@/pages/rosca-member-report";
import { RoscaEdit } from "@/pages/rosca-edit";
import { SignInPage } from "@/pages/sign-in";
import { SignUpPage } from "@/pages/sign-up";
import { LangProvider } from "@/lib/i18n";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in"><Component /></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/rosca/new">
        <ProtectedRoute component={RoscaNew} />
      </Route>
      <Route path="/rosca/:id" nest>
        <Switch>
          <Route path="/report/:memberId">
            <Show when="signed-in"><MemberReport /></Show>
            <Show when="signed-out"><Redirect to="/sign-in" /></Show>
          </Route>
          <Route path="/edit">
            <Show when="signed-in"><RoscaEdit /></Show>
            <Show when="signed-out"><Redirect to="/sign-in" /></Show>
          </Route>
          <Route>
            <Show when="signed-in">
              <Layout>
                <Switch>
                  <Route path="/" component={RoscaDashboard} />
                  <Route path="/members" component={RoscaMembers} />
                  <Route path="/payments" component={RoscaPayments} />
                  <Route path="/ratings" component={RoscaRatings} />
                </Switch>
              </Layout>
            </Show>
            <Show when="signed-out"><Redirect to="/sign-in" /></Show>
          </Route>
        </Switch>
      </Route>
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl || undefined}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <LangProvider>
            <Router />
            <Toaster />
          </LangProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
