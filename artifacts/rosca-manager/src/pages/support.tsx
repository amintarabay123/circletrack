export function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f0", fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      <div style={{ background: "linear-gradient(160deg, #0d7a55 0%, #18a574 55%, #22c98a 100%)", padding: "48px 24px 36px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⭕</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>CircleTrack</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Support Center</div>
            </div>
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 12, lineHeight: 1.6 }}>
            We're here to help. Find answers below or contact us directly.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px" }}>

        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 22px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#18a574", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14 }}>Contact Us</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "#18a57418", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✉️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1f18" }}>Email Support</div>
              <a href="mailto:support@circletrack.app" style={{ fontSize: 14, color: "#18a574", textDecoration: "none" }}>support@circletrack.app</a>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "#18a57418", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⏱️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1f18" }}>Response Time</div>
              <div style={{ fontSize: 13, color: "#6b7c74" }}>We typically respond within 24–48 hours</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 22px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#18a574", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 18 }}>Frequently Asked Questions</div>

          {[
            {
              q: "What is a tanda / ROSCA?",
              a: "A tanda (also called ROSCA — Rotating Savings and Credit Association) is a group savings system where members contribute a fixed amount each period, and one member receives the full pool each turn, rotating until everyone has received it once."
            },
            {
              q: "How do I create a new circle?",
              a: "Tap the + button on the main screen, fill in the circle name, contribution amount, frequency (weekly, 1st & 15th, monthly, and more), and the number of members. You can then add members and assign turn order."
            },
            {
              q: "How do I record a payment?",
              a: "Go into the circle, open the member's detail, and tap 'Record Payment'. Enter the amount and date, and optionally add a note. The member's payment status will update immediately."
            },
            {
              q: "Can I rate members?",
              a: "Yes — after recording payments, you can leave a star rating (1–5) for each member based on their reliability. Ratings build a trust history that's visible on the member's profile."
            },
            {
              q: "How do I export or share a circle?",
              a: "Open the circle, tap the share/export icon in the top right, and choose to export as JSON (to back up or transfer) or as a PDF report. You can also import a JSON file to restore a circle."
            },
            {
              q: "The app is asking me to sign in — what should I do?",
              a: "CircleTrack uses secure sign-in via Google, Apple, or email. Tap 'Sign In' and choose your preferred method. Your data is tied to your account and synced securely."
            },
            {
              q: "I found a bug or the app crashed — how do I report it?",
              a: "Please email us at support@circletrack.app with a description of what happened, what device and iOS version you're using, and any steps to reproduce the issue. Screenshots or screen recordings are very helpful."
            },
            {
              q: "Is my data secure?",
              a: "Yes. All data is stored securely on our servers and protected with industry-standard encryption. We never share your personal information with third parties."
            },
          ].map((item, i, arr) => (
            <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < arr.length - 1 ? "1px solid #f0f4f0" : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f1f18", marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: "#4a5c54", lineHeight: 1.65 }}>{item.a}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#18a574", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14 }}>Privacy & Legal</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="https://i-phone-organizer.replit.app/privacy" style={{ fontSize: 14, color: "#18a574", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              🔒 Privacy Policy
            </a>
            <a href="https://i-phone-organizer.replit.app/terms" style={{ fontSize: 14, color: "#18a574", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              📄 Terms of Use
            </a>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, color: "#6b7c74", fontSize: 12 }}>
          © {new Date().getFullYear()} CircleTrack · All rights reserved
        </div>
      </div>
    </div>
  );
}
