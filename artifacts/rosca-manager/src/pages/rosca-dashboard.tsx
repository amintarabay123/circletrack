import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetRoscaDashboard, getGetRoscaDashboardQueryKey } from "@workspace/api-client-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Loader2, TrendingUp, DollarSign, Calendar, Crown, CheckCircle2, Clock, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

function StatusPill({ isPaid, isLate, t }: { isPaid: boolean; isLate: boolean; t: ReturnType<typeof useLang>["t"] }) {
  if (isPaid && !isLate) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> {t.paid}
    </span>
  );
  if (isPaid && isLate) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <Clock className="w-3 h-3" /> {t.lateBadge}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <AlertCircle className="w-3 h-3" /> {t.unpaid}
    </span>
  );
}

export function RoscaDashboard() {
  const { id } = useParams<{ id: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLang();

  const [rollbackOpen, setRollbackOpen] = useState(false);

  const { data: dashboard, isLoading } = useGetRoscaDashboard(roscaId, {
    query: { enabled: !!roscaId, queryKey: getGetRoscaDashboardQueryKey(roscaId) },
  });

  const advanceCycle = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/roscas/${roscaId}/advance`, { method: "PATCH" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(roscaId) });
      toast({ title: t.cycleAdvanced });
    },
  });

  const rollbackCycle = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/roscas/${roscaId}/rollback`, { method: "PATCH" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(roscaId) });
      toast({ title: t.cycleRolledBack });
      setRollbackOpen(false);
    },
  });

  if (isLoading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!dashboard) return <div className="text-center py-16 text-muted-foreground">Circle not found.</div>;

  const { rosca, currentCycle, cycleStartDate, cycleDueDate, totalExpected, totalCollected, collectionRate, paidCount, unpaidCount, lateCount, memberStatuses, potAmount, potRecipient } = dashboard;
  const freqLabel = t[rosca.frequency as "weekly" | "biweekly" | "monthly"] ?? rosca.frequency;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{rosca.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge className={rosca.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200 border" : ""} variant={rosca.isActive ? "default" : "secondary"}>
              {rosca.isActive ? t.active : t.completed}
            </Badge>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {t.cycle} {currentCycle} {t.of} {rosca.totalCycles}
            </span>
            <span className="text-sm text-muted-foreground capitalize">{freqLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {rosca.isActive && currentCycle > 1 && (
            <Button
              variant="outline"
              onClick={() => setRollbackOpen(true)}
              disabled={rollbackCycle.isPending}
              className="shrink-0 rounded-xl font-semibold gap-2 border-muted-foreground/30 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.rollbackCycle}
            </Button>
          )}
          {rosca.isActive && currentCycle < rosca.totalCycles && (
            <Button
              onClick={() => advanceCycle.mutate()}
              disabled={advanceCycle.isPending}
              className="shrink-0 rounded-xl font-bold shadow-md gap-2"
            >
              {advanceCycle.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {t.advanceToCycle} {currentCycle + 1}
            </Button>
          )}
        </div>
      </div>

      {/* Rollback confirmation dialog */}
      <AlertDialog open={rollbackOpen} onOpenChange={setRollbackOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.rollbackCycleConfirmTitle} {currentCycle - 1}?</AlertDialogTitle>
            <AlertDialogDescription>{t.rollbackCycleConfirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => rollbackCycle.mutate()}
              disabled={rollbackCycle.isPending}
            >
              {rollbackCycle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t.rollbackCycleConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pot recipient banner */}
      {potRecipient && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 rounded-2xl px-6 py-5">
          <div className="bg-primary/15 rounded-xl p-3">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.potRecipient} {currentCycle}</p>
            <p className="text-2xl font-extrabold text-primary mt-0.5">{potRecipient} — ${potAmount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Date chips */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{t.cycleStart}</p>
          <p className="font-bold text-foreground">{format(parseISO(cycleStartDate), "MMM d, yyyy")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{t.paymentDue}</p>
          <p className="font-bold text-foreground">{format(parseISO(cycleDueDate), "MMM d, yyyy")}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-gradient-green rounded-2xl border border-emerald-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">{t.collected}</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-800">${totalCollected.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">of ${totalExpected.toLocaleString()}</p>
        </div>
        <div className="card-gradient-blue rounded-2xl border border-blue-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{t.collectionRate}</span>
          </div>
          <p className="text-2xl font-extrabold text-blue-800">{Math.round(collectionRate)}%</p>
          <p className="text-xs text-blue-600 mt-1">{t.thisCycle}</p>
        </div>
        <div className="card-gradient-green rounded-2xl border border-emerald-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">{t.paid}</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-800">{paidCount}</p>
          <p className="text-xs text-emerald-600 mt-1">{lateCount > 0 ? `${lateCount} ${t.late}` : t.allOnTime}</p>
        </div>
        <div className="card-gradient-red rounded-2xl border border-red-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">{t.unpaid}</span>
          </div>
          <p className="text-2xl font-extrabold text-red-700">{unpaidCount}</p>
          <p className="text-xs text-red-500 mt-1">{unpaidCount === 0 ? t.everyonePaid : t.outstanding}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-semibold text-foreground">{t.collectionProgress}</span>
          <span className="font-bold text-primary">{Math.round(collectionRate)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, collectionRate)}%` }}
          />
        </div>
      </div>

      {/* Member payments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{t.memberPayments} {currentCycle}</h2>
          <Button variant="ghost" size="sm" asChild className="text-primary font-semibold">
            <Link href={`/rosca/${roscaId}/payments`}>{t.viewAllPayments}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {memberStatuses.map((ms, i) => (
            <div
              key={ms.memberId}
              className={`rounded-2xl border p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 ${
                ms.isPaid && !ms.isLate ? "border-emerald-200 bg-emerald-50/60"
                : ms.isPaid && ms.isLate ? "border-amber-200 bg-amber-50/60"
                : "border-red-200 bg-red-50/40"
              }`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    ms.isPaid && !ms.isLate ? "bg-emerald-200 text-emerald-800"
                    : ms.isPaid && ms.isLate ? "bg-amber-200 text-amber-800"
                    : "bg-red-200 text-red-800"
                  }`}>
                    {ms.memberName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-foreground truncate text-sm">{ms.memberName}</span>
                </div>
                <StatusPill isPaid={ms.isPaid} isLate={ms.isLate} t={t} />
              </div>
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-muted-foreground">{ms.shares > 1 ? `${ms.shares} shares` : "1 share"}</span>
                <span className="font-bold text-foreground">${ms.amountDue.toLocaleString()}</span>
              </div>
              {ms.paidAt && (
                <p className="text-xs text-muted-foreground">{t.paidOn} {format(new Date(ms.paidAt), "MMM d, h:mm a")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
