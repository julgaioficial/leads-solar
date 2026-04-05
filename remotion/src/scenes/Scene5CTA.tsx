import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [50, 0]);
  const subOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const btnScale = spring({ frame: frame - 50, fps, config: { damping: 10, stiffness: 150 } });
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const priceOp = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 24 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 18,
            background: "linear-gradient(135deg, #E88A1A, #D4740F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", boxShadow: "0 15px 50px rgba(232,138,26,0.3)",
          }}>
            <span style={{ fontSize: 36, color: "white", fontWeight: 900 }}>⚡</span>
          </div>
        </div>

        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}>
          <h2 style={{ fontSize: 56, fontWeight: 900, color: "white", margin: "0 0 16px 0", letterSpacing: -1 }}>
            Comece a vender <span style={{ color: "#E88A1A" }}>mais</span> hoje
          </h2>
        </div>

        <div style={{ opacity: subOp }}>
          <p style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", margin: "0 0 32px 0" }}>
            7 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
        </div>

        <div style={{ transform: `scale(${btnScale * pulse})` }}>
          <div style={{
            display: "inline-flex", padding: "18px 48px", borderRadius: 16,
            background: "linear-gradient(135deg, #E88A1A, #D4740F)",
            boxShadow: "0 10px 40px rgba(232,138,26,0.4)",
          }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "white" }}>
              Começar Agora →
            </span>
          </div>
        </div>

        <div style={{ opacity: priceOp, marginTop: 30, display: "flex", gap: 24, justifyContent: "center" }}>
          <div style={{
            padding: "14px 28px", borderRadius: 14,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Básico</p>
            <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 900, color: "white" }}>R$ 69<span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>,90/mês</span></p>
          </div>
          <div style={{
            padding: "14px 28px", borderRadius: 14,
            background: "rgba(232,138,26,0.1)", border: "1px solid rgba(232,138,26,0.25)",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "#E88A1A" }}>Pro ⭐</p>
            <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 900, color: "white" }}>R$ 149<span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>,90/mês</span></p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
