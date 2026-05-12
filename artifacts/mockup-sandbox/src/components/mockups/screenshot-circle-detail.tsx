export default function ScreenshotCircleDetail() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#e2e6ef";
  const muted = "#636e82";
  const text = "#141c2e";
  const success = "#22b55a";
  const danger = "#e52222";

  const members = [
    { name: "María García", paid: true, late: false, due: 500, paid_amt: 500, turn: 1 },
    { name: "José López", paid: false, late: false, due: 500, paid_amt: 0, turn: 2 },
    { name: "Ana Martínez", paid: false, late: true, due: 500, paid_amt: 0, turn: 3 },
    { name: "Carlos Ruiz", paid: true, late: false, due: 500, paid_amt: 500, turn: 4 },
    { name: "Laura Torres", paid: true, late: false, due: 500, paid_amt: 500, turn: 5 },
    { name: "Pedro Sánchez", paid: false, late: false, due: 500, paid_amt: 0, turn: 6 },
    { name: "Rosa Herrera", paid: true, late: false, due: 500, paid_amt: 500, turn: 7 },
    { name: "Miguel Ángel", paid: false, late: true, due: 500, paid_amt: 0, turn: 8 },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh", background: bg, overflow: "hidden",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* iOS Status Bar */}
      <div style={{ background: bg, padding: "14px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, position: "relative" }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: text, letterSpacing: -0.3 }}>9:41</span>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 126, height: 34, background: "#000", borderRadius: 20 }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="1" fill={text}/>
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={text}/>
            <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={text}/>
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill={text}/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.2L15.5 4C13.6 2 11 1 8 1C5 1 2.4 2 0.5 4L1.7 5.2C3.3 3.5 5.5 2.5 8 2.5Z" fill={text}/>
            <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.5 6.1C12.1 4.8 10.2 4 8 4C5.8 4 3.9 4.8 2.5 6.1L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill={text}/>
            <path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.5L8 12L5.5 9.5C6.1 8.9 7 8.5 8 8.5Z" fill={text}/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={text} strokeOpacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill={text}/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill={text} fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: bg, padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: "#eff1f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke={text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, color: text, letterSpacing: -0.3 }}>Tanda Navidad 2025</div>
          <div style={{ fontSize: 13, color: muted }}>Mensual · Turno 3 de 12</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: bg, display: "flex", borderBottom: `1px solid ${border}`, paddingLeft: 20, flexShrink: 0 }}>
        <div style={{ paddingBottom: 10, paddingTop: 8, paddingLeft: 4, paddingRight: 18, borderBottom: `2px solid ${primary}`, color: primary, fontSize: 15, fontWeight: 600 }}>Resumen</div>
        <div style={{ paddingBottom: 10, paddingTop: 8, paddingLeft: 18, paddingRight: 18, color: muted, fontSize: 15 }}>Integrantes</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "hidden", padding: "14px 16px" }}>
        {/* Stats row 1 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, background: card, borderRadius: 14, padding: "16px", border: `1px solid ${border}`, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: primary }}>$6,000</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>Bote del turno</div>
          </div>
          <div style={{ flex: 1, background: card, borderRadius: 14, padding: "16px", border: `1px solid ${border}`, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: success }}>75%</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>Tasa de cobro</div>
          </div>
        </div>

        {/* Stats row 2 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {([["5", "Pagados", success], ["2", "Pendientes", muted], ["1", "Atrasados", danger]] as [string,string,string][]).map(([v, l, c], i) => (
            <div key={i} style={{ flex: 1, background: card, borderRadius: 14, padding: "14px 10px", border: `1px solid ${border}`, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background: card, borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Progreso del turno</span>
            <span style={{ fontSize: 13, color: muted }}>Turno 3 de 12</span>
          </div>
          <div style={{ height: 8, background: "#eff1f5", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: "25%", height: "100%", background: primary, borderRadius: 4 }} />
          </div>
        </div>

        {/* Recipient */}
        <div style={{ background: primary + "12", borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: `1px solid ${primary}22`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎁</span>
          <div>
            <div style={{ fontSize: 12, color: muted }}>Recibe el bote este turno</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: primary }}>María García — Turno 1</div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Estado de pago</div>

        {members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: `1px solid ${border}`, gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: primary, flexShrink: 0 }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{m.name}</div>
              <div style={{ fontSize: 12, color: muted }}>Turno {m.turn} · ${m.paid_amt}/${m.due}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, color: m.paid ? success : m.late ? danger : muted, background: m.paid ? success + "15" : m.late ? danger + "15" : muted + "15", flexShrink: 0 }}>
              {m.paid ? "Pagado" : m.late ? "Tarde" : "Pendiente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
