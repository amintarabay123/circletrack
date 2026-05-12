export default function ScreenshotAddMember() {
  const scale = typeof window !== "undefined" ? window.innerWidth / 428 : 3;

  const primary = "#18a574";
  const bg = "#f0f4f0";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const success = "#18a574";
  const amber = "#f0a500";
  const avatarColors = ["#18a574","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#10b981","#f97316","#6366f1"];

  const members = [
    { name: "María García", turn: 1, rating: 5, paid: true, initials: "MG", note: "Siempre puntual" },
    { name: "José López", turn: 2, rating: 4, paid: false, initials: "JL", note: "Buen pagador" },
    { name: "Ana Martínez", turn: 3, rating: 3, paid: false, initials: "AM", note: "" },
    { name: "Carlos Ruiz", turn: 4, rating: 5, paid: true, initials: "CR", note: "Muy confiable" },
    { name: "Laura Torres", turn: 5, rating: 4, paid: true, initials: "LT", note: "" },
    { name: "Pedro Sánchez", turn: 6, rating: 5, paid: false, initials: "PS", note: "Excelente historial" },
    { name: "Rosa Herrera", turn: 7, rating: 4, paid: true, initials: "RH", note: "" },
    { name: "Miguel Ángel", turn: 8, rating: 2, paid: false, initials: "MÁ", note: "Pago tardío" },
    { name: "Sofía Ramírez", turn: 9, rating: 5, paid: true, initials: "SR", note: "" },
    { name: "Diego Morales", turn: 10, rating: 3, paid: false, initials: "DM", note: "" },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: bg }}>
      <div style={{
        width: 428, height: 926,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
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
          <div style={{ padding: "8px 18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
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
        </div>

        {/* Tabs */}
        <div style={{ background: card, display: "flex", borderBottom: `2px solid ${border}`, flexShrink: 0 }}>
          <div style={{ flex: 1, paddingBottom: 10, paddingTop: 12, textAlign: "center", color: muted, fontSize: 14, fontWeight: 500 }}>Resumen</div>
          <div style={{ flex: 1, paddingBottom: 10, paddingTop: 12, textAlign: "center", borderBottom: `2.5px solid ${primary}`, color: primary, fontSize: 14, fontWeight: 700 }}>Integrantes</div>
        </div>

        {/* Members list */}
        <div style={{ flex: 1, overflowY: "hidden", padding: "10px 12px 0" }}>
          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 14, padding: "10px 12px", marginBottom: 7, border: `1px solid ${border}`, gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: avatarColors[i % avatarColors.length] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: avatarColors[i % avatarColors.length], flexShrink: 0, border: `2px solid ${avatarColors[i % avatarColors.length]}40` }}>
                {m.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{m.name}</div>
                <div style={{ display: "flex", gap: 1, marginTop: 2, alignItems: "center" }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill={s <= m.rating ? amber : "#dde4de"}><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
                  ))}
                  {m.note ? <span style={{ fontSize: 10, color: muted, marginLeft: 3 }}>{m.note}</span> : null}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: muted, marginBottom: 3 }}>Turno {m.turn}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 18, color: m.paid ? success : muted, background: m.paid ? success + "18" : muted + "15" }}>
                  {m.paid ? "✓ Pagó" : "Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div style={{ padding: "8px 12px 32px", background: bg, flexShrink: 0 }}>
          <div style={{ background: "linear-gradient(135deg, #0d7a55, #18a574)", borderRadius: 14, padding: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(24,165,116,0.35)" }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M10 1V19M1 10H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Agregar Integrante</span>
          </div>
        </div>
      </div>
    </div>
  );
}
