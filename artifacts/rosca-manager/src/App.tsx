import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { RoscaNew } from "@/pages/rosca-new";
import { RoscaDashboard } from "@/pages/rosca-dashboard";
import { RoscaMembers } from "@/pages/rosca-members";
import { RoscaPayments } from "@/pages/rosca-payments";
import { RoscaRatings } from "@/pages/rosca-ratings";
import { LangProvider } from "@/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rosca/new" component={RoscaNew} />
      <Route path="/rosca/:id" nest>
        <Layout>
          <Switch>
            <Route path="/" component={RoscaDashboard} />
            <Route path="/members" component={RoscaMembers} />
            <Route path="/payments" component={RoscaPayments} />
            <Route path="/ratings" component={RoscaRatings} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LangProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LangProvider>
  );
}

export default App;
