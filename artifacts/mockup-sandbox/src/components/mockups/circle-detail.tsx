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
    <div style={{
      width: "100vw", height: "100vh",
      background: "linear-gradient(145deg, #0a2235 0%, #0e2a38 45%, #141c3a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 60, position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.18) 0%, transparent 65%)", top: "-10%", right: "-12%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.12) 0%, transparent 65%)", bottom: "0%", left: "-10%", pointerEvents: "none" }} />

      {/* Headline */}
      <div style={{ textAlign: "center", color: "#fff", zIndex: 1 }}>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, marginBottom: 18 }}>
          Sabe quién pagó<br />y quién falta
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Panel en tiempo real para cada turno
        </div>
      </div>

      {/* Phone */}
      <div style={{
        width: 720, background: bg, borderRadius: 90, overflow: "hidden", zIndex: 1,
        boxShadow: "0 80px 200px rgba(0,0,0,0.7), 0 0 0 18px #1e2a3a, 0 0 0 22px #243040",
      }}>
        {/* Status bar */}
        <div style={{ background: bg, padding: "32px 44px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <svg width="32" height="22" viewBox="0 0 14 10"><rect x="0" y="3" width="3" height="7" rx="1" fill={text} opacity="0.4"/><rect x="4" y="2" width="3" height="8" rx="1" fill={text} opacity="0.6"/><rect x="8" y="0" width="3" height="10" rx="1" fill={text}/></svg>
            <svg width="32" height="22" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "8px 36px 8px", display: "flex", alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: text, flexShrink: 0 }}>‹</div>
          <div style={{ flex: 1, marginLeft: 20 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: text }}>Tanda Navidad 2025</div>
            <div style={{ fontSize: 20, color: muted }}>Mensual · Turno 3 de 12</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `2px solid ${border}`, marginLeft: 36, marginRight: 36 }}>
          <div style={{ padding: "16px 28px", borderBottom: `3px solid ${primary}`, color: primary, fontSize: 26, fontWeight: 600 }}>Resumen</div>
          <div style={{ padding: "16px 28px", color: muted, fontSize: 26 }}>Integrantes</div>
        </div>

        <div style={{ padding: "20px 36px" }}>
          {/* Stats row 1 */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, background: card, borderRadius: 22, padding: "22px 26px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: primary }}>$6,000</div>
              <div style={{ fontSize: 18, color: muted, marginTop: 4 }}>Bote del turno</div>
            </div>
            <div style={{ flex: 1, background: card, borderRadius: 22, padding: "22px 26px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: success }}>75%</div>
              <div style={{ fontSize: 18, color: muted, marginTop: 4 }}>Tasa de cobro</div>
            </div>
          </div>

          {/* Stats row 2 */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[["2", "Pagados", success], ["1", "Pendientes", muted], ["1", "Atrasados", danger]].map(([v, l, c], i) => (
              <div key={i} style={{ flex: 1, background: card, borderRadius: 22, padding: "18px 20px", border: `1px solid ${border}`, textAlign: "center" }}>
                <div style={{ fontSize: 38, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 18, color: muted, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Recipient */}
          <div style={{ display: "flex", alignItems: "center", background: primary + "12", borderRadius: 22, padding: "18px 24px", marginBottom: 20, border: `1px solid ${primary}28` }}>
            <span style={{ fontSize: 30, marginRight: 16 }}>🎁</span>
            <div>
              <div style={{ fontSize: 18, color: muted }}>Recibe el bote</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: primary }}>María García</div>
            </div>
          </div>

          {/* Section label */}
          <div style={{ fontSize: 20, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>Estado de pago</div>

          {/* Member rows */}
          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 22, padding: "18px 22px", marginBottom: 14, border: `1px solid ${border}`, gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: primary, flexShrink: 0 }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: text }}>{m.name}</div>
                <div style={{ fontSize: 20, color: muted, marginTop: 2 }}>${m.paid_amt} / ${m.due}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 18, fontWeight: 700, padding: "5px 14px", borderRadius: 40, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success + "18" : m.late ? danger + "18" : muted + "18" }}>
                  {m.paid ? "Pagado" : m.late ? "Tarde" : "Pendiente"}
                </span>
                {!m.paid && (
                  <div style={{ background: primary, color: "#fff", fontSize: 18, fontWeight: 700, padding: "6px 16px", borderRadius: 12 }}>+ Registrar</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAB */}
        <div style={{ padding: "0 36px 44px" }}>
          <div style={{ background: primary, color: "#fff", borderRadius: 50, padding: "22px 0", fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            👤+ Agregar Integrante
          </div>
        </div>
      </div>
    </div>
  );
}
