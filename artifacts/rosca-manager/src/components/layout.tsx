import { ReactNode } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  Users,
  LayoutDashboard,
  CreditCard,
  Star,
  ChevronLeft,
  Globe,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { id: roscaId } = useParams<{ id: string }>();
  const { t, lang, setLang } = useLang();

  const navItems = roscaId ? [
    { path: "/", label: t.dashboard, icon: LayoutDashboard },
    { path: "/members", label: t.members, icon: Users },
    { path: "/payments", label: t.payments, icon: CreditCard },
    { path: "/ratings", label: t.ratings, icon: Star },
  ] : [];

  function isActive(path: string) {
    if (path === "/") return location === "/" || location === "";
    return location.startsWith(path);
  }

  return (
    <div className="flex min-h-[100dvh] w-full">

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      <aside className="hidden md:flex md:w-64 bg-sidebar shrink-0 h-screen sticky top-0 overflow-y-auto shadow-xl flex-col">
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <Link href="/" className="text-sidebar-foreground font-bold text-lg leading-none tracking-tight">{t.appName}</Link>
              <p className="text-xs text-sidebar-foreground/50 mt-0.5">{t.tagline}</p>
            </div>
          </div>

          {roscaId && (
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full justify-start -ml-2 mb-4">
                <Link href="~/">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t.allCircles}
                </Link>
              </Button>
              <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-widest mb-2 px-1">
                {t.circleManagement}
              </p>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Bottom */}
          <div className="mt-auto pt-6 space-y-3">
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all border border-sidebar-border/30"
            >
              <Globe className="w-4 h-4 shrink-0" />
              {t.languageToggle}
            </button>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sidebar-accent/30">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
                O
              </div>
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground leading-none">{t.organizer}</p>
                <p className="text-xs text-sidebar-foreground/50 mt-0.5">{t.admin}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE + DESKTOP CONTENT COLUMN ── */}
      <div className="flex-1 flex flex-col min-h-[100dvh] min-w-0">

        {/* Mobile top bar (hidden on desktop) */}
        <header className="md:hidden sticky top-0 z-30 bg-sidebar shadow-md flex items-center justify-between px-4 py-3 shrink-0">
          {/* Left: back to all circles */}
          <Link href="~/">
            <div className="flex items-center gap-1 text-sidebar-foreground/70 active:text-sidebar-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t.allCircles}</span>
            </div>
          </Link>

          {/* Center: logo */}
          <div className="flex items-center gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground w-7 h-7 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
            <span className="text-sidebar-foreground font-bold text-base">{t.appName}</span>
          </div>

          {/* Right: language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center gap-1 text-sidebar-foreground/70 active:text-sidebar-foreground transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
          </button>
        </header>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Extra bottom padding on mobile so content isn't hidden behind bottom tab bar */}
          <div className="p-5 md:p-10 max-w-6xl w-full mx-auto pb-28 md:pb-10">
            {children}
          </div>
        </main>

        {/* ── MOBILE BOTTOM TAB BAR (hidden on desktop) ── */}
        {roscaId && (
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar border-t border-sidebar-border/30 shadow-2xl">
            {/* Safe-area padding for iOS home indicator */}
            <div className="flex items-stretch pb-safe">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.path} href={item.path} className="flex-1">
                    <div className={`flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                      active
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/50 active:text-sidebar-foreground"
                    }`}>
                      {/* Active indicator pill */}
                      <div className={`mb-0.5 h-0.5 w-8 rounded-full transition-all ${active ? "bg-sidebar-primary" : "bg-transparent"}`} />
                      <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                      <span className={`text-[10px] font-semibold tracking-wide mt-0.5 ${active ? "text-sidebar-primary" : ""}`}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
