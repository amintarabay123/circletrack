import { useParams } from "wouter";
import { useGetMemberRatings, getGetMemberRatingsQueryKey } from "@workspace/api-client-react";
import { Loader2, Star, TrendingUp, AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";
import { useLang } from "@/lib/i18n";

function RatingIcon({ rating }: { rating: string }) {
  if (rating === "excellent") return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
  if (rating === "good") return <TrendingUp className="w-5 h-5 text-blue-600" />;
  if (rating === "fair") return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <ShieldX className="w-5 h-5 text-red-500" />;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "from-emerald-400 to-emerald-500" : score >= 70 ? "from-blue-400 to-blue-500" : score >= 50 ? "from-amber-400 to-amber-500" : "from-red-400 to-red-500";
  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${Math.max(2, score)}%` }} />
    </div>
  );
}

export function RoscaRatings() {
  const { id } = useParams<{ id: string }>();
  const roscaId = parseInt(id ?? "0", 10);
  const { t } = useLang();

  const { data: ratings, isLoading } = useGetMemberRatings(roscaId, {
    query: { enabled: !!roscaId, queryKey: getGetMemberRatingsQueryKey(roscaId) }
  });

  const sortedRatings = ratings ? [...ratings].sort((a, b) => b.reliabilityScore - a.reliabilityScore) : [];
  const excellent = sortedRatings.filter(r => r.rating === "excellent").length;
  const good = sortedRatings.filter(r => r.rating === "good").length;
  const fair = sortedRatings.filter(r => r.rating === "fair").length;
  const poor = sortedRatings.filter(r => r.rating === "poor").length;

  const ratingConfig: Record<string, { label: string; bg: string; text: string; border: string; avatarBg: string }> = {
    excellent: { label: t.excellent, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", avatarBg: "from-emerald-400 to-emerald-600" },
    good: { label: t.good, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", avatarBg: "from-blue-400 to-blue-600" },
    fair: { label: t.fair, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", avatarBg: "from-amber-400 to-amber-600" },
    poor: { label: t.poor, bg: "bg-red-50", text: "text-red-700", border: "border-red-200", avatarBg: "from-red-400 to-red-600" },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">{t.memberRatings}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.ratingsDesc}</p>
      </div>

      {/* Summary cards */}
      {!isLoading && sortedRatings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t.excellent, count: excellent, config: ratingConfig.excellent },
            { label: t.good, count: good, config: ratingConfig.good },
            { label: t.fair, count: fair, config: ratingConfig.fair },
            { label: t.poor, count: poor, config: ratingConfig.poor },
          ].map(({ label, count, config }) => (
            <div key={label} className={`rounded-2xl border p-5 text-center ${config.bg} ${config.border}`}>
              <p className={`text-3xl font-extrabold ${config.text}`}>{count}</p>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${config.text}`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
      ) : sortedRatings.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-14 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg mb-1">{t.noRatings}</p>
            <p className="text-muted-foreground text-sm">{t.noRatingsDesc}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRatings.map((r, i) => {
            const cfg = ratingConfig[r.rating] ?? ratingConfig.poor;
            return (
              <div
                key={r.memberId}
                className={`bg-white rounded-2xl border shadow-sm p-5 animate-in fade-in slide-in-from-bottom-3 ${cfg.border}`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${cfg.avatarBg} flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-sm`}>
                      {r.memberName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{r.memberName}</p>
                      <p className="text-xs text-muted-foreground">{r.shares === 2 ? t.doubleShareBadge : t.singleShareBadge} share</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xl font-extrabold text-foreground tabular-nums">{r.reliabilityScore}</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <RatingIcon rating={r.rating} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                <ScoreBar score={r.reliabilityScore} />

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-emerald-700">{r.onTimePayments}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{t.onTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-amber-600">{r.latePayments}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{t.late}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-red-600">{r.missedPayments}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{t.missed}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
