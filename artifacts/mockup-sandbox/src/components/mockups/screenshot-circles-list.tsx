export default function ScreenshotCirclesList() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#e2e6ef";
  const muted = "#636e82";
  const text = "#141c2e";

  const circles = [
    { name: "Tanda Navidad 2025", freq: "Mensual", active: true, cycle: 3, total: 12, amount: 500, members: 12 },
    { name: "Tanda Familiar", freq: "Quincenal", active: true, cycle: 7, total: 10, amount: 250, members: 10 },
    { name: "Tanda Amigos", freq: "Semanal", active: false, cycle: 8, total: 8, amount: 100, members: 8 },
    { name: "Tanda del Trabajo", freq: "Mensual", active: true, cycle: 1, total: 6, amount: 1000, members: 6 },
    { name: "Tanda Vecinos", freq: "Mensual", active: true, cycle: 2, total: 8, amount: 300, members: 8 },
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

      {/* Navigation Bar */}
      <div style={{ background: bg, padding: "8px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: text, letterSpacing: -0.5 }}>Mis Tandas</span>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1V17M1 9H17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "hidden", padding: "12px 16px" }}>
        {circles.map((c, i) => (
          <div key={i} style={{ background: card, borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: text, letterSpacing: -0.3 }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.active ? primary : muted, background: c.active ? primary + "18" : "#eff1f5", padding: "3px 10px", borderRadius: 20 }}>
                {c.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: muted }}>↻ {c.freq}</span>
              <span style={{ fontSize: 13, color: muted }}>•</span>
              <span style={{ fontSize: 13, color: muted }}>Turno {c.cycle} de {c.total}</span>
              <span style={{ fontSize: 13, color: muted }}>•</span>
              <span style={{ fontSize: 13, color: muted }}>{c.members} integrantes</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: primary }}>${c.amount.toLocaleString()}</span>
              <span style={{ fontSize: 13, color: muted }}>›</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 28, paddingTop: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, paddingTop: 4 }}>
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
            <path d="M9 10C11.8 10 14 7.8 14 5C14 2.2 11.8 0 9 0C6.2 0 4 2.2 4 5C4 7.8 6.2 10 9 10Z" fill={primary}/>
            <path d="M9 12C5.7 12 0 13.7 0 17V19H18V17C18 13.7 12.3 12 9 12Z" fill={primary}/>
            <path d="M19 10C21 10 22.5 8.5 22.5 6.5C22.5 4.5 21 3 19 3C18.2 3 17.5 3.3 17 3.8C17.6 4.6 18 5.7 18 7C18 8 17.7 8.9 17.2 9.6C17.7 9.9 18.3 10 19 10Z" fill={primary} fillOpacity="0.6"/>
            <path d="M19 12C17.9 12 16.9 12.2 16.1 12.6C17.4 13.6 18.3 15 18.3 17V19H26V17C26 13.7 22.3 12 19 12Z" fill={primary} fillOpacity="0.6"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, color: primary }}>Tandas</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, paddingTop: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={muted} strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 10, color: muted }}>Ajustes</span>
        </div>
      </div>
    </div>
  );
}
