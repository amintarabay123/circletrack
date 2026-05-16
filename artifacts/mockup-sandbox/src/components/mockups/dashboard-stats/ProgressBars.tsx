export function ProgressBars() {
  const paid = 4;
  const late = 1;
  const unpaid = 3;
  const total = paid + late + unpaid;
  const potAmount = 6400;
  const currency = "$";
  const amountPerMember = 800;

  const green = "#22c55e";
  const red = "#ef4444";
  const amber = "#f59e0b";
  const purple = "#818cf8";
  const bg = "#0f0f14";
  const card = "#1a1a24";
  const border = "#2a2a3a";

  const members = [
    { name: "Ana García", paid: true, late: false, amountPaid: 800 },
    { name: "Luis Mora", paid: false, late: true, amountPaid: 400 },
    { name: "María López", paid: true, late: false, amountPaid: 800 },
    { name: "Pedro Vega", paid: false, late: false, amountPaid: 0 },
    { name: "Rosa Díaz", paid: true, late: false, amountPaid: 800 },
    { name: "Carlos Ruiz", paid: false, late: false, amountPaid: 0 },
    { name: "Elena Cruz", paid: true, late: false, amountPaid: 800 },
    { name: "Juan Pérez", paid: false, late: false, amountPaid: 0 },
  ];

  const totalCollected = members.reduce((s, m) => s + m.amountPaid, 0);
  const collectionRate = Math.round((paid / total) * 100);

  return (
    <div style={{ backgroundColor: bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 40 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ background: `linear-gradient(180deg, #1a1a2e 0%, ${bg} 100%)`, padding: "52px 20px 16px" }}>
        <div style={{ color: "#aaa", fontSize: 13, marginBottom: 4 }}>← Círculos</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Amin Junio 2026</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Mensual · Ciclo 3/12</p>
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
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Recaudado</p>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                {currency}{totalCollected.toLocaleString()}
                <span style={{ fontSize: 14, color: "#666", fontWeight: 400 }}> / {currency}{potAmount.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: collectionRate >= 80 ? green : amber }}>{collectionRate}%</div>
              <div style={{ fontSize: 11, color: "#666" }}>cobranza</div>
            </div>
          </div>

          <div style={{ height: 10, backgroundColor: border, borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${collectionRate}%`, background: `linear-gradient(90deg, ${green}, #4ade80)`, borderRadius: 5 }} />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Pagados", count: paid, color: green },
              { label: "Atrasados", count: late, color: amber },
              { label: "Pendientes", count: unpaid, color: "#555" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
                <span style={{ fontSize: 12, color: "#888" }}>{count} {label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Pago por Miembro</p>
          {members.map((m) => {
            const pct = m.amountPaid / amountPerMember;
            const color = m.paid ? green : m.late ? amber : "#555";
            const trackColor = m.paid ? green + "30" : m.late ? amber + "30" : border;
            return (
              <div key={m.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
                      {m.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>{m.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#666" }}>{currency}{m.amountPaid}/{currency}{amountPerMember}</span>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color }} />
                  </div>
                </div>
                <div style={{ height: 6, backgroundColor: trackColor, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct * 100}%`, backgroundColor: color, borderRadius: 3, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Bote Total</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: purple }}>{currency}{potAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Por Cobrar</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: red }}>{currency}{(potAmount - totalCollected).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
