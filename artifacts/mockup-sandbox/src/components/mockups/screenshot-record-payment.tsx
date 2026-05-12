export default function ScreenshotRecordPayment() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#e2e6ef";
  const muted = "#636e82";
  const text = "#141c2e";

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "rgba(0,0,0,0.45)", overflow: "hidden",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Dimmed background — simulates app behind the modal */}
      <div style={{ position: "absolute", inset: 0, background: bg, zIndex: 0 }}>
        {/* iOS Status Bar */}
        <div style={{ background: bg, padding: "14px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: text }}>9:41</span>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 126, height: 34, background: "#000", borderRadius: 20 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill={text}/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={text}/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={text}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={text}/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={text} strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill={text}/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill={text} fillOpacity="0.4"/></svg>
          </div>
        </div>
        {/* Background content hint */}
        <div style={{ padding: "20px 20px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: text, opacity: 0.3 }}>Tanda Navidad 2025</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {["$6,000", "75%", "3"].map((v, i) => (
              <div key={i} style={{ flex: 1, background: card, borderRadius: 14, padding: "14px", opacity: 0.3, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1 }} />

      {/* Modal Sheet */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2,
        background: card, borderRadius: "24px 24px 0 0",
        padding: "20px 20px 44px",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#d1d5e0", borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 4 }}>Registrar Pago</div>
        <div style={{ fontSize: 14, color: muted, marginBottom: 24 }}>José López · Turno 2</div>

        {/* Amount field */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 6 }}>Monto</div>
          <div style={{ background: bg, borderRadius: 12, padding: "14px 16px", border: `1.5px solid ${primary}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, color: text }}>$500.00</span>
            <span style={{ fontSize: 14, color: muted }}>MXN</span>
          </div>
        </div>

        {/* Date field */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 6 }}>Fecha de pago</div>
          <div style={{ background: bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, color: text }}>12 de mayo, 2026</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="12" rx="2" stroke={muted} strokeWidth="1.5"/><path d="M5 1V4M11 1V4M1 7H15" stroke={muted} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Notes field */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 6 }}>Notas (opcional)</div>
          <div style={{ background: bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${border}`, height: 60 }}>
            <span style={{ fontSize: 17, color: muted + "80" }}>Agregar notas...</span>
          </div>
        </div>

        {/* Confirm button */}
        <div style={{ background: primary, borderRadius: 14, padding: "16px", textAlign: "center" }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#fff" }}>Confirmar Pago</span>
        </div>
      </div>
    </div>
  );
}
