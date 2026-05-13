export default function FreshEn3() {
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
  const amber = "#f0a500";
  const avatarColors = ["#18a574","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#10b981","#f97316","#6366f1"];
  const members = [
    { name: "Maria Garcia", initials: "MG", turn: 1, rating: 5, note: "Always on time", paid: true },
    { name: "Jose Lopez", initials: "JL", turn: 2, rating: 4, note: "Good payer", paid: false },
    { name: "Ana Martinez", initials: "AM", turn: 3, rating: 3, note: "", paid: false },
    { name: "Carlos Ruiz", initials: "CR", turn: 4, rating: 5, note: "Very reliable", paid: true },
    { name: "Laura Torres", initials: "LT", turn: 5, rating: 4, note: "", paid: true },
    { name: "Pedro Sanchez", initials: "PS", turn: 6, rating: 5, note: "Excellent record", paid: false },
    { name: "Rosa Herrera", initials: "RH", turn: 7, rating: 4, note: "", paid: true },
    { name: "Miguel Angel", initials: "MA", turn: 8, rating: 2, note: "Late payment", paid: false },
    { name: "Sofia Ramirez", initials: "SR", turn: 9, rating: 5, note: "", paid: true },
    { name: "Diego Morales", initials: "DM", turn: 10, rating: 3, note: "", paid: false },
  ];
  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{ width: 428, height: innerH, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "8px 18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="14" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Christmas Tanda 2025</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>10 members · Turn 3/12</div>
            </div>
          </div>
        </div>
        <div style={{ background: card, display: "flex", borderBottom: `2px solid ${border}`, flexShrink: 0 }}>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", color: muted, fontSize: 14 }}>Summary</div>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", borderBottom: `2.5px solid ${primary}`, color: primary, fontSize: 14, fontWeight: 700 }}>Ratings</div>
        </div>
        <div style={{ flex: 1, overflowY: "hidden", padding: "8px 12px 0" }}>
          {members.map((m,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "9px 12px", marginBottom: 6, border: `1px solid ${border}`, gap: 9 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: avatarColors[i%avatarColors.length]+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: avatarColors[i%avatarColors.length], flexShrink: 0, border: `2px solid ${avatarColors[i%avatarColors.length]}40` }}>{m.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{m.name}</div>
                <div style={{ display: "flex", gap: 1, marginTop: 2, alignItems: "center" }}>
                  {[1,2,3,4,5].map(s=>(
                    <svg key={s} width="10" height="10" viewBox="0 0 12 12" fill={s<=m.rating?amber:"#dde4de"}><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
                  ))}
                  {m.note?<span style={{ fontSize: 10, color: muted, marginLeft: 3 }}>{m.note}</span>:null}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 18, color: m.paid?primary:muted, background: m.paid?primary+"18":muted+"15" }}>
                {m.paid?"✓ Paid":"Pending"}
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
        <div style={{ fontSize: Math.round(vw*0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>Rate your<br/>members</div>
        <div style={{ fontSize: Math.round(vw*0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh*0.008), fontWeight: 500 }}>Trust history for every member</div>
      </div>
    </div>
  );
}
