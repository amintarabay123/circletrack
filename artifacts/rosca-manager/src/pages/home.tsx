import { useState } from "react";
import { useListRoscas, getListRoscasQueryKey } from "@workspace/api-client-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, ArrowRight, CircleDollarSign, Globe, TrendingUp, Users, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import type { Rosca } from "@workspace/api-zod";

function formatAmount(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function CircleCard({ rosca, onDelete }: { rosca: Rosca; onDelete: (rosca: Rosca) => void }) {
  const { t } = useLang();
  const progress = rosca.totalCycles > 0 ? Math.round((rosca.currentCycle / rosca.totalCycles) * 100) : 0;
  const freqLabel = t[rosca.frequency as "weekly" | "biweekly" | "monthly"] ?? rosca.frequency;
  const freqEmoji = { weekly: "📅", biweekly: "🗓️", monthly: "📆" }[rosca.frequency] ?? "📆";

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
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <Badge
              variant={rosca.isActive ? "default" : "secondary"}
              className={rosca.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200 border" : ""}
            >
              {rosca.isActive ? t.active : t.completed}
            </Badge>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(rosca); }}
              className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors"
              title={t.deleteCircle}
            >
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

export function Home() {
  const { t, lang, setLang } = useLang();
  const { data: roscas = [], isLoading } = useListRoscas();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Rosca | null>(null);

  const deleteCircle = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/roscas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
      toast({ title: t.deleteCircle });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
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
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2"
            >
              <Globe className="w-4 h-4" />
              {t.languageToggle}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.myCircles}</h2>
              <p className="text-white/60 mt-2 text-base">{t.manageCircles}</p>
            </div>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 shrink-0 gap-2">
              <Link href="/rosca/new">
                <Plus className="w-5 h-5" />
                {t.createCircle}
              </Link>
            </Button>
          </div>
          {roscas.length > 0 && (
            <div className="flex gap-8 mt-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-extrabold">{roscas.length}</p>
                <p className="text-white/50 text-xs mt-0.5">Circles</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">{roscas.filter(r => r.isActive).length}</p>
                <p className="text-white/50 text-xs mt-0.5">{t.active}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards grid */}
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
                <Link href="/rosca/new">
                  <Plus className="w-5 h-5" />
                  {t.createFirstCircle}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {roscas.map(r => (
                <CircleCard key={r.id} rosca={r} onDelete={setDeleteTarget} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteCircleConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>
              {" — "}{t.deleteCircleConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteCircle.mutate(deleteTarget.id)}
              disabled={deleteCircle.isPending}
            >
              {deleteCircle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
