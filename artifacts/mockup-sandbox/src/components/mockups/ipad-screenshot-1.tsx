export default function IPadScreenshot1() {
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
    { name: "Tanda Vecinos", freq: "Mensual", active: true, cycle: 2, total: 8, amount: 300 },
  ];

  return (
    <div style={{
      width: 2064, height: 2752,
      background: "linear-gradient(145deg, #0a2235 0%, #0e2a38 45%, #141c3a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 80, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 1800, height: 1800, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.18) 0%, transparent 65%)", top: "-10%", right: "-15%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.12) 0%, transparent 65%)", bottom: "0%", left: "-12%", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", color: "#fff", zIndex: 1, padding: "0 120px" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -3, lineHeight: 1.1, marginBottom: 28 }}>
          Todas tus tandas<br />en un solo lugar
        </div>
        <div style={{ fontSize: 52, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Controla cada círculo de ahorro fácilmente
        </div>
      </div>

      {/* iPad frame */}
      <div style={{
        width: 1500, background: bg, borderRadius: 80, overflow: "hidden", zIndex: 1,
        boxShadow: "0 80px 200px rgba(0,0,0,0.7), 0 0 0 24px #1e2a3a, 0 0 0 30px #243040",
      }}>
        {/* Status bar */}
        <div style={{ background: bg, padding: "36px 60px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#1e2a3a" }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <svg width="44" height="30" viewBox="0 0 14 10"><rect x="0" y="3" width="3" height="7" rx="1" fill={text} opacity="0.4"/><rect x="4" y="2" width="3" height="8" rx="1" fill={text} opacity="0.6"/><rect x="8" y="0" width="3" height="10" rx="1" fill={text}/><rect x="12" y="1" width="2" height="8" rx="1" fill={text} opacity="0.3"/></svg>
            <svg width="44" height="30" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/><rect x="19" y="3" width="2" height="4" rx="1" fill={text} opacity="0.4"/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "16px 60px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: text }}>Mis Tandas</span>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 56, lineHeight: 1 }}>+</div>
        </div>

        {/* Cards */}
        <div style={{ padding: "8px 48px 48px" }}>
          {circles.map((c, i) => (
            <div key={i} style={{ background: card, borderRadius: 36, padding: "32px 40px", marginBottom: 24, border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 40, fontWeight: 600, color: text }}>{c.name}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: c.active ? primary : muted, background: c.active ? primary + "18" : "#eff1f5", padding: "8px 24px", borderRadius: 40 }}>
                  {c.active ? "ACTIVA" : "INACTIVA"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 14 }}>
                <span style={{ fontSize: 30, color: muted }}>↻ {c.freq}</span>
                <span style={{ fontSize: 30, color: muted }}>Turno {c.cycle}/{c.total}</span>
              </div>
              <div style={{ height: 1, background: border, margin: "20px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 52, fontWeight: 700, color: primary }}>${c.amount.toLocaleString()}</span>
                <span style={{ fontSize: 28, color: muted }}>Turno {c.cycle} de {c.total} ›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 50 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24, gap: 8 }}>
            <svg width="60" height="50" viewBox="0 0 22 18" fill="none"><path d="M8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8ZM8 10C5.3 10 0 11.3 0 14V16H16V14C16 11.3 10.7 10 8 10Z" fill={primary}/><path d="M15 8C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2C14.3 2 13.7 2.2 13.2 2.6C13.7 3.3 14 4.1 14 5C14 5.9 13.7 6.7 13.2 7.4C13.7 7.8 14.3 8 15 8ZM15 10C14 10 13.1 10.2 12.3 10.5C13.3 11.4 14 12.6 14 14V16H22V14C22 11.3 17.7 10 15 10Z" fill={primary} opacity="0.6"/></svg>
            <span style={{ fontSize: 26, fontWeight: 700, color: primary }}>Tandas</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24, gap: 8 }}>
            <svg width="56" height="56" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill={muted}/></svg>
            <span style={{ fontSize: 26, color: muted }}>Ajustes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
