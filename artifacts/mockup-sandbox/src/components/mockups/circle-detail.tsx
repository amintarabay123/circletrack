export default function CircleDetailPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";
  const success = "#22b55a";
  const danger = "#e52222";

  const members = [
    { name: "María García", paid: true, late: false, due: 500, paid_amt: 500 },
    { name: "José López", paid: false, late: false, due: 500, paid_amt: 0 },
    { name: "Ana Martínez", paid: false, late: true, due: 500, paid_amt: 0 },
    { name: "Carlos Ruiz", paid: true, late: false, due: 500, paid_amt: 500 },
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ paddingTop: 56, paddingLeft: 16, paddingRight: 16, paddingBottom: 10, display: "flex", alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>‹</div>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: text }}>Tanda Navidad 2025</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 1 }}>Mensual · Turno 3 de 12</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: danger + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>🗑</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginLeft: 16, marginRight: 16 }}>
        <div style={{ padding: "10px 16px", borderBottom: `2px solid ${primary}`, color: primary, fontSize: 15, fontWeight: 500 }}>Resumen</div>
        <div style={{ padding: "10px 16px", color: muted, fontSize: 15 }}>Integrantes</div>
      </div>

      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, marginBottom: 4 }}>
          <div style={{ flex: 1, background: card, borderRadius: 12, padding: 14, border: `1px solid ${border}`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: primary }}>$6,000</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Bote del turno</div>
          </div>
          <div style={{ flex: 1, background: card, borderRadius: 12, padding: 14, border: `1px solid ${border}`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: success }}>75%</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Tasa de cobro</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
          {[["2", "Pagados", success], ["1", "Pendientes", muted], ["1", "Atrasados", danger]].map(([v, l, c], i) => (
            <div key={i} style={{ flex: 1, background: card, borderRadius: 12, padding: 14, border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Recipient */}
        <div style={{ display: "flex", alignItems: "center", background: primary + "10", borderRadius: 12, padding: 14, marginTop: 12, border: `1px solid ${primary}30` }}>
          <span style={{ fontSize: 20 }}>🎁</span>
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontSize: 12, color: muted }}>Recibe el bote</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: primary }}>María García</div>
          </div>
        </div>

        {/* Payment status */}
        <div style={{ fontSize: 14, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 20, marginBottom: 10 }}>Estado de pago</div>
        {members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: 12, marginBottom: 8, border: `1px solid ${border}`, gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: primary }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{m.name}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>${m.paid_amt} / ${m.due}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                color: m.paid ? success : m.late ? danger : muted,
                background: m.paid ? success + "20" : m.late ? danger + "20" : muted + "20"
              }}>
                {m.paid ? "Pagado" : m.late ? "Tarde" : "Pendiente"}
              </span>
              {!m.paid && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, background: primary, color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 8 }}>
                  + Registrar
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 20, left: 16, right: 16, display: "flex", justifyContent: "center" }}>
        <div style={{ background: primary, color: "#fff", borderRadius: 30, padding: "14px 28px", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          👤+ Agregar Integrante
        </div>
      </div>
    </div>
  );
}
