import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.008) * 30;
  const drift2 = Math.cos(frame * 0.006) * 20;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0F1419 0%, #1A1F2E 40%, #0D1117 100%)" }}>
      <div
        style={{
          position: "absolute",
          top: 100 + drift,
          right: 80 + drift2,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,138,26,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 100 - drift,
          left: 60 - drift2,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,155,131,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 400 + drift2,
          left: 800 + drift,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,138,26,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};
