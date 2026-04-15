export default function CirclesListEnPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";

  const circles = [
    { name: "Christmas Circle 2025", freq: "Monthly", active: true, cycle: 3, total: 12, amount: 500 },
    { name: "Family Circle", freq: "Biweekly", active: true, cycle: 7, total: 10, amount: 250 },
    { name: "Friends Circle", freq: "Weekly", active: false, cycle: 8, total: 8, amount: 100 },
    { name: "Work Circle", freq: "Monthly", active: true, cycle: 1, total: 6, amount: 1000 },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "linear-gradient(145deg, #0a2235 0%, #0e2a38 45%, #141c3a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 64, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.18) 0%, transparent 65%)", top: "-15%", right: "-15%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(24,165,116,0.12) 0%, transparent 65%)", bottom: "0%", left: "-12%", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", color: "#fff", zIndex: 1 }}>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, marginBottom: 18 }}>
          All your circles<br />in one place
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
          Manage every savings circle with ease
        </div>
      </div>

      <div style={{
        width: 720, background: bg, borderRadius: 90, overflow: "hidden", zIndex: 1,
        boxShadow: "0 80px 200px rgba(0,0,0,0.7), 0 0 0 18px #1e2a3a, 0 0 0 22px #243040",
      }}>
        <div style={{ background: bg, padding: "32px 44px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <svg width="32" height="22" viewBox="0 0 14 10"><rect x="0" y="3" width="3" height="7" rx="1" fill={text} opacity="0.4"/><rect x="4" y="2" width="3" height="8" rx="1" fill={text} opacity="0.6"/><rect x="8" y="0" width="3" height="10" rx="1" fill={text}/><rect x="12" y="1" width="2" height="8" rx="1" fill={text} opacity="0.3"/></svg>
            <svg width="32" height="22" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" stroke={text} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="13" height="5" rx="1" fill={primary}/><rect x="19" y="3" width="2" height="4" rx="1" fill={text} opacity="0.4"/></svg>
          </div>
        </div>

        <div style={{ padding: "14px 44px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: text }}>My Circles</span>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44, lineHeight: 1 }}>+</div>
        </div>

        <div style={{ padding: "8px 36px 36px" }}>
          {circles.map((c, i) => (
            <div key={i} style={{ background: card, borderRadius: 28, padding: "26px 30px", marginBottom: 20, border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 30, fontWeight: 600, color: text }}>{c.name}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: c.active ? primary : muted, background: c.active ? primary + "18" : "#eff1f5", padding: "6px 18px", borderRadius: 40 }}>
                  {c.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <span style={{ fontSize: 22, color: muted }}>↻ {c.freq}</span>
                <span style={{ fontSize: 22, color: muted }}>Cycle {c.cycle}/{c.total}</span>
              </div>
              <div style={{ height: 1, background: border, margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: primary }}>${c.amount.toLocaleString()}</span>
                <span style={{ fontSize: 22, color: muted }}>Cycle {c.cycle} of {c.total} ›</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 40 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, gap: 6 }}>
            <svg width="48" height="40" viewBox="0 0 22 18" fill="none"><path d="M8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8ZM8 10C5.3 10 0 11.3 0 14V16H16V14C16 11.3 10.7 10 8 10Z" fill={primary}/><path d="M15 8C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2C14.3 2 13.7 2.2 13.2 2.6C13.7 3.3 14 4.1 14 5C14 5.9 13.7 6.7 13.2 7.4C13.7 7.8 14.3 8 15 8ZM15 10C14 10 13.1 10.2 12.3 10.5C13.3 11.4 14 12.6 14 14V16H22V14C22 11.3 17.7 10 15 10Z" fill={primary} opacity="0.6"/></svg>
            <span style={{ fontSize: 20, fontWeight: 700, color: primary }}>Circles</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, gap: 6 }}>
            <svg width="44" height="44" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill={muted}/></svg>
            <span style={{ fontSize: 20, color: muted }}>Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
