export default function RecordPaymentPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg, minHeight: "100vh", padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingTop: 36 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✕</div>
        <span style={{ fontSize: 18, fontWeight: 600, color: text }}>Registrar Pago</span>
        <div style={{ background: primary, color: "#fff", borderRadius: 20, padding: "8px 18px", fontWeight: 600, fontSize: 15 }}>Registrar</div>
      </div>

      {/* Member badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: primary + "12", border: `1px solid ${primary}30`, borderRadius: 12, padding: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: primary }}>J</div>
        <span style={{ fontSize: 15, fontWeight: 600, color: text }}>José López</span>
      </div>

      {/* Amount */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Monto</div>
        <div style={{ display: "flex", alignItems: "center", background: card, border: `1px solid ${primary}`, borderRadius: 12, padding: "12px 14px" }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: muted, marginRight: 4 }}>$</span>
          <span style={{ fontSize: 15, color: text, flex: 1 }}>500.00</span>
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Fecha de pago</div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px" }}>
          <span style={{ fontSize: 15, color: text }}>2025-12-15</span>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Notas <span style={{ textTransform: "none", fontWeight: 400 }}>(Opcional)</span></div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px", minHeight: 80, color: muted, fontSize: 15 }}>
          Pago en efectivo
        </div>
      </div>
    </div>
  );
}
