export default function CirclesListPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";
  const success = "#22b55a";

  const circles = [
    { name: "Tanda Navidad 2025", freq: "Mensual", active: true, cycle: 3, total: 12, amount: 500 },
    { name: "Tanda Familiar", freq: "Quincenal", active: true, cycle: 7, total: 10, amount: 250 },
    { name: "Tanda Amigos", freq: "Semanal", active: false, cycle: 8, total: 8, amount: 100 },
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg, minHeight: "100vh", padding: "0" }}>
      <div style={{ paddingTop: 56, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: text }}>Mis Tandas</span>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, cursor: "pointer" }}>+</div>
        </div>
      </div>
      <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}>
        {circles.map((c, i) => (
          <div key={i} style={{ background: card, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: text }}>{c.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.active ? primary : muted, background: c.active ? primary + "20" : "#eff1f5", padding: "3px 10px", borderRadius: 20 }}>
                {c.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: muted }}>🔄 {c.freq}</span>
              <span style={{ fontSize: 13, color: muted }}>👥 Turno {c.cycle}/{c.total}</span>
            </div>
            <div style={{ height: 1, background: border, margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: primary }}>${c.amount.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Aportación</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: text }}>Turno {c.cycle} <span style={{ color: muted }}>de {c.total}</span></div>
                <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>›</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: card, borderTop: `1px solid ${border}`, display: "flex", height: 84 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: primary, gap: 4 }}>
          <span style={{ fontSize: 22 }}>👥</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Tandas</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: muted, gap: 4 }}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontSize: 11 }}>Ajustes</span>
        </div>
      </div>
    </div>
  );
}
