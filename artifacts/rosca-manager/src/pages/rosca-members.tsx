import { useState } from "react";
import { useParams } from "wouter";
import {
  useListMembers, getListMembersQueryKey,
  useAddMember, useUpdateMember, useDeleteMember,
  getGetRoscaDashboardQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UserPlus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";

const memberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  shares: z.coerce.number().int().min(1).max(2),
  turnOrder: z.coerce.number().int().positive().optional().or(z.literal("")),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues: Partial<MemberFormValues>;
  onSubmit: (data: MemberFormValues) => void;
  isPending: boolean;
}

function MemberFormDialog({ open, onOpenChange, title, defaultValues, onSubmit, isPending }: MemberFormDialogProps) {
  const { t } = useLang();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: { shares: 1, ...defaultValues },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t.fullName}</FormLabel>
                <FormControl><Input placeholder={t.fullNamePlaceholder} className="rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.phone}</FormLabel>
                  <FormControl><Input placeholder="555-0100" className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="turnOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.turnOrder}</FormLabel>
                  <FormControl><Input type="number" min="1" placeholder="e.g. 3" className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t.email}</FormLabel>
                <FormControl><Input type="email" placeholder="email@example.com" className="rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shares" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t.shareType}</FormLabel>
                <Select onValueChange={(v) => field.onChange(parseInt(v, 10))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">{t.singleShare}</SelectItem>
                    <SelectItem value="2">{t.doubleShare}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  {field.value === 2 ? t.doubleDesc : t.singleDesc}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">{t.cancel}</Button>
              <Button type="submit" disabled={isPending} className="rounded-xl font-bold shadow-sm">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {t.saveMember}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function RoscaMembers() {
  const { id } = useParams<{ id: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLang();

  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<{ id: number; name: string; phone?: string | null; email?: string | null; shares: number; turnOrder?: number | null } | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);

  const { data: members, isLoading } = useListMembers(roscaId, {
    query: { enabled: !!roscaId, queryKey: getListMembersQueryKey(roscaId) },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListMembersQueryKey(roscaId) });
    queryClient.invalidateQueries({ queryKey: getGetRoscaDashboardQueryKey(roscaId) });
  };

  const addMember = useAddMember({ mutation: { onSuccess: () => { invalidate(); setAddOpen(false); toast({ title: t.memberAdded }); }, onError: () => toast({ title: t.error, description: t.errorAddMember, variant: "destructive" }) } });
  const updateMember = useUpdateMember({ mutation: { onSuccess: () => { invalidate(); setEditMember(null); toast({ title: t.memberUpdated }); }, onError: () => toast({ title: t.error, description: t.errorUpdateMember, variant: "destructive" }) } });
  const deleteMember = useDeleteMember({ mutation: { onSuccess: () => { invalidate(); setDeleteMemberId(null); toast({ title: t.memberRemoved }); }, onError: () => toast({ title: t.error, description: t.errorDeleteMember, variant: "destructive" }) } });

  function handleAdd(data: MemberFormValues) {
    addMember.mutate({ id: roscaId, data: { name: data.name, phone: data.phone || null, email: data.email || null, shares: data.shares, turnOrder: data.turnOrder ? Number(data.turnOrder) : null } });
  }
  function handleEdit(data: MemberFormValues) {
    if (!editMember) return;
    updateMember.mutate({ id: roscaId, memberId: editMember.id, data: { name: data.name, phone: data.phone || null, email: data.email || null, shares: data.shares, turnOrder: data.turnOrder ? Number(data.turnOrder) : null } });
  }

  const totalShares = members?.reduce((sum, m) => sum + m.shares, 0) ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t.members}</h1>
          <p className="text-sm text-muted-foreground mt-1">{members?.length ?? 0} {t.members.toLowerCase()} · {totalShares} {t.totalShares}</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="rounded-xl font-bold shadow-sm gap-2">
          <UserPlus className="w-4 h-4" />
          {t.addMember}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
      ) : !members || members.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-14 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg mb-1">{t.noMembers}</p>
            <p className="text-muted-foreground text-sm">{t.noMembersDesc}</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="rounded-xl font-bold gap-2">
            <UserPlus className="w-4 h-4" /> {t.addFirstMember}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.name}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">{t.contact}</th>
                <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.share}</th>
                <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">{t.turn}</th>
                <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member, i) => (
                <tr key={member.id} className="hover:bg-muted/20 transition-colors animate-in fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                    {member.phone ?? member.email ?? <span className="text-muted-foreground/40 italic">—</span>}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant={member.shares === 2 ? "default" : "secondary"} className={`text-xs font-bold ${member.shares === 2 ? "bg-chart-2/15 text-chart-2 border-chart-2/30 border" : ""}`}>
                      {member.shares === 2 ? t.doubleShareBadge : t.singleShareBadge}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-center text-muted-foreground hidden md:table-cell">
                    {member.turnOrder ?? <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setEditMember(member)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteMemberId(member.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MemberFormDialog open={addOpen} onOpenChange={setAddOpen} title={t.addMember} defaultValues={{ shares: 1 }} onSubmit={handleAdd} isPending={addMember.isPending} />
      {editMember && (
        <MemberFormDialog
          open={!!editMember}
          onOpenChange={(open) => { if (!open) setEditMember(null); }}
          title={t.editMember}
          defaultValues={{ name: editMember.name, phone: editMember.phone ?? undefined, email: editMember.email ?? undefined, shares: editMember.shares, turnOrder: editMember.turnOrder ?? undefined }}
          onSubmit={handleEdit}
          isPending={updateMember.isPending}
        />
      )}

      <AlertDialog open={!!deleteMemberId} onOpenChange={(open) => { if (!open) setDeleteMemberId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.removeMember}</AlertDialogTitle>
            <AlertDialogDescription>{t.removeMemberDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl" onClick={() => deleteMemberId && deleteMember.mutate({ id: roscaId, memberId: deleteMemberId })}>
              {deleteMember.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
