export default function ScreenshotAddMember() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#e2e6ef";
  const muted = "#636e82";
  const text = "#141c2e";
  const success = "#22b55a";

  const members = [
    { name: "María García", turn: 1, rating: 5, paid: true },
    { name: "José López", turn: 2, rating: 4, paid: false },
    { name: "Ana Martínez", turn: 3, rating: 3, paid: false },
    { name: "Carlos Ruiz", turn: 4, rating: 5, paid: true },
    { name: "Laura Torres", turn: 5, rating: 4, paid: true },
    { name: "Pedro Sánchez", turn: 6, rating: 5, paid: false },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh", background: bg, overflow: "hidden",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* iOS Status Bar */}
      <div style={{ background: bg, padding: "14px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: text, letterSpacing: -0.3 }}>9:41</span>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 126, height: 34, background: "#000", borderRadius: 20 }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="1" fill={text}/>
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={text}/>
            <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={text}/>
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill={text}/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.2L15.5 4C13.6 2 11 1 8 1C5 1 2.4 2 0.5 4L1.7 5.2C3.3 3.5 5.5 2.5 8 2.5Z" fill={text}/>
            <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.5 6.1C12.1 4.8 10.2 4 8 4C5.8 4 3.9 4.8 2.5 6.1L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill={text}/>
            <path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.5L8 12L5.5 9.5C6.1 8.9 7 8.5 8 8.5Z" fill={text}/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={text} strokeOpacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill={text}/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill={text} fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: bg, padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke={text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: text, letterSpacing: -0.3 }}>Tanda Navidad 2025</div>
          <div style={{ fontSize: 13, color: muted }}>Mensual · Turno 3 de 12</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: bg, display: "flex", borderBottom: `1px solid ${border}`, paddingLeft: 20, flexShrink: 0 }}>
        <div style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 4, paddingRight: 16, color: muted, fontSize: 15 }}>Resumen</div>
        <div style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 16, paddingRight: 16, borderBottom: `2px solid ${primary}`, color: primary, fontSize: 15, fontWeight: 600 }}>Integrantes</div>
      </div>

      {/* Members list */}
      <div style={{ flex: 1, overflowY: "hidden", padding: "12px 16px" }}>
        {members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${border}`, gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: primary, flexShrink: 0 }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: text }}>{m.name}</div>
              <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={s <= m.rating ? "#f5a623" : "#e2e6ef"}><path d="M6 0L7.35 4.15H12L8.55 6.7L9.9 10.85L6 8.3L2.1 10.85L3.45 6.7L0 4.15H4.65L6 0Z"/></svg>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 4 }}>Turno {m.turn}</div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, color: m.paid ? success : muted, background: m.paid ? success + "15" : muted + "15" }}>
                {m.paid ? "Pagado" : "Pendiente"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ padding: "10px 16px 34px", background: bg, flexShrink: 0 }}>
        <div style={{ background: primary, borderRadius: 14, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1V17M1 9H17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>Agregar Integrante</span>
        </div>
      </div>
    </div>
  );
}
