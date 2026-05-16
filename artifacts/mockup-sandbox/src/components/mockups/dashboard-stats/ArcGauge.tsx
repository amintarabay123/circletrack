export function ArcGauge() {
  const collectionRate = 0.625;
  const paid = 5;
  const late = 2;
  const unpaid = 1;
  const total = paid + late + unpaid;
  const potAmount = 4800;
  const currency = "$";
  const currentCycle = 3;
  const totalCycles = 12;

  const green = "#22c55e";
  const red = "#ef4444";
  const amber = "#f59e0b";
  const purple = "#818cf8";
  const bg = "#0f0f14";
  const card = "#1a1a24";
  const border = "#2a2a3a";

  const members = [
    { name: "Ana García", paid: true, late: false, amount: 600, due: 600 },
    { name: "Luis Mora", paid: false, late: true, amount: 0, due: 600 },
    { name: "María López", paid: true, late: false, amount: 600, due: 600 },
    { name: "Pedro Vega", paid: false, late: false, amount: 0, due: 600 },
    { name: "Rosa Díaz", paid: true, late: false, amount: 600, due: 600 },
  ];

  const gaugeAngle = -220;
  const gaugeRange = 260;
  const filledAngle = gaugeRange * collectionRate;
  const cx = 130, cy = 120, r = 90;
  const toRad = (d: number) => (d * Math.PI) / 180;

  function arcPath(startDeg: number, endDeg: number) {
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const trackPath = arcPath(gaugeAngle, gaugeAngle + gaugeRange);
  const fillPath = arcPath(gaugeAngle, gaugeAngle + filledAngle);

  const needleAngle = gaugeAngle + filledAngle;
  const nx = cx + (r - 10) * Math.cos(toRad(needleAngle));
  const ny = cy + (r - 10) * Math.sin(toRad(needleAngle));

  const cycleProgress = currentCycle / totalCycles;

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 40 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ background: `linear-gradient(180deg, #1a1a2e 0%, ${bg} 100%)`, padding: "52px 20px 16px" }}>
        <div style={{ color: "#aaa", fontSize: 13, marginBottom: 4 }}>← Círculos</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Amin Junio 2026</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Mensual · Ciclo {currentCycle}/{totalCycles}</p>
          </div>
          <div style={{ color: "#888", fontSize: 20 }}>···</div>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginTop: 20 }}>
          {["Inicio", "Pagos", "Miembros"].map((tab, i) => (
            <div key={tab} style={{ flex: 1, textAlign: "center", paddingBottom: 12, fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? purple : "#666", borderBottom: i === 0 ? `2px solid ${purple}` : "none" }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 16px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Tasa de Cobranza</p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="260" height="160" viewBox="0 0 260 160">
              <path d={trackPath} fill="none" stroke={border} strokeWidth="14" strokeLinecap="round" />
              <path d={fillPath} fill="none" stroke={green} strokeWidth="14" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px #22c55e88)" }} />
              <circle cx={nx} cy={ny} r="7" fill={green} style={{ filter: "drop-shadow(0 0 4px #22c55e)" }} />
              <text x={cx} y={cy + 8} textAnchor="middle" fill="#fff" fontSize="32" fontWeight="800" fontFamily="Inter">
                {Math.round(collectionRate * 100)}%
              </text>
              <text x={cx} y={cy + 28} textAnchor="middle" fill="#888" fontSize="11" fontFamily="Inter">cobranza</text>
              <text x={cx - r - 4} y={cy + r * Math.sin(toRad(gaugeAngle)) + 16} fill="#555" fontSize="10" fontFamily="Inter">0%</text>
              <text x={cx + r * Math.cos(toRad(gaugeAngle + gaugeRange)) - 10} y={cy + r * Math.sin(toRad(gaugeAngle + gaugeRange)) + 16} fill="#555" fontSize="10" fontFamily="Inter">100%</text>
            </svg>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 4 }}>
            {[
              { label: "Pagados", val: paid, color: green },
              { label: "Atrasados", val: late, color: red },
              { label: "Pendientes", val: unpaid, color: "#888" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Progreso del Ciclo</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: purple }}>Ciclo {currentCycle}/{totalCycles}</span>
          </div>
          <div style={{ height: 8, backgroundColor: border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${cycleProgress * 100}%`, background: `linear-gradient(90deg, ${purple}, #a78bfa)`, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#555" }}>Inicio</span>
            <span style={{ fontSize: 11, color: purple, fontWeight: 600 }}>{Math.round(cycleProgress * 100)}% completado</span>
            <span style={{ fontSize: 11, color: "#555" }}>Fin</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Bote Total</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: purple }}>{currency}{potAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Por Cobrar</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: amber }}>{currency}{(unpaid * 600 + late * 600).toLocaleString()}</div>
          </div>
        </div>

        <p style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Miembros</p>
        {members.map((m) => (
          <div key={m.name} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: purple + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: purple, flexShrink: 0 }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{currency}{m.amount} / {currency}{m.due}</div>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: m.paid ? green : m.late ? red : "#666" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
