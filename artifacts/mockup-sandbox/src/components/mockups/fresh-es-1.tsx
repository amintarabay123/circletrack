export default function FreshEs1() {
  const primary = "#18a574";
  const bg = "#f0f4f1";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const circles = [
    { name: "Tanda Navidad 2025", freq: "Mensual", active: true, cycle: 3, total: 12, amount: 500, members: 12, pct: 25 },
    { name: "Tanda Familiar Pérez", freq: "Quincenal", active: true, cycle: 7, total: 10, amount: 250, members: 10, pct: 70 },
    { name: "Tanda Amigos del Norte", freq: "Semanal", active: false, cycle: 8, total: 8, amount: 100, members: 8, pct: 100 },
    { name: "Tanda del Trabajo", freq: "Mensual", active: true, cycle: 1, total: 6, amount: 1000, members: 6, pct: 17 },
    { name: "Tanda Vecinos Unidos", freq: "Mensual", active: true, cycle: 2, total: 8, amount: 300, members: 8, pct: 25 },
    { name: "Tanda Comunidad", freq: "Mensual", active: true, cycle: 4, total: 10, amount: 200, members: 10, pct: 40 },
    { name: "Tanda Las Comadres", freq: "Quincenal", active: true, cycle: 5, total: 12, amount: 400, members: 12, pct: 42 },
  ];
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: bg, fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(160deg,#0d7a55 0%,#18a574 55%,#22c98a 100%)", flexShrink: 0, paddingBottom: 16 }}>
        <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>9:41</span>
          <div style={{ width: 126, height: 36, background: "#000", borderRadius: 20 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="white"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="white"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
            <svg width="23" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.5"/></svg>
          </div>
        </div>
        <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Mis Tandas</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>7 tandas · 54 integrantes</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "12px 18px 0" }}>
          {[["6 Activas","rgba(255,255,255,0.18)"],["$8,450 Cobrado","rgba(240,165,0,0.3)"],["54 Integrantes","rgba(255,255,255,0.12)"]].map(([label,bg2],i)=>(
            <div key={i} style={{ background: bg2, borderRadius: 18, padding: "5px 11px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "hidden", padding: "12px 14px 0", background: bg }}>
        {circles.map((c,i)=>(
          <div key={i} style={{ background: card, borderRadius: 16, padding: "13px 15px", marginBottom: 9, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", border: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 7 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: text, letterSpacing: -0.2 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>↻ {c.freq} · {c.members} integrantes</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.active ? primary : muted, background: c.active ? primary+"18" : "#f0f0f0", padding: "3px 9px", borderRadius: 18, marginLeft: 7, flexShrink: 0 }}>
                {c.active ? "● Activa" : "Inactiva"}
              </span>
            </div>
            <div style={{ height: 4, background: "#eef2ef", borderRadius: 2, marginBottom: 9, overflow: "hidden" }}>
              <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg,${primary},#22c98a)`, borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 11, color: muted }}>Aportación</div><div style={{ fontSize: 18, fontWeight: 800, color: primary }}>${c.amount.toLocaleString()}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: muted }}>Turno</div><div style={{ fontSize: 15, fontWeight: 700, color: text }}>{c.cycle}/{c.total}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: muted }}>% Completado</div><div style={{ fontSize: 15, fontWeight: 700, color: primary }}>{c.pct}%</div></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 34, paddingTop: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <svg width="24" height="20" viewBox="0 0 26 22" fill="none"><path d="M9 10C11.8 10 14 7.8 14 5C14 2.2 11.8 0 9 0C6.2 0 4 2.2 4 5C4 7.8 6.2 10 9 10Z" fill={primary}/><path d="M9 12C5.7 12 0 13.7 0 17V19H18V17C18 13.7 12.3 12 9 12Z" fill={primary}/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: primary }}>Tandas</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={muted} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={muted} strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 10, color: muted }}>Ajustes</span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(4,18,10,0.93) 0%,rgba(4,18,10,0.75) 50%,transparent 100%)", padding: "110px 32px 52px", textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>Todas tus tandas<br/>en un solo lugar</div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", marginTop: 10, fontWeight: 500 }}>Controla cada círculo de ahorro fácilmente</div>
      </div>
    </div>
  );
}
