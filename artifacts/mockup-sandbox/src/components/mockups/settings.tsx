export default function SettingsPreview() {
  const primary = "#18a574";
  const bg = "#f6f8fb";
  const card = "#ffffff";
  const border = "#d9dde6";
  const muted = "#636e82";
  const text = "#141c2e";
  const danger = "#e52222";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg, minHeight: "100vh" }}>
      <div style={{ paddingTop: 56, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: text, marginBottom: 28, marginTop: 8 }}>Ajustes</div>

        {/* Account */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginLeft: 4 }}>Cuenta</div>
          <div style={{ background: card, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: 16, gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: text }}>María González</div>
                <div style={{ fontSize: 13, color: muted, marginTop: 2 }}>maria@ejemplo.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginLeft: 4 }}>Idioma</div>
          <div style={{ background: card, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
              <span style={{ fontSize: 16, color: text }}>Español</span>
              <span style={{ fontSize: 20, color: primary }}>✓</span>
            </div>
            <div style={{ height: 1, background: border, marginLeft: 16, marginRight: 16 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
              <span style={{ fontSize: 16, color: text }}>English</span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14, border: `1px solid ${danger}40`, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>🚪</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: danger }}>Cerrar sesión</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: card, borderTop: `1px solid ${border}`, display: "flex", height: 84 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: muted, gap: 4 }}>
          <span style={{ fontSize: 22 }}>👥</span>
          <span style={{ fontSize: 11 }}>Tandas</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: primary, gap: 4 }}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Ajustes</span>
        </div>
      </div>
    </div>
  );
}
