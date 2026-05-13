import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { getListRoscasQueryKey, getGetRoscaDashboardQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings2, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const editRoscaSchema = z.object({
  name: z.string().min(2),
  startDate: z.string().min(1),
  frequency: z.enum(["weekly", "biweekly", "first_fifteenth", "monthly", "semimonthly"]),
  contributionAmount: z.coerce.number().positive(),
  totalCycles: z.coerce.number().int().positive(),
});

type EditRoscaFormValues = z.infer<typeof editRoscaSchema>;

export function RoscaEdit() {
  const { id } = useParams<{ id: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<EditRoscaFormValues>({
    resolver: zodResolver(editRoscaSchema),
    defaultValues: {
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      frequency: "monthly",
      contributionAmount: 100,
      totalCycles: 10,
    },
  });

  useEffect(() => {
    if (!roscaId) return;
    fetch(`/api/roscas/${roscaId}`)
      .then(r => r.json())
      .then(data => {
        form.reset({
          name: data.name,
          startDate: data.startDate?.slice(0, 10) ?? "",
          frequency: data.frequency,
          contributionAmount: data.contributionAmount,
          totalCycles: data.totalCycles,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roscaId]);

  async function onSubmit(data: EditRoscaFormValues) {
    setSaving(true);
    try {
      const res = await fetch(`/api/roscas/${roscaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      queryClient.invalidateQueries({ queryKey: getListRoscasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(roscaId) });
      toast({ title: t.circleUpdated, description: t.circleUpdatedDesc });
      navigate(`~/rosca/${roscaId}`);
    } catch {
      toast({ title: t.error, description: t.errorUpdate, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="hero-gradient px-6 py-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-primary/20" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 mb-6">
            <Link href={`~/rosca/${roscaId}`}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.dashboard}
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <Settings2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{t.editLedger}</h1>
              <p className="text-white/60 text-sm mt-0.5">{t.editLedgerDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-10 md:px-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t.circleName}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.circleNamePlaceholder} className="text-lg py-6 rounded-xl" {...field} />
                    </FormControl>
                    <FormDescription>{t.circleNameDesc}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t.startDate}</FormLabel>
                      <FormControl><Input type="date" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="frequency" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t.frequency}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">{t.weekly}</SelectItem>
                          <SelectItem value="first_fifteenth">{t.firstFifteenth}</SelectItem>
                          <SelectItem value="monthly">{t.monthly}</SelectItem>
                          <SelectItem value="biweekly">{t.biweekly}</SelectItem>
                          <SelectItem value="semimonthly">{t.semimonthly}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/40 rounded-2xl border border-border/50">
                  <FormField control={form.control} name="contributionAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t.baseAmount}</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                        <FormControl><Input type="number" min="1" step="0.01" className="pl-7 rounded-xl" {...field} /></FormControl>
                      </div>
                      <FormDescription>{t.baseAmountDesc}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="totalCycles" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t.totalCycles}</FormLabel>
                      <FormControl><Input type="number" min="1" className="rounded-xl" {...field} /></FormControl>
                      <FormDescription>{t.totalCyclesDesc}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" asChild className="rounded-xl">
                    <Link href={`~/rosca/${roscaId}`}>{t.cancel}</Link>
                  </Button>
                  <Button type="submit" size="lg" disabled={saving} className="px-10 font-bold text-base rounded-xl shadow-lg shadow-primary/20 gap-2">
                    {saving ? <><Loader2 className="w-5 h-5 animate-spin" />{t.saving}</> : t.saveChanges}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
