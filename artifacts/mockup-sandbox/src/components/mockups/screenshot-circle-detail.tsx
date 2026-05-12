export default function ScreenshotCircleDetail() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1284;
  const vh = typeof window !== "undefined" ? window.innerHeight : 2778;

  const phoneW = Math.round(vw * 0.72);
  const phoneH = Math.round(phoneW * (926 / 428));
  const scale = phoneW / 428;

  const primary = "#18a574";
  const bg = "#f0f4f0";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const success = "#18a574";
  const danger = "#e53535";
  const amber = "#f0a500";

  const avatarColors = ["#18a574","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#10b981","#f97316","#6366f1","#84cc16","#14b8a6"];

  const members = [
    { name: "María García", paid: true, late: false, due: 500, paid_amt: 500, turn: 1, initials: "MG" },
    { name: "José López", paid: false, late: false, due: 500, paid_amt: 0, turn: 2, initials: "JL" },
    { name: "Ana Martínez", paid: false, late: true, due: 500, paid_amt: 0, turn: 3, initials: "AM" },
    { name: "Carlos Ruiz", paid: true, late: false, due: 500, paid_amt: 500, turn: 4, initials: "CR" },
    { name: "Laura Torres", paid: true, late: false, due: 500, paid_amt: 500, turn: 5, initials: "LT" },
    { name: "Pedro Sánchez", paid: false, late: false, due: 500, paid_amt: 0, turn: 6, initials: "PS" },
    { name: "Rosa Herrera", paid: true, late: false, due: 500, paid_amt: 500, turn: 7, initials: "RH" },
    { name: "Miguel Ángel", paid: false, late: true, due: 500, paid_amt: 0, turn: 8, initials: "MÁ" },
    { name: "Sofía Ramírez", paid: true, late: false, due: 500, paid_amt: 500, turn: 9, initials: "SR" },
    { name: "Diego Morales", paid: false, late: false, due: 500, paid_amt: 0, turn: 10, initials: "DM" },
    { name: "Valentina Cruz", paid: true, late: false, due: 500, paid_amt: 500, turn: 11, initials: "VC" },
    { name: "Andrés Jiménez", paid: false, late: false, due: 500, paid_amt: 0, turn: 12, initials: "AJ" },
  ];

  const bw = Math.round(phoneW * 0.018);

  return (
    <div style={{
      width: vw, height: vh,
      background: "linear-gradient(145deg, #0a2235 0%, #0e2a38 45%, #141c3a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      gap: Math.round(vh * 0.035), position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: vw * 1.2, height: vw * 1.2, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.16) 0%, transparent 65%)", top: "-20%", right: "-20%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: vw * 0.9, height: vw * 0.9, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.1) 0%, transparent 65%)", bottom: "0%", left: "-15%", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", color: "#fff", zIndex: 1, padding: `0 ${Math.round(vw * 0.08)}px` }}>
        <div style={{ fontSize: Math.round(vw * 0.092), fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, marginBottom: Math.round(vh * 0.01) }}>
          Sabe quién pagó<br />y quién falta
        </div>
        <div style={{ fontSize: Math.round(vw * 0.04), color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Panel en tiempo real para cada turno
        </div>
      </div>

      <div style={{
        width: phoneW, height: phoneH, zIndex: 1, overflow: "hidden",
        borderRadius: Math.round(phoneW * 0.1),
        boxShadow: `0 ${bw * 3}px ${bw * 10}px rgba(0,0,0,0.7), 0 0 0 ${bw}px #1e2a3a, 0 0 0 ${Math.round(bw * 1.4)}px #243040`,
      }}>
        <div style={{
          width: 428, height: 926,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ background: "linear-gradient(160deg, #0d7a55 0%, #18a574 55%, #22c98a 100%)", flexShrink: 0 }}>
            <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", zIndex: 2 }}>9:41</span>
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 120, height: 34, background: "#000", borderRadius: 20, zIndex: 2 }} />
              <div style={{ display: "flex", gap: 5, alignItems: "center", zIndex: 2 }}>
                <svg width="15" height="11" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="white"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="white"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
                <svg width="14" height="11" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.2L15.5 4C13.6 2 11 1 8 1C5 1 2.4 2 0.5 4L1.7 5.2C3.3 3.5 5.5 2.5 8 2.5Z" fill="white"/><path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.5 6.1C12.1 4.8 10.2 4 8 4C5.8 4 3.9 4.8 2.5 6.1L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill="white"/><path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.5L8 12L5.5 9.5C6.1 8.9 7 8.5 8 8.5Z" fill="white"/></svg>
                <svg width="22" height="11" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.5"/></svg>
              </div>
            </div>
            <div style={{ padding: "8px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="9" height="14" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Tanda Navidad 2025</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Mensual · Turno 3 de 12</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "12px 14px 16px" }}>
              {[["$6,000", "Bote del turno"], ["75%", "Tasa de cobro"], ["Turno 3", "de 12"]].map(([v, l], i) => (
                <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.18)", borderRadius: 14, padding: "11px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: "10px 12px 0", background: card, borderRadius: 14, padding: "11px 14px", border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: "linear-gradient(135deg, #0d7a55, #22c98a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: muted }}>Recibe el bote este turno</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: primary }}>María García — Turno 1</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: muted }}>Fecha</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: text }}>15 ene</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, margin: "8px 12px", flexShrink: 0 }}>
            {([["7", "Pagados", success + "22", success], ["3", "Pendientes", muted + "22", muted], ["2", "Atrasados", danger + "18", danger]] as [string,string,string,string][]).map(([v, l, bg2, c], i) => (
              <div key={i} style={{ flex: 1, background: bg2, borderRadius: 12, padding: "10px 8px", textAlign: "center", border: `1px solid ${c}30` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: c, marginTop: 1, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ margin: "0 12px 8px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: muted }}>Progreso del turno</span>
              <span style={{ fontSize: 11, color: muted }}>25%</span>
            </div>
            <div style={{ height: 5, background: "#deeee8", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "25%", height: "100%", background: "linear-gradient(90deg, #0d7a55, #22c98a)", borderRadius: 3 }} />
            </div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.7px", padding: "0 12px", marginBottom: 6, flexShrink: 0 }}>Estado de pago</div>

          <div style={{ flex: 1, overflowY: "hidden", padding: "0 12px" }}>
            {members.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", background: card, borderRadius: 12, padding: "9px 12px", marginBottom: 6, border: `1px solid ${border}`, gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: avatarColors[i % avatarColors.length] + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: avatarColors[i % avatarColors.length], flexShrink: 0 }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: muted }}>Turno {m.turn} · ${m.paid_amt}/${m.due}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 18, color: m.paid ? success : m.late ? danger : amber, background: m.paid ? success + "18" : m.late ? danger + "15" : amber + "20", flexShrink: 0 }}>
                  {m.paid ? "✓ Pagado" : m.late ? "Tarde" : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
