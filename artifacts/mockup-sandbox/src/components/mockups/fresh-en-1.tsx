export default function FreshEn1() {
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
  const circles = [
    { name: "Christmas Tanda 2025", freq: "Monthly", active: true, cycle: 3, total: 12, amount: 500, members: 12, pct: 25 },
    { name: "Family Savings Circle", freq: "Biweekly", active: true, cycle: 7, total: 10, amount: 250, members: 10, pct: 70 },
    { name: "Friends Group", freq: "Weekly", active: false, cycle: 8, total: 8, amount: 100, members: 8, pct: 100 },
    { name: "Work Circle", freq: "Monthly", active: true, cycle: 1, total: 6, amount: 1000, members: 6, pct: 17 },
    { name: "Neighborhood Circle", freq: "Monthly", active: true, cycle: 2, total: 8, amount: 300, members: 8, pct: 25 },
    { name: "Ladies Group", freq: "Biweekly", active: true, cycle: 5, total: 12, amount: 400, members: 12, pct: 42 },
  ];
  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{ width: 428, height: innerH, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "10px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>My Circles</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>6 circles · 56 members</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, padding: "10px 16px 14px" }}>
            {[["5 Active","rgba(255,255,255,0.18)"],["$8,450 Collected","rgba(240,165,0,0.3)"]].map(([label,bg2],i)=>(
              <div key={i} style={{ background: bg2, borderRadius: 18, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "hidden", padding: "10px 12px 0", background: bg }}>
          {circles.map((c,i)=>(
            <div key={i} style={{ background: card, borderRadius: 14, padding: "12px 13px", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>↻ {c.freq} · {c.members} members</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.active ? primary : muted, background: c.active ? primary+"18" : "#f0f0f0", padding: "3px 8px", borderRadius: 18, marginLeft: 6, flexShrink: 0 }}>
                  {c.active ? "● Active" : "Inactive"}
                </span>
              </div>
              <div style={{ height: 3, background: "#eef2ef", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg,${primary},#22c98a)`, borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 10, color: muted }}>Contribution</div><div style={{ fontSize: 16, fontWeight: 800, color: primary }}>${c.amount.toLocaleString()}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: muted }}>Turn</div><div style={{ fontSize: 13, fontWeight: 700, color: text }}>{c.cycle}/{c.total}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: muted }}>Progress</div><div style={{ fontSize: 13, fontWeight: 700, color: primary }}>{c.pct}%</div></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 30, paddingTop: 10, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="22" height="18" viewBox="0 0 26 22" fill="none"><path d="M9 10C11.8 10 14 7.8 14 5C14 2.2 11.8 0 9 0C6.2 0 4 2.2 4 5C4 7.8 6.2 10 9 10Z" fill={primary}/><path d="M9 12C5.7 12 0 13.7 0 17V19H18V17C18 13.7 12.3 12 9 12Z" fill={primary}/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: primary }}>Circles</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={muted} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={muted} strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 10, color: muted }}>Settings</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: `${Math.round(vh*0.07)}px ${Math.round(vw*0.06)}px ${Math.round(vh*0.04)}px`, textAlign: "center" }}>
        <div style={{ fontSize: Math.round(vw*0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>All your circles<br/>in one place</div>
        <div style={{ fontSize: Math.round(vw*0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh*0.008), fontWeight: 500 }}>Manage every savings circle with ease</div>
      </div>
    </div>
  );
}
