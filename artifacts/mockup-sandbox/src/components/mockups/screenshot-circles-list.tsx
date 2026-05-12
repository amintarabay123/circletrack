export default function ScreenshotCirclesList() {
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
  const amber = "#f0a500";

  const circles = [
    { name: "Tanda Navidad 2025", freq: "Mensual", active: true, cycle: 3, total: 12, amount: 500, members: 12, collected: 1500, pct: 25 },
    { name: "Tanda Familiar Pérez", freq: "Quincenal", active: true, cycle: 7, total: 10, amount: 250, members: 10, collected: 1750, pct: 70 },
    { name: "Tanda Amigos del Norte", freq: "Semanal", active: false, cycle: 8, total: 8, amount: 100, members: 8, collected: 800, pct: 100 },
    { name: "Tanda del Trabajo", freq: "Mensual", active: true, cycle: 1, total: 6, amount: 1000, members: 6, collected: 1000, pct: 17 },
    { name: "Tanda Vecinos Unidos", freq: "Mensual", active: true, cycle: 2, total: 8, amount: 300, members: 8, collected: 600, pct: 25 },
    { name: "Tanda Comunidad", freq: "Mensual", active: true, cycle: 4, total: 10, amount: 200, members: 10, collected: 800, pct: 40 },
    { name: "Tanda Las Comadres", freq: "Quincenal", active: true, cycle: 5, total: 12, amount: 400, members: 12, collected: 2000, pct: 42 },
    { name: "Tanda Emprendedores", freq: "Mensual", active: true, cycle: 2, total: 8, amount: 750, members: 8, collected: 1500, pct: 25 },
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
          Todas tus tandas<br />en un solo lugar
        </div>
        <div style={{ fontSize: Math.round(vw * 0.04), color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Controla cada círculo de ahorro fácilmente
        </div>
      </div>

      <div style={{
        width: phoneW, height: phoneH, zIndex: 1, overflow: "hidden",
        borderRadius: Math.round(phoneW * 0.1),
        boxShadow: `0 ${bw * 3}px ${bw * 10}px rgba(0,0,0,0.5)`,
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
            <div style={{ padding: "10px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Mis Tandas</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>8 tandas · 54 integrantes</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "12px 16px 16px" }}>
              {[["7 Activas", "rgba(255,255,255,0.18)"], ["$8,450 Cobrado", "rgba(240,165,0,0.3)"], ["54 Integrantes", "rgba(255,255,255,0.12)"]].map(([label, bg2], i) => (
                <div key={i} style={{ background: bg2, borderRadius: 18, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "hidden", padding: "10px 12px 0", background: bg }}>
            {circles.map((c, i) => (
              <div key={i} style={{ background: card, borderRadius: 16, padding: "12px 14px", marginBottom: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", border: `1px solid ${border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: text, letterSpacing: -0.2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>↻ {c.freq} · {c.members} integrantes</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.active ? success : muted, background: c.active ? success + "18" : "#f0f0f0", padding: "3px 8px", borderRadius: 18, marginLeft: 6, flexShrink: 0 }}>
                    {c.active ? "● Activa" : "Inactiva"}
                  </span>
                </div>
                <div style={{ height: 4, background: "#eef2ef", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg, ${primary}, #22c98a)`, borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: muted }}>Aportación</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: primary }}>${c.amount.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: muted }}>Turno</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{c.cycle}/{c.total}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: muted }}>Cobrado</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: success }}>${c.collected.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 28, paddingTop: 10, flexShrink: 0 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <svg width="24" height="20" viewBox="0 0 26 22" fill="none"><path d="M9 10C11.8 10 14 7.8 14 5C14 2.2 11.8 0 9 0C6.2 0 4 2.2 4 5C4 7.8 6.2 10 9 10Z" fill={primary}/><path d="M9 12C5.7 12 0 13.7 0 17V19H18V17C18 13.7 12.3 12 9 12Z" fill={primary}/><path d="M19 10C21 10 22.5 8.5 22.5 6.5C22.5 4.5 21 3 19 3C18.2 3 17.5 3.3 17 3.8C17.6 4.6 18 5.7 18 7C18 8 17.7 8.9 17.2 9.6C17.7 9.9 18.3 10 19 10Z" fill={primary} fillOpacity="0.5"/><path d="M19 12C17.9 12 16.9 12.2 16.1 12.6C17.4 13.6 18.3 15 18.3 17V19H26V17C26 13.7 22.3 12 19 12Z" fill={primary} fillOpacity="0.5"/></svg>
              <span style={{ fontSize: 9, fontWeight: 700, color: primary }}>Tandas</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={muted} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={muted} strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 9, color: muted }}>Ajustes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
