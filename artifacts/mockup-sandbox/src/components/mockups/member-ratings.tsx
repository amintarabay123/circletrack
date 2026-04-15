export default function MemberRatingsPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";
  const success = "#22b55a";
  const danger = "#e52222";
  const amber = "#f59e0b";

  const ratings = [
    { name: "María García", on: 12, late: 0, missed: 0, score: 100, rating: "excellent", color: success },
    { name: "José López", on: 9, late: 2, missed: 1, score: 75, rating: "good", color: primary },
    { name: "Ana Martínez", on: 6, late: 4, missed: 2, score: 58, rating: "fair", color: amber },
    { name: "Carlos Ruiz", on: 11, late: 1, missed: 0, score: 92, rating: "excellent", color: success },
  ];

  const labels: Record<string, string> = { excellent: "Excelente", good: "Buena", fair: "Regular" };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ paddingTop: 56, paddingLeft: 16, paddingRight: 16, paddingBottom: 10, display: "flex", alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>‹</div>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: text }}>Tanda Navidad 2025</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 1 }}>Mensual · Turno 3 de 12</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginLeft: 16, marginRight: 16 }}>
        <div style={{ padding: "10px 16px", color: muted, fontSize: 15 }}>Resumen</div>
        <div style={{ padding: "10px 16px", borderBottom: `2px solid ${primary}`, color: primary, fontSize: 15, fontWeight: 500 }}>Integrantes</div>
      </div>

      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 20, marginBottom: 10 }}>Calificación de integrantes</div>

        {ratings.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: 12, marginBottom: 8, border: `1px solid ${border}`, gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: r.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: r.color }}>
              {r.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{r.name}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: success }}>✓ {r.on}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: amber }}>! {r.late}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: danger }}>✗ {r.missed}</span>
              </div>
            </div>
            <div style={{ alignItems: "flex-end", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: r.color }}>{r.score}%</div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: r.color + "20", color: r.color, marginTop: 4 }}>
                {labels[r.rating]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
