import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin"] });

const brands = [
  { name: "SolarTech", color: "#E88A1A", accent: "#2D9B83" },
  { name: "EcoSol", color: "#22C55E", accent: "#0EA5E9" },
  { name: "SunPower", color: "#8B5CF6", accent: "#F59E0B" },
];

export const Scene4WhiteLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px" }}>
      <div style={{ opacity: titleOp, textAlign: "center", marginBottom: 40 }}>
        <p style={{ fontSize: 16, color: "#E88A1A", fontWeight: 700, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 3 }}>White-Label</p>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: "white", margin: 0 }}>
          Sua marca, sua <span style={{ color: "#E88A1A" }}>identidade</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        {brands.map((brand, i) => {
          const cardScale = spring({ frame: frame - 20 - i * 15, fps, config: { damping: 15 } });
          const float = Math.sin((frame + i * 40) * 0.04) * 5;

          return (
            <div key={i} style={{
              transform: `scale(${cardScale}) translateY(${float}px)`,
              width: 340, borderRadius: 20,
              background: "linear-gradient(145deg, #1E2433, #171C28)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${brand.color}10`,
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: `linear-gradient(135deg, ${brand.color}15, transparent)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, ${brand.color}, ${brand.accent})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>⚡</span>
                  </div>
                  <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{brand.name}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 20 }}>
                <div style={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 12 }}>
                  <div style={{ width: "70%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${brand.color}, ${brand.accent})` }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[1, 2].map((j) => (
                    <div key={j} style={{ flex: 1, height: 50, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
                <div style={{
                  padding: "10px 16px", borderRadius: 10,
                  background: `${brand.color}15`, border: `1px solid ${brand.color}30`,
                  textAlign: "center",
                }}>
                  <p style={{ margin: 0, fontSize: 12, color: brand.color, fontWeight: 600 }}>leadssolar.com.br/s/{brand.name.toLowerCase()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
