export default function FreshEn3() {
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
        <div style={{ padding: "10px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="9" height="14" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Christmas Tanda 2025</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>10 members · Turn 3/12</div>
          </div>
        </div>
      </div>
      <div style={{ background: card, display: "flex", borderBottom: `2px solid ${border}`, flexShrink: 0 }}>
        <div style={{ flex: 1, padding: "13px 0", textAlign: "center", color: muted, fontSize: 15 }}>Summary</div>
        <div style={{ flex: 1, padding: "13px 0", textAlign: "center", borderBottom: `2.5px solid ${primary}`, color: primary, fontSize: 15, fontWeight: 700 }}>Ratings</div>
      </div>
      <div style={{ flex: 1, overflowY: "hidden", padding: "10px 14px 0", background: bg }}>
        {members.map((m,i)=>(
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 14, padding: "10px 13px", marginBottom: 7, border: `1px solid ${border}`, gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: avatarColors[i%avatarColors.length]+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: avatarColors[i%avatarColors.length], flexShrink: 0, border: `2px solid ${avatarColors[i%avatarColors.length]}40` }}>{m.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{m.name}</div>
              <div style={{ display: "flex", gap: 1, marginTop: 3, alignItems: "center" }}>
                {[1,2,3,4,5].map(s=>(
                  <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill={s<=m.rating?amber:"#dde4de"}><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
                ))}
                {m.note?<span style={{ fontSize: 10, color: muted, marginLeft: 4 }}>{m.note}</span>:null}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 18, color: m.paid?primary:muted, background: m.paid?primary+"18":muted+"15" }}>
                {m.paid?"✓ Paid":"Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: "110px 32px 52px", textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>Rate your<br/>members</div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", marginTop: 10, fontWeight: 500 }}>Trust history for every member</div>
      </div>
    </div>
  );
}
