export default function FreshEs2() {
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
    { name: "María García", initials: "MG", turn: 1, paid: true, late: false },
    { name: "José López", initials: "JL", turn: 2, paid: false, late: false },
    { name: "Ana Martínez", initials: "AM", turn: 3, paid: false, late: true },
    { name: "Carlos Ruiz", initials: "CR", turn: 4, paid: true, late: false },
    { name: "Laura Torres", initials: "LT", turn: 5, paid: true, late: false },
    { name: "Pedro Sánchez", initials: "PS", turn: 6, paid: false, late: false },
    { name: "Rosa Herrera", initials: "RH", turn: 7, paid: true, late: false },
    { name: "Miguel Ángel", initials: "MÁ", turn: 8, paid: false, late: true },
    { name: "Sofía Ramírez", initials: "SR", turn: 9, paid: true, late: false },
    { name: "Diego Morales", initials: "DM", turn: 10, paid: false, late: false },
  ];
  return (
    <div style={{ width: vw, height: vh, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{ width: 428, height: innerH, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0 }}>
          <div style={{ padding: "8px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="14" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Tanda Navidad 2025</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>10 integrantes · Turno 3/12</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "10px 18px 14px" }}>
            {[["$500","Aportación"],["$1,500","Cobrado"],["3/12","Turno"]].map(([val,lbl],i)=>(
              <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "7px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: card, display: "flex", borderBottom: `2px solid ${border}`, flexShrink: 0 }}>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", color: muted, fontSize: 14, fontWeight: 500 }}>Resumen</div>
          <div style={{ flex: 1, padding: "11px 0", textAlign: "center", borderBottom: `2.5px solid ${primary}`, color: primary, fontSize: 14, fontWeight: 700 }}>Integrantes</div>
        </div>
        <div style={{ flex: 1, overflowY: "hidden", padding: "8px 12px 0" }}>
          {members.map((m,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: `1px solid ${border}`, gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: avatarColors[i%avatarColors.length]+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: avatarColors[i%avatarColors.length], flexShrink: 0, border: `2px solid ${avatarColors[i%avatarColors.length]}40` }}>{m.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{m.name}</div>
                <div style={{ fontSize: 11, color: muted }}>Turno {m.turn}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 18, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success+"18" : m.late ? danger+"15" : muted+"15" }}>
                {m.paid ? "✓ Pagó" : m.late ? "● Tardío" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 12px 28px", background: bg, flexShrink: 0 }}>
          <div style={{ background: "linear-gradient(135deg,#0d7a55,#18a574)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M10 1V19M1 10H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Agregar Integrante</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: `${Math.round(vh*0.07)}px ${Math.round(vw*0.06)}px ${Math.round(vh*0.04)}px`, textAlign: "center" }}>
        <div style={{ fontSize: Math.round(vw*0.074), fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1.15 }}>Ve quién pagó<br/>de un vistazo</div>
        <div style={{ fontSize: Math.round(vw*0.033), color: "rgba(255,255,255,0.65)", marginTop: Math.round(vh*0.008), fontWeight: 500 }}>Seguimiento de pagos en tiempo real</div>
      </div>
    </div>
  );
}
