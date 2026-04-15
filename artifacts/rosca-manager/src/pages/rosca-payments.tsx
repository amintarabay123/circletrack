import { useState } from "react";
import { useParams } from "wouter";
import {
  useListPayments, getListPaymentsQueryKey,
  useListMembers, getListMembersQueryKey,
  useRecordPayment, useDeletePayment,
  useGetRoscaDashboard, getGetRoscaDashboardQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, addWeeks, addMonths } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2, CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

// Mirrors the server-side getCycleDueDate so the form can auto-fill paidAt
function getCycleDueDateLocal(startDate: string, frequency: string, cycle: number): string {
  const start = new Date(startDate + "T00:00:00");
  let due: Date;

  if (frequency === "weekly") {
    due = addWeeks(start, cycle);
  } else if (frequency === "biweekly") {
    due = addWeeks(start, cycle * 2);
  } else if (frequency === "semimonthly") {
    const startDay = start.getDate();
    let year = start.getFullYear();
    let month = start.getMonth();
    const lastDay = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const secondHalfDay = (y: number, m: number) => Math.min(30, lastDay(y, m));
    let half: "first" | "second";
    let dueDay: number;
    if (startDay <= 15) {
      half = "first"; dueDay = 15;
    } else {
      half = "second"; dueDay = secondHalfDay(year, month);
      if (startDay > dueDay) { half = "first"; month += 1; if (month > 11) { month = 0; year += 1; } dueDay = 15; }
    }
    let advances = cycle - 1;
    while (advances > 0) {
      if (half === "first") { half = "second"; dueDay = secondHalfDay(year, month); }
      else { half = "first"; month += 1; if (month > 11) { month = 0; year += 1; } dueDay = 15; }
      advances -= 1;
    }
    due = new Date(year, month, dueDay);
  } else {
    due = addMonths(start, cycle);
  }
  // Return as "YYYY-MM-DDThh:mm" for datetime-local input (noon to avoid DST edge cases)
  const y = due.getFullYear();
  const m = String(due.getMonth() + 1).padStart(2, "0");
  const d = String(due.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T12:00`;
}

const paymentSchema = z.object({
  memberId: z.coerce.number().int().positive(),
  cycle: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
  paidAt: z.string().min(1),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function RoscaPayments() {
  const { id } = useParams<{ id: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLang();
  const [addOpen, setAddOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);
  const [cycleFilter, setCycleFilter] = useState<number | undefined>(undefined);

  const { data: dashboard } = useGetRoscaDashboard(roscaId, { query: { enabled: !!roscaId, queryKey: getGetRoscaDashboardQueryKey(roscaId) } });
  const { data: members } = useListMembers(roscaId, { query: { enabled: !!roscaId, queryKey: getListMembersQueryKey(roscaId) } });
  const { data: payments, isLoading } = useListPayments(
    roscaId,
    { cycle: cycleFilter },
    { query: { enabled: !!roscaId, queryKey: getListPaymentsQueryKey(roscaId, { cycle: cycleFilter }) } }
  );

  const currentCycle = dashboard?.rosca.currentCycle ?? 1;
  const totalCycles = dashboard?.rosca.totalCycles ?? currentCycle;
  const contributionAmount = dashboard?.rosca.contributionAmount ?? 0;
  // Allow all cycles up to totalCycles so payments can be recorded retroactively
  const cycleOptions = Array.from({ length: totalCycles }, (_, i) => i + 1);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey(roscaId) });
    queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(roscaId) });
  };

  const recordPayment = useRecordPayment({
    mutation: {
      onSuccess: () => { invalidate(); setAddOpen(false); toast({ title: t.paymentRecorded, description: t.paymentRecordedDesc }); },
      onError: () => toast({ title: t.error, description: t.errorPayment, variant: "destructive" }),
    }
  });

  const deletePayment = useDeletePayment({
    mutation: { onSuccess: () => { invalidate(); setDeletePaymentId(null); toast({ title: t.paymentRemoved }); } }
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { memberId: 0, cycle: currentCycle, amount: contributionAmount, paidAt: new Date().toISOString().slice(0, 16), notes: "" },
  });

  const startDate = dashboard?.rosca.startDate ?? "";
  const frequency = dashboard?.rosca.frequency ?? "monthly";

  const watchMemberId = form.watch("memberId");
  const watchCycle = form.watch("cycle");
  const selectedMember = members?.find(m => m.id === Number(watchMemberId));

  // Compute the due date label for the selected cycle to show as a hint
  const cycleDueDateHint = startDate ? getCycleDueDateLocal(startDate, frequency, watchCycle).slice(0, 10) : "";

  function getDefaultPaidAt(cycle: number) {
    if (startDate) return getCycleDueDateLocal(startDate, frequency, cycle);
    return new Date().toISOString().slice(0, 16);
  }

  function onCycleChange(cycle: number) {
    form.setValue("cycle", cycle);
    form.setValue("paidAt", getDefaultPaidAt(cycle));
  }

  function onMemberChange(memberId: number) {
    form.setValue("memberId", memberId);
    const member = members?.find(m => m.id === memberId);
    if (member) form.setValue("amount", contributionAmount * member.shares);
  }

  function openAddDialog() {
    form.reset({
      memberId: 0,
      cycle: currentCycle,
      amount: contributionAmount,
      paidAt: getDefaultPaidAt(currentCycle),
      notes: "",
    });
    setAddOpen(true);
  }

  function onSubmit(data: PaymentFormValues) {
    recordPayment.mutate({ id: roscaId, data: { memberId: data.memberId, cycle: data.cycle, amount: data.amount, paidAt: new Date(data.paidAt).toISOString(), notes: data.notes || null } });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t.payments}</h1>
          <p className="text-sm text-muted-foreground mt-1">{payments?.length ?? 0} {t.payments.toLowerCase()}</p>
        </div>
        <Button onClick={openAddDialog} className="rounded-xl font-bold shadow-sm gap-2">
          <Plus className="w-4 h-4" />
          {t.recordPayment}
        </Button>
      </div>

      {/* Cycle filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground font-semibold">{t.filterByCycle}</span>
        <button
          onClick={() => setCycleFilter(undefined)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${!cycleFilter ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white text-muted-foreground border-border hover:border-primary/50"}`}
        >
          {t.all}
        </button>
        {cycleOptions.map(c => (
          <button
            key={c}
            onClick={() => setCycleFilter(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${cycleFilter === c ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white text-muted-foreground border-border hover:border-primary/50"}`}
          >
            {t.cycle} {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
      ) : !payments || payments.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-14 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg mb-1">{t.noPayments}</p>
            <p className="text-muted-foreground text-sm">{t.noPaymentsDesc}</p>
          </div>
          <Button onClick={openAddDialog} className="rounded-xl font-bold gap-2">
            <Plus className="w-4 h-4" /> {t.recordFirstPayment}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.member}</th>
                <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.cycle}</th>
                <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.amount}</th>
                <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.status}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">{t.paidOn}</th>
                <th className="text-right px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment, i) => (
                <tr key={payment.id} className="hover:bg-muted/20 transition-colors animate-in fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(payment.memberName ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-foreground">{payment.memberName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">{t.cycle} {payment.cycle}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-extrabold text-foreground">${Number(payment.amount).toLocaleString()}</span>
                      {(() => {
                        const expected = contributionAmount * ((payment as typeof payment & { memberShares?: number }).memberShares ?? 1);
                        const balance = expected - Number(payment.amount);
                        return balance > 0.01 ? (
                          <span className="text-xs text-red-500 font-semibold">-${balance.toLocaleString()} saldo</span>
                        ) : null;
                      })()}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {payment.isLate ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" /> {t.lateBadge}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> {t.onTimeBadge}
                        </span>
                      )}
                      {(() => {
                        const expected = contributionAmount * ((payment as typeof payment & { memberShares?: number }).memberShares ?? 1);
                        return Number(payment.amount) < expected - 0.01 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" /> {t.partialBadge ?? "Parcial"}
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs hidden md:table-cell">
                    {format(new Date(payment.paidAt), "MMM d, yyyy h:mm a")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => setDeletePaymentId(payment.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.recordPayment}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
              <FormField control={form.control} name="memberId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.member}</FormLabel>
                  <Select onValueChange={(v) => onMemberChange(parseInt(v, 10))} value={field.value ? String(field.value) : ""}>
                    <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder={t.member} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {members?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.name} — {m.shares === 2 ? t.doubleShareBadge : t.singleShareBadge} (${(contributionAmount * m.shares).toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="cycle" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">{t.cycle}</FormLabel>
                    <Select onValueChange={(v) => onCycleChange(parseInt(v, 10))} value={String(field.value)}>
                      <FormControl><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {cycleOptions.map(c => <SelectItem key={c} value={String(c)}>{t.cycle} {c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">{t.amount}</FormLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <FormControl><Input type="number" min="1" step="0.01" className="pl-7 rounded-xl" {...field} /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="paidAt" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.dateTimePaid}</FormLabel>
                  <FormControl><Input type="datetime-local" className="rounded-xl" {...field} /></FormControl>
                  {cycleDueDateHint && (
                    <p className="text-xs text-muted-foreground">
                      {t.cycle} {watchCycle} — {t.dueDate}: <span className="font-semibold text-foreground">{cycleDueDateHint}</span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.notes}</FormLabel>
                  <FormControl><Textarea placeholder={t.notesPlaceholder} rows={2} className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)} className="rounded-xl">{t.cancel}</Button>
                <Button type="submit" disabled={recordPayment.isPending} className="rounded-xl font-bold shadow-sm">
                  {recordPayment.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {t.record}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePaymentId} onOpenChange={(open) => { if (!open) setDeletePaymentId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deletePayment}</AlertDialogTitle>
            <AlertDialogDescription>{t.deletePaymentDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl" onClick={() => deletePaymentId && deletePayment.mutate({ id: roscaId, paymentId: deletePaymentId })}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
