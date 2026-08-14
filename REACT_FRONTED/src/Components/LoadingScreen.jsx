import { useEffect, useState } from "react";

const styles = `
  @keyframes ls-spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes ls-pulse-ring {
    0%   { transform: scale(0.85); opacity: 0.6; }
    50%  { transform: scale(1.08); opacity: 0.2; }
    100% { transform: scale(0.85); opacity: 0.6; }
  }
  @keyframes ls-fade-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ls-progress {
    0%   { width: 0%; }
    40%  { width: 55%; }
    70%  { width: 78%; }
    90%  { width: 92%; }
    100% { width: 100%; }
  }
  @keyframes ls-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes ls-dot-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
    40%            { transform: scale(1);   opacity: 1;    }
  }
  @keyframes ls-overlay-out {
    0%   { opacity: 1; }
    100% { opacity: 0; pointer-events: none; }
  }
`;

export default function LoadingScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation at 1.6 s, call onDone at 2.0 s
    const t1 = setTimeout(() => setExiting(true), 1600);
    const t2 = setTimeout(() => { if (onDone) onDone(); }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <>
      <style>{styles}</style>
      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 60%, #172554 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        animation: exiting ? "ls-overlay-out 0.42s ease forwards" : "none",
        overflow: "hidden",
      }}>
        {/* Background dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "26px 26px", pointerEvents: "none",
        }} />

        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "-120px", right: "-100px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Center content */}
        <div style={{
          position: "relative",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0",
          animation: "ls-fade-in 0.55s ease both",
        }}>
          {/* Pulsing ring behind logo */}
          <div style={{
            position: "relative", width: "100px", height: "100px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1.5rem",
          }}>
            {/* outer pulse ring */}
            <div style={{
              position: "absolute", inset: "-14px", borderRadius: "50%",
              border: "2.5px solid rgba(232,74,47,0.35)",
              animation: "ls-pulse-ring 2s ease-in-out infinite",
            }} />
            {/* inner ring */}
            <div style={{
              position: "absolute", inset: "-6px", borderRadius: "50%",
              border: "2px solid rgba(59,111,255,0.25)",
              animation: "ls-pulse-ring 2s ease-in-out infinite 0.5s",
            }} />
            {/* spinner arc */}
            <div style={{
              position: "absolute", inset: "-18px", borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "#FF6B35",
              borderRightColor: "rgba(255,107,53,0.3)",
              animation: "ls-spin 0.9s linear infinite",
            }} />
            {/* Logo */}
            <div style={{
              width: "76px", height: "76px", borderRadius: "22px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
            }}>
              <img
                src="/logo.png"
                alt="Aarya Auto Garage"
                style={{ width: "52px", height: "52px", objectFit: "contain" }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;
                }}
              />
            </div>
          </div>

          {/* Brand name */}
          <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1.45rem", letterSpacing: "-0.4px", marginBottom: "0.3rem" }}>
            Aarya Auto Garage
          </div>
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "2.25rem" }}>
            Spare Parts Store
          </div>

          {/* Progress bar */}
          <div style={{ width: "220px", marginBottom: "1.25rem" }}>
            <div style={{
              width: "100%", height: "3px", borderRadius: "2px",
              background: "rgba(255,255,255,0.1)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                background: "linear-gradient(90deg, #E84A2F, #FF6B35, #3B6FFF)",
                backgroundSize: "200% 100%",
                animation: "ls-progress 1.8s ease forwards, ls-shimmer 1.8s linear infinite",
              }} />
            </div>
          </div>

          {/* Loading dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.73rem", letterSpacing: "0.5px", marginRight: "4px" }}>Loading</span>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "#FF6B35",
                display: "inline-block",
                animation: `ls-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          position: "absolute", bottom: "2rem",
          color: "rgba(255,255,255,0.18)", fontSize: "0.7rem", letterSpacing: "0.5px",
        }}>
          © 2026 Aarya Auto Garage And Spare Parts Store
        </div>
      </div>
    </>
  );
}
