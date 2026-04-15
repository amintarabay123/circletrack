import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Printer, Share2, Loader2, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CycleRow {
  cycle: number;
  dueDate: string;
  expectedAmount: number;
  totalPaid: number;
  balance: number;
  status: "paid" | "partial" | "missed" | "upcoming";
  isLate: boolean;
  payments: { id: number; amount: number; paidAt: string; isLate: boolean; notes: string | null }[];
}

interface ReportData {
  member: { id: number; name: string; phone: string | null; email: string | null; shares: number; turnOrder: number | null };
  rosca: { id: number; name: string; startDate: string; frequency: string; contributionAmount: number; totalCycles: number; currentCycle: number };
  cycles: CycleRow[];
  summary: { totalExpected: number; totalPaid: number; totalBalance: number; paidCycles: number; partialCycles: number; missedCycles: number };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status, isLate }: { status: CycleRow["status"]; isLate: boolean }) {
  if (status === "paid")
    return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isLate ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
      {isLate ? <><Clock className="w-3 h-3" /> Tarde</> : <><CheckCircle2 className="w-3 h-3" /> A Tiempo</>}
    </span>;
  if (status === "partial")
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
      <AlertCircle className="w-3 h-3" /> Parcial
    </span>;
  if (status === "missed")
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
      <AlertCircle className="w-3 h-3" /> No Pagó
    </span>;
  return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
    <Calendar className="w-3 h-3" /> Próximo
  </span>;
}

function buildPDF(data: ReportData, lang: "es" | "en"): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const isSpa = lang === "es";

  // Header background bar
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 216, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CircleTrack", 14, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(isSpa ? "Reporte de Integrante" : "Member Report", 14, 19);
  doc.text(`${isSpa ? "Generado" : "Generated"}: ${new Date().toLocaleDateString()}`, 140, 19);

  // Member + circle info
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.member.name, 14, 38);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  if (data.member.phone) doc.text(`📞 ${data.member.phone}`, 14, 45);
  if (data.member.email) doc.text(`✉ ${data.member.email}`, 14, 51);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.text(isSpa ? `Tanda: ${data.rosca.name}` : `Circle: ${data.rosca.name}`, 120, 38);
  doc.text(isSpa ? `Turno: ${data.member.turnOrder ?? "—"}` : `Turn: ${data.member.turnOrder ?? "—"}`, 120, 45);
  doc.text(isSpa ? `Participación: ${data.member.shares === 2 ? "Doble" : "Simple"}` : `Shares: ${data.member.shares === 2 ? "Double" : "Single"}`, 120, 51);

  // Summary boxes
  const summaryY = 62;
  const boxes = [
    { label: isSpa ? "Total Esperado" : "Total Expected", value: fmt(data.summary.totalExpected), color: [15, 118, 110] as [number,number,number] },
    { label: isSpa ? "Total Pagado" : "Total Paid", value: fmt(data.summary.totalPaid), color: [5, 150, 105] as [number,number,number] },
    { label: isSpa ? "Saldo Pendiente" : "Balance Due", value: fmt(data.summary.totalBalance), color: data.summary.totalBalance > 0 ? [220, 38, 38] as [number,number,number] : [5, 150, 105] as [number,number,number] },
  ];
  boxes.forEach((box, i) => {
    const x = 14 + i * 63;
    doc.setFillColor(...box.color);
    doc.roundedRect(x, summaryY, 58, 18, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(box.label, x + 4, summaryY + 6);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(box.value, x + 4, summaryY + 14);
  });

  // Payment history table
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(isSpa ? "Historial de Pagos" : "Payment History", 14, summaryY + 27);

  const statusLabel = (s: string, late: boolean) => {
    if (s === "paid") return late ? (isSpa ? "Tarde" : "Late") : (isSpa ? "A Tiempo" : "On Time");
    if (s === "partial") return isSpa ? "Parcial" : "Partial";
    if (s === "missed") return isSpa ? "No Pagó" : "Missed";
    return isSpa ? "Próximo" : "Upcoming";
  };

  autoTable(doc, {
    startY: summaryY + 31,
    head: [[
      isSpa ? "Turno" : "Turn",
      isSpa ? "Fecha Límite" : "Due Date",
      isSpa ? "Esperado" : "Expected",
      isSpa ? "Pagado" : "Paid",
      isSpa ? "Saldo" : "Balance",
      isSpa ? "Estado" : "Status",
    ]],
    body: data.cycles.map(c => [
      `${isSpa ? "Turno" : "Turn"} ${c.cycle}`,
      c.dueDate,
      fmt(c.expectedAmount),
      c.totalPaid > 0 ? fmt(c.totalPaid) : "—",
      c.balance > 0 ? fmt(c.balance) : "—",
      statusLabel(c.status, c.isLate),
    ]),
    foot: [[
      isSpa ? "TOTAL" : "TOTAL",
      "",
      fmt(data.summary.totalExpected),
      fmt(data.summary.totalPaid),
      fmt(data.summary.totalBalance),
      "",
    ]],
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: "bold" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "center" },
    },
    didParseCell: (hookData) => {
      if (hookData.section === "body") {
        const status = data.cycles[hookData.row.index]?.status;
        const isLate = data.cycles[hookData.row.index]?.isLate;
        if (hookData.column.index === 5) {
          if (status === "missed") hookData.cell.styles.textColor = [220, 38, 38];
          else if (status === "partial") hookData.cell.styles.textColor = [194, 65, 12];
          else if (status === "paid" && isLate) hookData.cell.styles.textColor = [180, 83, 9];
          else if (status === "paid") hookData.cell.styles.textColor = [5, 150, 105];
        }
      }
    },
  });

  // Footer
  const pageCount = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("CircleTrack — circletrack.replit.app", 14, 275);
    doc.text(`${i} / ${pageCount}`, 196, 275, { align: "right" });
  }

  return doc.output("blob");
}

export function MemberReport() {
  const { id, memberId } = useParams<{ id: string; memberId: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const memberIdNum = parseInt(memberId ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { lang, t } = useLang();
  const [sharing, setSharing] = useState(false);

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ["member-report", roscaId, memberIdNum],
    queryFn: async () => {
      const res = await fetch(`/api/roscas/${roscaId}/members/${memberIdNum}/report`);
      if (!res.ok) throw new Error("Failed to load report");
      return res.json();
    },
    enabled: !!roscaId && !!memberIdNum,
  });

  async function handleShare() {
    if (!data) return;
    setSharing(true);
    try {
      const blob = buildPDF(data, lang);
      const fileName = `${data.member.name.replace(/\s+/g, "_")}_reporte.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `${data.member.name} — Reporte CircleTrack` });
      } else if (navigator.share) {
        await navigator.share({ title: `${data.member.name} — Reporte CircleTrack`, url: window.location.href });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = fileName; a.click();
        URL.revokeObjectURL(url);
        toast({ title: t.pdfDownloaded ?? "PDF downloaded" });
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") toast({ title: "Error", variant: "destructive" });
    } finally {
      setSharing(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">No se pudo cargar el reporte.</p>
    </div>
  );

  const { member, rosca, cycles, summary } = data;
  const freqLabel = ({ weekly: "Semanal", biweekly: "Quincenal", monthly: "Mensual", semimonthly: "Quincenal 15/30" } as Record<string, string>)[rosca.frequency] ?? rosca.frequency;

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(`/rosca/${roscaId}/members`)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground truncate">{member.name}</p>
          <p className="text-xs text-muted-foreground truncate">{rosca.name}</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={handlePrint}>
          <Printer className="w-3.5 h-3.5" />
          {t.print ?? "Imprimir"}
        </Button>
        <Button size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={handleShare} disabled={sharing}>
          {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
          {t.shareReport ?? "Compartir PDF"}
        </Button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 print:px-6 print:py-4">
        {/* Report header */}
        <div className="flex items-start justify-between mb-8 print:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-white font-bold text-lg print:hidden">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">{member.name}</h1>
                <p className="text-sm text-muted-foreground">{rosca.name} · {freqLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
              {member.phone && <span>📞 {member.phone}</span>}
              {member.email && <span>✉ {member.email}</span>}
              {member.turnOrder && <span>Turno #{member.turnOrder}</span>}
              <span>{member.shares === 2 ? "Participación Doble" : "Participación Simple"}</span>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground print:block hidden">
            <p className="font-bold text-foreground text-sm">CircleTrack</p>
            <p>{t.generatedOn ?? "Generado el"} {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-8 print:mb-6">
          {[
            { label: t.totalExpectedShort ?? "Total Esperado", value: fmt(summary.totalExpected), color: "bg-primary/10 text-primary border-primary/20" },
            { label: t.totalPaidShort ?? "Total Pagado", value: fmt(summary.totalPaid), color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { label: t.totalBalanceShort ?? "Saldo Pendiente", value: fmt(summary.totalBalance), color: summary.totalBalance > 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200" },
          ].map(card => (
            <div key={card.label} className={`rounded-2xl border p-4 ${card.color}`}>
              <p className="text-xs font-medium opacity-70">{card.label}</p>
              <p className="text-xl font-extrabold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground mb-6 flex-wrap">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {summary.paidCycles} {t.paidCycles ?? "pagados"}</span>
          {summary.partialCycles > 0 && <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-orange-500" /> {summary.partialCycles} {t.partialCycles ?? "parciales"}</span>}
          {summary.missedCycles > 0 && <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> {summary.missedCycles} {t.missedCycles ?? "no pagados"}</span>}
        </div>

        {/* Payment history table */}
        <h2 className="text-base font-extrabold text-foreground mb-3">{t.paymentHistory ?? "Historial de Pagos"}</h2>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden print:shadow-none print:border print:rounded-none">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{t.cycle}</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">{t.dueDate}</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{t.expectedAmount ?? "Esperado"}</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{t.paidAmount ?? "Pagado"}</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{t.balanceLabel ?? "Saldo"}</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cycles.map((c) => (
                <tr key={c.cycle} className={`transition-colors ${c.status === "missed" ? "bg-red-50/40" : c.status === "partial" ? "bg-orange-50/40" : c.status === "upcoming" ? "opacity-50" : "hover:bg-muted/10"}`}>
                  <td className="px-4 py-3 font-bold text-foreground">{t.cycle} {c.cycle}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{c.dueDate}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{fmt(c.expectedAmount)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{c.totalPaid > 0 ? fmt(c.totalPaid) : <span className="text-muted-foreground/40">—</span>}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">{c.balance > 0 ? fmt(c.balance) : <span className="text-emerald-600">—</span>}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={c.status} isLate={c.isLate} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30 border-t-2 border-border">
              <tr>
                <td colSpan={2} className="px-4 py-3 font-extrabold text-foreground text-xs uppercase">Total</td>
                <td className="px-4 py-3 text-right font-bold text-foreground">{fmt(summary.totalExpected)}</td>
                <td className="px-4 py-3 text-right font-bold text-foreground">{fmt(summary.totalPaid)}</td>
                <td className={`px-4 py-3 text-right font-extrabold ${summary.totalBalance > 0 ? "text-red-600" : "text-emerald-600"}`}>{fmt(summary.totalBalance)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 print:block hidden">
          CircleTrack · {new Date().toLocaleDateString()}
        </p>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
