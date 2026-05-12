export default function FreshEn2() {
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
  const danger = "#e53535";
  const avatarColors = ["#18a574","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#10b981"];
  const members = [
    { name: "Maria Garcia", initials: "MG", turn: 1, paid: true, late: false },
    { name: "Jose Lopez", initials: "JL", turn: 2, paid: false, late: false },
    { name: "Ana Martinez", initials: "AM", turn: 3, paid: false, late: true },
    { name: "Carlos Ruiz", initials: "CR", turn: 4, paid: true, late: false },
    { name: "Laura Torres", initials: "LT", turn: 5, paid: true, late: false },
    { name: "Pedro Sanchez", initials: "PS", turn: 6, paid: false, late: false },
    { name: "Rosa Herrera", initials: "RH", turn: 7, paid: true, late: false },
    { name: "Miguel Angel", initials: "MA", turn: 8, paid: false, late: true },
    { name: "Sofia Ramirez", initials: "SR", turn: 9, paid: true, late: false },
    { name: "Diego Morales", initials: "DM", turn: 10, paid: false, late: false },
  ];
  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{ width: 428, height: innerH, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", zIndex: 2 }}>9:41</span>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 120, height: 34, background: "#000", borderRadius: 20, zIndex: 2 }} />
            <div style={{ display: "flex", gap: 5, alignItems: "center", zIndex: 2 }}>
              <svg width="15" height="11" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="white"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="white"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
              <svg width="22" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.5"/></svg>
            </div>
          </div>
          <div style={{ padding: "8px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="14" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Christmas Tanda 2025</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>10 members · Turn 3/12</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "10px 18px 14px" }}>
            {[["$500","Contribution"],["$1,500","Collected"],["3/12","Turn"]].map(([val,lbl],i)=>(
              <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "7px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: card, display: "flex", borderBottom: `2px solid ${border}`, flexShrink: 0 }}>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", color: muted, fontSize: 14, fontWeight: 500 }}>Summary</div>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", borderBottom: `2.5px solid ${primary}`, color: primary, fontSize: 14, fontWeight: 700 }}>Members</div>
        </div>
        <div style={{ flex: 1, overflowY: "hidden", padding: "8px 12px 0" }}>
          {members.map((m,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: `1px solid ${border}`, gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: avatarColors[i%avatarColors.length]+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: avatarColors[i%avatarColors.length], flexShrink: 0, border: `2px solid ${avatarColors[i%avatarColors.length]}40` }}>{m.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{m.name}</div>
                <div style={{ fontSize: 11, color: muted }}>Turn {m.turn}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 18, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success+"18" : m.late ? danger+"15" : muted+"15" }}>
                {m.paid ? "✓ Paid" : m.late ? "● Late" : "Pending"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 12px 28px", background: bg, flexShrink: 0 }}>
          <div style={{ background: "linear-gradient(135deg,#0d7a55,#18a574)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M10 1V19M1 10H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Add Member</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: `${Math.round(vh*0.07)}px ${Math.round(vw*0.06)}px ${Math.round(vh*0.04)}px`, textAlign: "center" }}>
        <div style={{ fontSize: Math.round(vw*0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>See who paid<br/>at a glance</div>
        <div style={{ fontSize: Math.round(vw*0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh*0.008), fontWeight: 500 }}>Real-time payment tracking for every member</div>
      </div>
    </div>
  );
}
