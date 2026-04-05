import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 20 } }), [0, 1], [60, 0]);
  const titleOp = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOp = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subY = interpolate(spring({ frame: frame - 35, fps, config: { damping: 20 } }), [0, 1], [40, 0]);
  const badgeScale = spring({ frame: frame - 55, fps, config: { damping: 12 } });
  const lineW = interpolate(frame, [60, 100], [0, 400], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        {/* Logo icon */}
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 30 }}>
          <div style={{
            width: 90, height: 90, borderRadius: 20,
            background: "linear-gradient(135deg, #E88A1A 0%, #D4740F 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", boxShadow: "0 20px 60px rgba(232,138,26,0.3)",
          }}>
            <span style={{ fontSize: 44, color: "white", fontWeight: 900 }}>⚡</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}>
          <h1 style={{ fontSize: 72, fontWeight: 900, color: "white", margin: 0, letterSpacing: -2 }}>
            Leads<span style={{ color: "#E88A1A" }}>Solar</span>
          </h1>
        </div>

        {/* Decorative line */}
        <div style={{ width: lineW, height: 3, background: "linear-gradient(90deg, transparent, #E88A1A, transparent)", margin: "20px auto" }} />

        {/* Subtitle */}
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)` }}>
          <p style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 400 }}>
            Automatize seu atendimento solar com IA
          </p>
        </div>

        {/* Badge */}
        <Sequence from={55}>
          <div style={{ transform: `scale(${badgeScale})`, marginTop: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 28px", borderRadius: 50,
              background: "rgba(232,138,26,0.15)", border: "1px solid rgba(232,138,26,0.3)",
            }}>
              <span style={{ fontSize: 16, color: "#E88A1A", fontWeight: 700 }}>
                🚀 Pré-orçamentos automáticos via chatbot
              </span>
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
