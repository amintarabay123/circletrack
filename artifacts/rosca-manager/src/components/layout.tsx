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
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto shadow-xl">
        <div className="p-6 flex flex-col h-full min-h-[100dvh] md:min-h-screen">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center shadow-lg font-bold text-lg">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <div className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
