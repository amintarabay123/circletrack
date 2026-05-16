export function DonutChart() {
  const paid = 4;
  const late = 2;
  const unpaid = 2;
  const total = paid + late + unpaid;
  const potAmount = 4800;
  const currency = "$";

  const members = [
    { name: "Ana García", paid: true, late: false, amount: 600, due: 600 },
    { name: "Luis Mora", paid: false, late: true, amount: 0, due: 600 },
    { name: "María López", paid: true, late: false, amount: 600, due: 600 },
    { name: "Pedro Vega", paid: false, late: false, amount: 0, due: 600 },
    { name: "Rosa Díaz", paid: true, late: false, amount: 600, due: 600 },
    { name: "Carlos Ruiz", paid: false, late: true, amount: 0, due: 600 },
    { name: "Elena Cruz", paid: true, late: false, amount: 600, due: 600 },
    { name: "Juan Pérez", paid: false, late: false, amount: 0, due: 600 },
  ];

  const green = "#22c55e";
  const red = "#ef4444";
  const gray = "#6b7280";
  const purple = "#818cf8";
  const bg = "#0f0f14";
  const card = "#1a1a24";
  const border = "#2a2a3a";

  const cx = 100;
  const cy = 100;
  const r = 72;
  const ir = 48;

  function slice(startAngle: number, endAngle: number, color: string) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ix1 = cx + ir * Math.cos(toRad(startAngle));
    const iy1 = cy + ir * Math.sin(toRad(startAngle));
    const ix2 = cx + ir * Math.cos(toRad(endAngle));
    const iy2 = cy + ir * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z`;
  }

  const paidDeg = (paid / total) * 360;
  const lateDeg = (late / total) * 360;
  const unpaidDeg = (unpaid / total) * 360;

  const paidPath = slice(-90, -90 + paidDeg, green);
  const latePath = slice(-90 + paidDeg, -90 + paidDeg + lateDeg, red);
  const unpaidPath = slice(-90 + paidDeg + lateDeg, -90 + paidDeg + lateDeg + unpaidDeg, gray);

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "0 0 40px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ background: `linear-gradient(180deg, #1a1a2e 0%, ${bg} 100%)`, padding: "52px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ color: "#aaa", fontSize: 13 }}>← Círculos</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Amin Junio 2026</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Mensual · Ciclo 3/12</p>
          </div>
          <div style={{ color: "#888", fontSize: 20 }}>···</div>
        </div>

        <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginTop: 20, gap: 0 }}>
          {["Inicio", "Pagos", "Miembros"].map((tab, i) => (
            <div key={tab} style={{
              flex: 1, textAlign: "center", paddingBottom: 12, fontSize: 13, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? purple : "#666",
              borderBottom: i === 0 ? `2px solid ${purple}` : "none",
            }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 16px", marginBottom: 16 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Estado de Pagos</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 12 }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <path d={paidPath} fill={green} />
              <path d={latePath} fill={red} />
              <path d={unpaidPath} fill={gray} />
              <circle cx={cx} cy={cy} r={ir - 2} fill={card} />
              <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" fontFamily="Inter">{currency}{potAmount.toLocaleString()}</text>
              <text x={cx} y={cy + 6} textAnchor="middle" fill="#888" fontSize="9" fontFamily="Inter">bote total</text>
              <text x={cx} y={cy + 22} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="Inter">{total} miembros</text>
            </svg>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Pagados", count: paid, color: green },
                { label: "Atrasados", count: late, color: red },
                { label: "Pendientes", count: unpaid, color: gray },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.1 }}>{count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Bote</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: purple }}>{currency}{potAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Cobranza</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: green }}>{Math.round((paid / total) * 100)}%</div>
          </div>
        </div>

        <p style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Este Ciclo</p>
        {members.slice(0, 5).map((m) => (
          <div key={m.name} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: purple + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: purple, flexShrink: 0 }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{currency}{m.amount} / {currency}{m.due}</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 20, backgroundColor: (m.paid ? green : m.late ? red : gray) + "25", fontSize: 11, fontWeight: 700, color: m.paid ? green : m.late ? red : gray }}>
              {m.paid ? "Pagado" : m.late ? "Atrasado" : "Pendiente"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
