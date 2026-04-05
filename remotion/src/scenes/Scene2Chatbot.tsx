import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const messages = [
  { from: "bot", text: "Olá! 👋 Sou o assistente solar. Qual seu consumo mensal em kWh?", delay: 0 },
  { from: "user", text: "Cerca de 450 kWh por mês", delay: 35 },
  { from: "bot", text: "Para 450 kWh, recomendo o Kit Solar 5.5 kWp:", delay: 65 },
  { from: "bot", text: "✅ 10 painéis • 20m² • R$ 28.900\n💰 Economia de até R$ 450/mês", delay: 85 },
  { from: "user", text: "Me interessei! Pode enviar orçamento?", delay: 115 },
  { from: "bot", text: "Ótimo! 🎉 Seu pré-orçamento foi gerado! Um consultor entrará em contato.", delay: 140 },
];

export const Scene2Chatbot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const phoneScale = spring({ frame: frame - 5, fps, config: { damping: 18, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ fontFamily, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* Left text */}
        <div style={{ opacity: titleOp, maxWidth: 500 }}>
          <p style={{ fontSize: 18, color: "#E88A1A", fontWeight: 700, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: 3 }}>
            Chatbot Inteligente
          </p>
          <h2 style={{ fontSize: 48, fontWeight: 700, color: "white", margin: "0 0 16px 0", lineHeight: 1.1 }}>
            Atendimento 24/7 com{" "}
            <span style={{ color: "#2D9B83" }}>pré-orçamento automático</span>
          </h2>
          <p style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            Seu chatbot responde leads instantaneamente, qualifica e gera orçamentos personalizados.
          </p>
        </div>

        {/* Phone mockup */}
        <div style={{ transform: `scale(${phoneScale})` }}>
          <div style={{
            width: 360, borderRadius: 32,
            background: "linear-gradient(145deg, #1E2433 0%, #171C28 100%)",
            border: "2px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(232,138,26,0.1)",
            padding: "16px 0",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: "linear-gradient(135deg, #E88A1A, #D4740F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>⚡</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "white" }}>SolarTech</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Online agora</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 8, minHeight: 350 }}>
              {messages.map((msg, i) => {
                const msgFrame = frame - msg.delay;
                const op = interpolate(msgFrame, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                const y = interpolate(msgFrame, [0, 12], [15, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
                if (op <= 0) return null;

                const isBot = msg.from === "bot";
                return (
                  <div key={i} style={{
                    opacity: op, transform: `translateY(${y}px)`,
                    alignSelf: isBot ? "flex-start" : "flex-end",
                    maxWidth: "80%",
                  }}>
                    <div style={{
                      padding: "10px 14px", borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                      background: isBot ? "rgba(45,155,131,0.15)" : "rgba(232,138,26,0.2)",
                      border: `1px solid ${isBot ? "rgba(45,155,131,0.2)" : "rgba(232,138,26,0.25)"}`,
                    }}>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
