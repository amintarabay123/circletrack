export default function IPadScreenshot2() {
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
    { name: "Laura Torres", paid: true, late: false, due: 500, paid_amt: 500 },
    { name: "Pedro Sánchez", paid: false, late: false, due: 500, paid_amt: 0 },
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
          Sabe quién pagó<br />y quién falta
        </div>
        <div style={{ fontSize: 52, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Panel en tiempo real para cada turno
        </div>
      </div>

      {/* iPad frame */}
      <div style={{
        width: 1500, background: bg, borderRadius: 40, overflow: "hidden", zIndex: 1,
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
      }}>
        {/* Status bar */}
        <div style={{ background: bg, padding: "36px 60px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <svg width="44" height="30" viewBox="0 0 14 10"><rect x="0" y="3" width="3" height="7" rx="1" fill={text} opacity="0.4"/><rect x="4" y="2" width="3" height="8" rx="1" fill={text} opacity="0.6"/><rect x="8" y="0" width="3" height="10" rx="1" fill={text}/></svg>
            <svg width="44" height="30" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "10px 48px 10px", display: "flex", alignItems: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, color: text }}>‹</div>
          <div style={{ flex: 1, marginLeft: 24 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: text }}>Tanda Navidad 2025</div>
            <div style={{ fontSize: 28, color: muted }}>Mensual · Turno 3 de 12</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `2px solid ${border}`, marginLeft: 48, marginRight: 48 }}>
          <div style={{ padding: "20px 36px", borderBottom: `4px solid ${primary}`, color: primary, fontSize: 34, fontWeight: 600 }}>Resumen</div>
          <div style={{ padding: "20px 36px", color: muted, fontSize: 34 }}>Integrantes</div>
        </div>

        <div style={{ padding: "24px 48px" }}>
          {/* Stats row 1 */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1, background: card, borderRadius: 28, padding: "28px 32px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 54, fontWeight: 700, color: primary }}>$6,000</div>
              <div style={{ fontSize: 24, color: muted, marginTop: 6 }}>Bote del turno</div>
            </div>
            <div style={{ flex: 1, background: card, borderRadius: 28, padding: "28px 32px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 54, fontWeight: 700, color: success }}>75%</div>
              <div style={{ fontSize: 24, color: muted, marginTop: 6 }}>Tasa de cobro</div>
            </div>
          </div>

          {/* Stats row 2 */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            {([["3", "Pagados", success], ["2", "Pendientes", muted], ["1", "Atrasados", danger]] as [string, string, string][]).map(([v, l, c], i) => (
              <div key={i} style={{ flex: 1, background: card, borderRadius: 28, padding: "22px 24px", border: `1px solid ${border}`, textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 24, color: muted, marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Recipient */}
          <div style={{ display: "flex", alignItems: "center", background: primary + "12", borderRadius: 28, padding: "24px 32px", marginBottom: 24, border: `1px solid ${primary}28` }}>
            <span style={{ fontSize: 40, marginRight: 20 }}>🎁</span>
            <div>
              <div style={{ fontSize: 24, color: muted }}>Recibe el bote</div>
              <div style={{ fontSize: 36, fontWeight: 600, color: primary }}>María García</div>
            </div>
          </div>

          <div style={{ fontSize: 26, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Estado de pago</div>

          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 28, padding: "22px 28px", marginBottom: 16, border: `1px solid ${border}`, gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, color: primary, flexShrink: 0 }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 600, color: text }}>{m.name}</div>
                <div style={{ fontSize: 26, color: muted, marginTop: 4 }}>${m.paid_amt} / ${m.due}</div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, padding: "8px 20px", borderRadius: 40, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success + "18" : m.late ? danger + "18" : muted + "18", flexShrink: 0 }}>
                {m.paid ? "Pagado" : m.late ? "Tarde" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
