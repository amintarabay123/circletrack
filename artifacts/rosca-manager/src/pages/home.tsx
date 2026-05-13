import { useRef, useState } from "react";
import { useListRoscas, getListRoscasQueryKey } from "@workspace/api-client-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Plus, ArrowRight, CircleDollarSign, Globe, TrendingUp, Users, Trash2, Loader2, Pencil, Download, Upload, LogIn, UserPlus, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { useUser, useClerk, Show } from "@clerk/react";
import type { Rosca } from "@workspace/api-client-react";

function formatAmount(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function CircleCard({ rosca, onDelete, onExport }: { rosca: Rosca; onDelete: (rosca: Rosca) => void; onExport: (rosca: Rosca) => void }) {
  const { t } = useLang();
  const progress = rosca.totalCycles > 0 ? Math.round((rosca.currentCycle / rosca.totalCycles) * 100) : 0;
  const freqLabel =
    (
      {
        weekly: t.weekly,
        biweekly: t.biweekly,
        first_fifteenth: t.firstFifteenth,
        monthly: t.monthly,
        semimonthly: t.semimonthly,
      } as Record<string, string>
    )[rosca.frequency] ?? rosca.frequency;
  const freqEmoji = (
    { weekly: "📅", biweekly: "🗓️", first_fifteenth: "📆", monthly: "📆", semimonthly: "🗓️" } as Record<string, string>
  )[rosca.frequency] ?? "📆";

  return (
    <div className="group relative bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-chart-2 to-chart-5" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/rosca/${rosca.id}`} className="flex-1 min-w-0 cursor-pointer">
            <h3 className="font-bold text-lg text-foreground truncate">{rosca.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {freqEmoji} {freqLabel} · {t.started} {new Date(rosca.startDate).toLocaleDateString()}
            </p>
          </Link>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <Badge variant={rosca.isActive ? "default" : "secondary"} className={rosca.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200 border" : ""}>
              {rosca.isActive ? t.active : t.completed}
            </Badge>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onExport(rosca); }} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-blue-500 hover:bg-blue-50 transition-colors" title={t.exportCircle}>
              <Download className="w-4 h-4" />
            </button>
            <Link href={`/rosca/${rosca.id}/edit`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors" title={t.editCircle}>
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(rosca); }} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors" title={t.deleteCircle}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Link href={`/rosca/${rosca.id}`} className="block cursor-pointer">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">{t.cycle} {rosca.currentCycle} {t.of} {rosca.totalCycles}</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-gradient-to-r from-primary to-chart-2 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{formatAmount(rosca.contributionAmount)}</span>
            <span className="text-sm text-muted-foreground">/ {freqLabel.toLowerCase()}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {t.viewLedger} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function LandingPage() {
  const { t, lang, setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-gradient text-white px-6 py-10 md:px-16 md:py-16 relative overflow-hidden flex-1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-10 right-1/3 w-32 h-32 rounded-full bg-primary/20" />
        </div>
        <div className="relative max-w-lg mx-auto flex flex-col items-center text-center pt-8">
          <div className="flex items-center justify-between w-full mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-primary w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
                <CircleDollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">{t.appName}</span>
            </div>
            <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2">
              <Globe className="w-4 h-4" />
              {t.languageToggle}
            </button>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{t.landingTitle}</h1>
            <p className="text-white/70 text-lg">{t.landingDesc}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button asChild size="lg" className="flex-1 bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg gap-2">
              <Link href="/sign-up"><UserPlus className="w-5 h-5" />{t.getStarted}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10 font-bold rounded-xl gap-2">
              <Link href="/sign-in"><LogIn className="w-5 h-5" />{t.signIn}</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
            {[
              { icon: Shield, title: t.featurePrivate, desc: t.featurePrivateDesc },
              { icon: Smartphone, title: t.featureMobile, desc: t.featureMobileDesc },
              { icon: Users, title: t.featureTeam, desc: t.featureTeamDesc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-white text-sm mb-1">{title}</p>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CirclesApp() {
  const { t, lang, setLang } = useLang();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const { data: roscas = [], isLoading } = useListRoscas();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Rosca | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteCircle = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/roscas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() }); toast({ title: t.deleteCircle }); setDeleteTarget(null); },
  });

  async function handleExport(rosca: Rosca) {
    try {
      const res = await fetch(`/api/roscas/${rosca.id}/export`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${rosca.name.replace(/[^a-z0-9]/gi, "_")}.json`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: t.exportSuccess });
    } catch {
      toast({ title: t.error, variant: "destructive" });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setImportData(data);
        setImportOpen(true);
      } catch {
        toast({ title: t.importError, variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleImport(mode: "archive" | "template") {
    if (!importData) return;
    setImporting(true);
    try {
      const res = await fetch("/api/roscas/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...importData, mode }),
      });
      if (!res.ok) throw new Error();
      const newRosca = await res.json();
      queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
      toast({ title: t.importSuccess });
      setImportOpen(false);
      setImportData(null);
      navigate(`/rosca/${newRosca.id}`);
    } catch {
      toast({ title: t.importError, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }

  const userName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? t.organizer;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-gradient text-white px-6 py-10 md:px-16 md:py-14 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-10 right-1/3 w-32 h-32 rounded-full bg-primary/20" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-primary w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
                <CircleDollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-none">{t.appName}</h1>
                <p className="text-white/60 text-xs mt-0.5">{t.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2">
                <Globe className="w-4 h-4" />
                {t.languageToggle}
              </button>
              <button onClick={() => signOut({ redirectUrl: "/" })} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{userInitial}</div>
                {t.signOut}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.myCircles}</h2>
              <p className="text-white/60 mt-2 text-base">{t.manageCircles}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl gap-2">
                <Upload className="w-4 h-4" />{t.importCircle}
              </Button>
              <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 shrink-0 gap-2">
                <Link href="/rosca/new"><Plus className="w-5 h-5" />{t.createCircle}</Link>
              </Button>
            </div>
          </div>
          {roscas.length > 0 && (
            <div className="flex gap-8 mt-8 pt-8 border-t border-white/10">
              <div><p className="text-3xl font-extrabold">{roscas.length}</p><p className="text-white/50 text-xs mt-0.5">Circles</p></div>
              <div><p className="text-3xl font-extrabold">{roscas.filter(r => r.isActive).length}</p><p className="text-white/50 text-xs mt-0.5">{t.active}</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-background px-6 py-8 md:px-16 md:py-10">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border border-border h-52 animate-pulse" />)}
            </div>
          ) : roscas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Users className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t.noCircles}</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">{t.noCirclesDesc}</p>
              <Button asChild size="lg" className="bg-primary text-white font-bold rounded-xl gap-2 shadow-lg shadow-primary/20">
                <Link href="/rosca/new"><Plus className="w-5 h-5" />{t.createFirstCircle}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {roscas.map(r => <CircleCard key={r.id} rosca={r} onDelete={setDeleteTarget} onExport={handleExport} />)}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteCircleConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>{" — "}{t.deleteCircleConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteTarget && deleteCircle.mutate(deleteTarget.id)} disabled={deleteCircle.isPending}>
              {deleteCircle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import mode dialog */}
      <Dialog open={importOpen} onOpenChange={(open) => { if (!open) { setImportOpen(false); setImportData(null); } }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.importCircle}</DialogTitle>
          </DialogHeader>
          {importData && (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">{t.importDesc} <span className="font-bold text-foreground">"{importData.rosca?.name}"</span></p>
              <div className="space-y-2">
                <button onClick={() => handleImport("archive")} disabled={importing} className="w-full text-left p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                  <p className="font-bold text-foreground text-sm">{t.importAsArchive}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.importAsArchiveDesc}</p>
                </button>
                <button onClick={() => handleImport("template")} disabled={importing} className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors">
                  <p className="font-bold text-foreground text-sm">{t.importAsTemplate}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.importAsTemplateDesc}</p>
                </button>
              </div>
            </div>
          )}
          <DialogFooter>
            {importing && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />{t.importing}</div>}
            <Button variant="ghost" onClick={() => { setImportOpen(false); setImportData(null); }} disabled={importing} className="rounded-xl">{t.cancel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Home() {
  return (
    <>
      <Show when="signed-in"><CirclesApp /></Show>
      <Show when="signed-out"><LandingPage /></Show>
    </>
  );
}
