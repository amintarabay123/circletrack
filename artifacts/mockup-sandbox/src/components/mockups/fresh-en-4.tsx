export default function FreshEn4() {
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
  ];
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: bg, fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
        <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>9:41</span>
          <div style={{ width: 126, height: 36, background: "#000", borderRadius: 20 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <svg width="16" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="white"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="white"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
            <svg width="23" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.5"/></svg>
          </div>
        </div>
        <div style={{ padding: "10px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>J</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Jose Lopez</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Christmas Tanda · Turn 2/12</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "10px 20px 16px" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 18, padding: "5px 13px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>$500/turn</span>
          </div>
          <div style={{ background: "rgba(240,165,0,0.35)", borderRadius: 18, padding: "5px 13px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Pending</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 14px", background: bg, flex: 1, overflowY: "hidden" }}>
        <div style={{ background: card, borderRadius: 16, padding: "16px", border: `1px solid ${border}`, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: text, marginBottom: 14 }}>Record Payment</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Amount</div>
          <div style={{ display: "flex", alignItems: "center", background: bg, border: `2px solid ${primary}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: muted, marginRight: 5 }}>$</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: text, flex: 1 }}>500.00</span>
            <span style={{ fontSize: 13, color: muted }}>USD</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Payment Date</div>
          <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, color: text }}>January 12, 2025</span>
            <span style={{ fontSize: 16 }}>📅</span>
          </div>
          <div style={{ background: "linear-gradient(135deg,#0d7a55,#18a574)", borderRadius: 12, padding: "15px", textAlign: "center", boxShadow: "0 4px 14px rgba(24,165,116,0.35)" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>✓ Confirm Payment</span>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Payment History</div>
        {payments.map((p,i)=>(
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: `1px solid ${border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: p.ok?success+"18":"#fef3f2", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 15 }}>{p.ok?"✓":"!"}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: text }}>{p.month}</div>
              <div style={{ fontSize: 12, color: muted }}>{p.date}</div>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: success }}>{p.amount}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: "110px 32px 52px", textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>Record payments<br/>in seconds</div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", marginTop: 10, fontWeight: 500 }}>Full payment history for every member</div>
      </div>
    </div>
  );
}
