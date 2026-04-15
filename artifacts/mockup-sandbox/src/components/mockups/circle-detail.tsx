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
      flexDirection: "column", gap: 32, position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.2) 0%, transparent 65%)", top: "-5%", right: "-8%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.13) 0%, transparent 65%)", bottom: "5%", left: "-6%", pointerEvents: "none" }} />

      {/* Headline */}
      <div style={{ textAlign: "center", color: "#fff", zIndex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 8 }}>
          Sabe quién pagó<br />y quién falta
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Panel en tiempo real para cada turno
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
            <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/><rect x="19" y="3" width="2" height="4" rx="1" fill={text} opacity="0.4"/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "4px 14px 4px", display: "flex", alignItems: "center" }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: text }}>‹</div>
          <div style={{ flex: 1, marginLeft: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>Tanda Navidad 2025</div>
            <div style={{ fontSize: 10, color: muted }}>Mensual · Turno 3 de 12</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginLeft: 14, marginRight: 14 }}>
          <div style={{ padding: "7px 14px", borderBottom: `2px solid ${primary}`, color: primary, fontSize: 12, fontWeight: 600 }}>Resumen</div>
          <div style={{ padding: "7px 14px", color: muted, fontSize: 12 }}>Integrantes</div>
        </div>

        <div style={{ padding: "10px 14px" }}>
          {/* Stats row 1 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, background: card, borderRadius: 11, padding: "10px 12px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: primary }}>$6,000</div>
              <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>Bote del turno</div>
            </div>
            <div style={{ flex: 1, background: card, borderRadius: 11, padding: "10px 12px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: success }}>75%</div>
              <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>Tasa de cobro</div>
            </div>
          </div>

          {/* Stats row 2 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {[["2", "Pagados", success], ["1", "Pendientes", muted], ["1", "Atrasados", danger]].map(([v, l, c], i) => (
              <div key={i} style={{ flex: 1, background: card, borderRadius: 11, padding: "8px 10px", border: `1px solid ${border}`, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 9, color: muted, marginTop: 1 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Recipient */}
          <div style={{ display: "flex", alignItems: "center", background: primary + "12", borderRadius: 10, padding: "9px 11px", marginBottom: 10, border: `1px solid ${primary}28` }}>
            <span style={{ fontSize: 14, marginRight: 8 }}>🎁</span>
            <div>
              <div style={{ fontSize: 9, color: muted }}>Recibe el bote</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: primary }}>María García</div>
            </div>
          </div>

          {/* Member rows */}
          <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Estado de pago</div>
          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 10, padding: "9px 10px", marginBottom: 7, border: `1px solid ${border}`, gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: primary, flexShrink: 0 }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                <div style={{ fontSize: 10, color: muted }}>${m.paid_amt} / ${m.due}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success + "18" : m.late ? danger + "18" : muted + "18" }}>
                  {m.paid ? "Pagado" : m.late ? "Tarde" : "Pendiente"}
                </span>
                {!m.paid && (
                  <div style={{ background: primary, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 6 }}>+ Registrar</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAB */}
        <div style={{ padding: "0 14px 18px" }}>
          <div style={{ background: primary, color: "#fff", borderRadius: 24, padding: "11px 0", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            👤+ Agregar Integrante
          </div>
        </div>
      </div>
    </div>
  );
}
