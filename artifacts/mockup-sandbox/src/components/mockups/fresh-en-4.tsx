export default function FreshEn4() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1284;
  const vh = typeof window !== "undefined" ? window.innerHeight : 2778;
  const scale = vw / 428;
  const innerH = Math.ceil(vh / scale);
  const primary = "#18a574";
  const bg = "#f0f4f1";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const success = "#18a574";
  const payments = [
    { month: "December 2024", date: "Dec 1 · On time", amount: "$500", ok: true },
    { month: "November 2024", date: "Oct 30 · On time", amount: "$500", ok: true },
    { month: "October 2024", date: "Oct 2 · On time", amount: "$500", ok: true },
    { month: "September 2024", date: "Sep 5 · Late", amount: "$500", ok: false },
    { month: "August 2024", date: "Aug 1 · On time", amount: "$500", ok: true },
    { month: "July 2024", date: "Jul 1 · On time", amount: "$500", ok: true },
  ];
  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{ width: 428, height: innerH, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "8px 18px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>JL</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Jose Lopez</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Christmas Tanda · Turn 2/12</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "8px 18px 14px" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 18, padding: "4px 12px" }}><span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>$500/turn</span></div>
            <div style={{ background: "rgba(240,165,0,0.35)", borderRadius: 18, padding: "4px 12px" }}><span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Pending</span></div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "hidden", padding: "12px 12px 0" }}>
          <div style={{ background: card, borderRadius: 14, padding: "14px", border: `1px solid ${border}`, marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 12 }}>Record Payment</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Amount</div>
            <div style={{ display: "flex", alignItems: "center", background: bg, border: `2px solid ${primary}`, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: muted, marginRight: 4 }}>$</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: text, flex: 1 }}>500.00</span>
              <span style={{ fontSize: 12, color: muted }}>USD</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Payment Date</div>
            <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: text }}>January 12, 2025</span>
              <span>📅</span>
            </div>
            <div style={{ background: "linear-gradient(135deg,#0d7a55,#18a574)", borderRadius: 10, padding: "13px", textAlign: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>✓ Confirm Payment</span>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 8 }}>Payment History</div>
          {payments.map((p,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 10, padding: "10px 12px", marginBottom: 7, border: `1px solid ${border}` }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: p.ok?success+"18":"#fef3f2", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0, fontSize: 13 }}>{p.ok?"✓":"!"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.month}</div>
                <div style={{ fontSize: 11, color: muted }}>{p.date}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: success }}>{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: `${Math.round(vh*0.07)}px ${Math.round(vw*0.06)}px ${Math.round(vh*0.04)}px`, textAlign: "center" }}>
        <div style={{ fontSize: Math.round(vw*0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>Record payments<br/>in seconds</div>
        <div style={{ fontSize: Math.round(vw*0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh*0.008), fontWeight: 500 }}>Full payment history for every member</div>
      </div>
    </div>
  );
}
