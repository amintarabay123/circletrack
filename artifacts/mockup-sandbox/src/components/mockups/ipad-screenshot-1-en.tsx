export default function IPadScreenshot1En() {
  const primary = "#18a574";
  const bg = "#f0f4f0";
  const card = "#ffffff";
  const border = "#e2e8e4";
  const muted = "#6b7c74";
  const text = "#0f1f18";
  const success = "#18a574";

  const W = 2064;
  const H = 2752;
  const scale = W / 1024;
  const innerH = Math.ceil(H / scale);

  const circles = [
    { name: "Christmas Tanda 2025", freq: "Monthly", active: true, cycle: 3, total: 12, amount: 500, members: 12, collected: 1500, pct: 25 },
    { name: "Family Circle", freq: "Biweekly", active: true, cycle: 7, total: 10, amount: 250, members: 10, collected: 1750, pct: 70 },
    { name: "Friends Savings Group", freq: "Weekly", active: false, cycle: 8, total: 8, amount: 100, members: 8, collected: 800, pct: 100 },
    { name: "Work Tanda", freq: "Monthly", active: true, cycle: 1, total: 6, amount: 1000, members: 6, collected: 1000, pct: 17 },
    { name: "Neighborhood Circle", freq: "Monthly", active: true, cycle: 2, total: 8, amount: 300, members: 8, collected: 600, pct: 25 },
    { name: "Community Savings", freq: "Monthly", active: true, cycle: 4, total: 10, amount: 200, members: 10, collected: 800, pct: 40 },
    { name: "Ladies Group", freq: "Biweekly", active: true, cycle: 5, total: 12, amount: 400, members: 12, collected: 2000, pct: 42 },
    { name: "Entrepreneurs Circle", freq: "Monthly", active: true, cycle: 2, total: 8, amount: 750, members: 8, collected: 1500, pct: 25 },
  ];

  const avatarColors = ["#18a574","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#10b981"];

  return (
    <div style={{ width: W, height: H, overflow: "hidden", position: "relative", background: bg }}>
      <div style={{
        width: 1024, height: innerH,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ background: bg, padding: "20px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: text }}>9:41</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <svg width="18" height="13" viewBox="0 0 17 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill={text} opacity="0.4"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={text} opacity="0.6"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={text} opacity="0.8"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={text}/></svg>
            <svg width="18" height="13" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.2L15.5 4C13.6 2 11 1 8 1C5 1 2.4 2 0.5 4L1.7 5.2C3.3 3.5 5.5 2.5 8 2.5Z" fill={text}/><path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.5 6.1C12.1 4.8 10.2 4 8 4C5.8 4 3.9 4.8 2.5 6.1L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill={text}/><path d="M8 8.5C9 8.5 9.9 8.9 10.5 9.5L8 12L5.5 9.5C6.1 8.9 7 8.5 8 8.5Z" fill={text}/></svg>
            <svg width="28" height="13" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={text} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="2" fill={primary}/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill={text} fillOpacity="0.4"/></svg>
          </div>
        </div>

        <div style={{ background: "linear-gradient(160deg, #0d7a55 0%, #18a574 55%, #22c98a 100%)", padding: "18px 32px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>My Circles</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>8 active circles · 54 members</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2V18M2 10H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {([["7 Active", "rgba(255,255,255,0.18)"], ["$8,450 Collected", "rgba(240,165,0,0.35)"], ["54 Members", "rgba(255,255,255,0.12)"], ["Turn 3 active", "rgba(255,255,255,0.12)"]] as [string,string][]).map(([label, bg2], i) => (
              <div key={i} style={{ background: bg2, borderRadius: 20, padding: "6px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "hidden", padding: "14px 24px 0", background: bg, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignContent: "start" }}>
          {circles.map((c, i) => (
            <div key={i} style={{ background: card, borderRadius: 20, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: avatarColors[i % avatarColors.length] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: avatarColors[i % avatarColors.length] }}>
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: text, letterSpacing: -0.2 }}>{c.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: muted }}>↻ {c.freq} · {c.members} members</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.active ? success : muted, background: c.active ? success + "18" : "#f0f0f0", padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>
                  {c.active ? "● Active" : "Inactive"}
                </span>
              </div>
              <div style={{ height: 5, background: "#eef2ef", borderRadius: 3, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg, ${primary}, #22c98a)`, borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, color: muted }}>Contribution</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: primary }}>${c.amount.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: muted }}>Turn</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: text }}>{c.cycle}/{c.total}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: muted }}>Collected</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: success }}>${c.collected.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: card, borderTop: `1px solid ${border}`, display: "flex", paddingBottom: 20, paddingTop: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none"><path d="M9 10C11.8 10 14 7.8 14 5C14 2.2 11.8 0 9 0C6.2 0 4 2.2 4 5C4 7.8 6.2 10 9 10Z" fill={primary}/><path d="M9 12C5.7 12 0 13.7 0 17V19H18V17C18 13.7 12.3 12 9 12Z" fill={primary}/><path d="M19 10C21 10 22.5 8.5 22.5 6.5C22.5 4.5 21 3 19 3C18.2 3 17.5 3.3 17 3.8C17.6 4.6 18 5.7 18 7C18 8 17.7 8.9 17.2 9.6C17.7 9.9 18.3 10 19 10Z" fill={primary} fillOpacity="0.5"/><path d="M19 12C17.9 12 16.9 12.2 16.1 12.6C17.4 13.6 18.3 15 18.3 17V19H26V17C26 13.7 22.3 12 19 12Z" fill={primary} fillOpacity="0.5"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: primary }}>Circles</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={muted} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={muted} strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 10, color: muted }}>Settings</span>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(4,18,10,0.92) 0%, rgba(4,18,10,0.78) 45%, transparent 100%)",
        padding: `${Math.round(H * 0.07)}px ${Math.round(W * 0.06)}px ${Math.round(H * 0.035)}px`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: Math.round(W * 0.06), fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1.15 }}>
          All your circles<br />in one place
        </div>
        <div style={{ fontSize: Math.round(W * 0.026), color: "rgba(255,255,255,0.65)", marginTop: Math.round(H * 0.008), fontWeight: 500 }}>
          Manage every savings circle from your iPad
        </div>
      </div>
    </div>
  );
}
