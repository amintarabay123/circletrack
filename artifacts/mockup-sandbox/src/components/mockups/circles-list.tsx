export default function CirclesListPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";

  const circles = [
    { name: "Tanda Navidad 2025", freq: "Mensual", active: true, cycle: 3, total: 12, amount: 500 },
    { name: "Tanda Familiar", freq: "Quincenal", active: true, cycle: 7, total: 10, amount: 250 },
    { name: "Tanda Amigos", freq: "Semanal", active: false, cycle: 8, total: 8, amount: 100 },
    { name: "Tanda del Trabajo", freq: "Mensual", active: true, cycle: 1, total: 6, amount: 1000 },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "linear-gradient(145deg, #0a2235 0%, #0e2a38 45%, #141c3a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 36, position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.18) 0%, transparent 65%)", top: "-10%", right: "-10%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.12) 0%, transparent 65%)", bottom: "5%", left: "-8%", pointerEvents: "none" }} />

      {/* Headline */}
      <div style={{ textAlign: "center", color: "#fff", zIndex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 8 }}>
          Todas tus tandas<br />en un solo lugar
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Controla cada círculo de ahorro fácilmente
        </div>
      </div>

      {/* Phone */}
      <div style={{
        width: 310, background: bg, borderRadius: 40, overflow: "hidden", zIndex: 1,
        boxShadow: "0 50px 100px rgba(0,0,0,0.65), 0 0 0 8px #1e2a3a, 0 0 0 10px #243040",
      }}>
        {/* Status bar */}
        <div style={{ background: bg, padding: "14px 18px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="3" width="3" height="7" rx="1" fill={text} opacity="0.4"/><rect x="4" y="2" width="3" height="8" rx="1" fill={text} opacity="0.6"/><rect x="8" y="0" width="3" height="10" rx="1" fill={text}/><rect x="12" y="1" width="2" height="8" rx="1" fill={text} opacity="0.3"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 2C9.5 2 11.7 3.1 13.1 4.9L14 4C12.4 1.6 9.9 0 7 0C4.1 0 1.6 1.6 0 4L0.9 4.9C2.3 3.1 4.5 2 7 2Z" fill={text}/><path d="M7 5C8.7 5 10.2 5.7 11.3 6.9L12.2 6C10.9 4.5 9.1 3.5 7 3.5C4.9 3.5 3.1 4.5 1.8 6L2.7 6.9C3.8 5.7 5.3 5 7 5Z" fill={text}/><circle cx="7" cy="9" r="1.5" fill={text}/></svg>
            <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/><rect x="19" y="3" width="2" height="4" rx="1" fill={text} opacity="0.4"/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "6px 18px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: text }}>Mis Tandas</span>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, lineHeight: 1 }}>+</div>
        </div>

        {/* Cards */}
        <div style={{ padding: "6px 14px 14px" }}>
          {circles.map((c, i) => (
            <div key={i} style={{ background: card, borderRadius: 13, padding: "11px 13px", marginBottom: 9, border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{c.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: c.active ? primary : muted, background: c.active ? primary + "18" : "#eff1f5", padding: "2px 7px", borderRadius: 20, letterSpacing: 0.3 }}>
                  {c.active ? "ACTIVA" : "INACTIVA"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                <span style={{ fontSize: 10, color: muted }}>↻ {c.freq}</span>
                <span style={{ fontSize: 10, color: muted }}>Turno {c.cycle}/{c.total}</span>
              </div>
              <div style={{ height: 1, background: border, margin: "7px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: primary }}>${c.amount.toLocaleString()}</span>
                <span style={{ fontSize: 10, color: muted }}>Turno {c.cycle} de {c.total} ›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 18 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 2 }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8ZM8 10C5.3 10 0 11.3 0 14V16H16V14C16 11.3 10.7 10 8 10Z" fill={primary}/><path d="M15 8C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2C14.3 2 13.7 2.2 13.2 2.6C13.7 3.3 14 4.1 14 5C14 5.9 13.7 6.7 13.2 7.4C13.7 7.8 14.3 8 15 8ZM15 10C14 10 13.1 10.2 12.3 10.5C13.3 11.4 14 12.6 14 14V16H22V14C22 11.3 17.7 10 15 10Z" fill={primary} opacity="0.6"/></svg>
            <span style={{ fontSize: 9, fontWeight: 700, color: primary }}>Tandas</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 2 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill={muted}/></svg>
            <span style={{ fontSize: 9, color: muted }}>Ajustes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
