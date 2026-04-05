import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin"] });

const stats = [
  { label: "Leads Hoje", value: "24", trend: "+12%", color: "#E88A1A" },
  { label: "Conversão", value: "38%", trend: "+5%", color: "#2D9B83" },
  { label: "Orçamentos", value: "47/100", trend: "", color: "#6366F1" },
  { label: "Kits Ativos", value: "8", trend: "", color: "#EC4899" },
];

const leads = [
  { name: "João Silva", phone: "(11) 99999-0001", score: "HOT", kit: "5.5 kWp", color: "#EF4444" },
  { name: "Maria Santos", phone: "(21) 98888-0002", score: "WARM", kit: "3.3 kWp", color: "#F59E0B" },
  { name: "Carlos Oliveira", phone: "(31) 97777-0003", score: "HOT", kit: "8.8 kWp", color: "#EF4444" },
];

export const Scene3Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const dashScale = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px" }}>
      {/* Title */}
      <div style={{ opacity: titleOp, textAlign: "center", marginBottom: 30 }}>
        <p style={{ fontSize: 16, color: "#E88A1A", fontWeight: 700, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 3 }}>Dashboard Completo</p>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: "white", margin: 0 }}>
          Controle total dos seus <span style={{ color: "#2D9B83" }}>leads</span>
        </h2>
      </div>

      {/* Dashboard mockup */}
      <div style={{
        transform: `scale(${dashScale})`, width: "100%", maxWidth: 1400,
        borderRadius: 20, background: "linear-gradient(145deg, #1A1F2E 0%, #141820 100%)",
        border: "1px solid rgba(255,255,255,0.06)", padding: 24,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {stats.map((stat, i) => {
            const cardOp = interpolate(frame, [25 + i * 8, 40 + i * 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const count = interpolate(frame, [30 + i * 8, 60 + i * 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            return (
              <div key={i} style={{
                opacity: cardOp, flex: 1, padding: "18px 20px", borderRadius: 14,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: stat.color, marginBottom: 10 }} />
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: "white" }}>{stat.value}</span>
                  {stat.trend && <span style={{ fontSize: 13, color: "#2D9B83", fontWeight: 600 }}>{stat.trend}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leads table */}
        <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 0 }}>
            {["Nome", "Telefone", "Score", "Kit Recomendado"].map((h, i) => (
              <p key={i} style={{ flex: 1, margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</p>
            ))}
          </div>
          {leads.map((lead, i) => {
            const rowOp = interpolate(frame, [60 + i * 12, 75 + i * 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            return (
              <div key={i} style={{
                opacity: rowOp, padding: "14px 20px", display: "flex",
                borderBottom: i < leads.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <p style={{ flex: 1, margin: 0, fontSize: 14, color: "white", fontWeight: 600 }}>{lead.name}</p>
                <p style={{ flex: 1, margin: 0, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{lead.phone}</p>
                <div style={{ flex: 1 }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: `${lead.color}20`, color: lead.color, border: `1px solid ${lead.color}40`,
                  }}>{lead.score}</span>
                </div>
                <p style={{ flex: 1, margin: 0, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{lead.kit}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
