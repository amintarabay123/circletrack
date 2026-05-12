export default function ScreenshotRecordPaymentEn() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1320;
  const vh = typeof window !== "undefined" ? window.innerHeight : 2868;
  const scale = vw / 428;
  const innerH = Math.ceil(vh / scale);

  const primary = "#18a574";
  const bg = "#f0f4f0";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const success = "#18a574";
  const amber = "#f0a500";

  const history = [
    { month: "December 2024", amount: 500, date: "Dec 1", on_time: true },
    { month: "November 2024", amount: 500, date: "Oct 30", on_time: true },
    { month: "October 2024", amount: 500, date: "Oct 2", on_time: true },
    { month: "September 2024", amount: 500, date: "Sep 5", on_time: false },
    { month: "August 2024", amount: 500, date: "Aug 1", on_time: true },
  ];

  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{
        width: 428, height: innerH,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ background: "linear-gradient(160deg, #0d7a55 0%, #18a574 55%, #22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", zIndex: 2 }}>9:41</span>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 120, height: 34, background: "#000", borderRadius: 20, zIndex: 2 }} />
            <div style={{ display: "flex", gap: 5, alignItems: "center", zIndex: 2 }}>
              <svg width="15" height="11" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="white"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="white"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
              <svg width="14" height="11" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.2L15.5 4C13.6 2 11 1 8 1C5 1 2.4 2 0.5 4L1.7 5.2C3.3 3.5 5.5 2.5 8 2.5Z" fill="white"/><path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.5 6.1C12.1 4.8 10.2 4 8 4C5.8 4 3.9 4.8 2.5 6.1L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill="white"/><path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.5L8 12L5.5 9.5C6.1 8.9 7 8.5 8 8.5Z" fill="white"/></svg>
              <svg width="22" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.5"/></svg>
            </div>
          </div>
          <div style={{ padding: "10px 18px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0 }}>JL</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>José López</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 1 }}>Christmas Tanda · Turn 2/12</div>
              <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 18, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#fff" }}>$500/turn</span>
                <span style={{ background: "rgba(240,165,0,0.45)", borderRadius: 18, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#fff" }}>Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: "12px 12px 0", background: card, borderRadius: 18, padding: "16px", border: `1px solid ${border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: text, marginBottom: 14 }}>Record Payment</div>
          <div style={{ marginBottom: 11 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 5, textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Amount</div>
            <div style={{ background: primary + "08", borderRadius: 12, padding: "13px 14px", border: `2px solid ${primary}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: text }}>$500.00</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: primary, background: primary + "15", padding: "3px 9px", borderRadius: 9 }}>USD</span>
            </div>
          </div>
          <div style={{ marginBottom: 11 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 5, textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Payment date</div>
            <div style={{ background: bg, borderRadius: 12, padding: "13px 14px", border: `1.5px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: text }}>January 12, 2025</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="12" rx="2" stroke={muted} strokeWidth="1.5"/><path d="M5 1V4M11 1V4M1 7H15" stroke={muted} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 5, textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Notes (optional)</div>
            <div style={{ background: bg, borderRadius: 12, padding: "13px 14px", border: `1.5px solid ${border}`, height: 46 }}>
              <span style={{ fontSize: 14, color: muted + "80" }}>Add notes...</span>
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #0d7a55, #18a574)", borderRadius: 13, padding: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(24,165,116,0.35)" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>✓ Confirm Payment</span>
          </div>
        </div>

        <div style={{ flex: 1, margin: "10px 12px 0", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.7px", marginBottom: 8 }}>Payment history</div>
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: `1px solid ${border}`, gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: h.on_time ? success + "18" : "#fde8e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {h.on_time
                  ? <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 9L7 13L15 5" stroke={success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3V7.5" stroke="#e53535" strokeWidth="2" strokeLinecap="round"/><circle cx="7" cy="10.5" r="1" fill="#e53535"/></svg>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{h.month}</div>
                <div style={{ fontSize: 11, color: muted }}>Paid on {h.date} · {h.on_time ? "On time" : "Late"}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: success }}>${h.amount}</div>
            </div>
          ))}
          <div style={{ background: card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 7 }}>Member rating</div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {[1,2,3,4].map(s => (
                <svg key={s} width="24" height="24" viewBox="0 0 12 12" fill={amber}><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
              ))}
              <svg width="24" height="24" viewBox="0 0 12 12" fill="#dde4de"><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
              <span style={{ fontSize: 12, color: muted, marginLeft: 4 }}>4.0 · Good payer</span>
            </div>
          </div>
        </div>

        <div style={{ height: 30, flexShrink: 0, background: bg }} />
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(4,18,10,0.92) 0%, rgba(4,18,10,0.78) 45%, transparent 100%)",
        padding: `${Math.round(vh * 0.07)}px ${Math.round(vw * 0.06)}px ${Math.round(vh * 0.04)}px`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: Math.round(vw * 0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>
          Record payments<br />in seconds
        </div>
        <div style={{ fontSize: Math.round(vw * 0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh * 0.008), fontWeight: 500 }}>
          Full payment history for every member
        </div>
      </div>
    </div>
  );
}
