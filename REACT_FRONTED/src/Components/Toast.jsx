/**
 * Toast.jsx — Animated toast alert system (drop-in browser alert replacement)
 *
 * Usage:
 *   import { toast, ToastContainer } from "./Toast";
 *
 *   // In JSX: <ToastContainer />
 *   // Anywhere: toast("Your message", "success" | "error" | "info" | "warning");
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";

const STYLES = `
  @keyframes toast-in {
    0%   { opacity: 0; transform: translateX(110%); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes toast-out {
    0%   { opacity: 1; transform: translateX(0);    max-height: 120px; margin-bottom: 10px; }
    100% { opacity: 0; transform: translateX(110%); max-height: 0;     margin-bottom: 0;   }
  }
  @keyframes toast-progress {
    from { width: 100%; }
    to   { width: 0%; }
  }
  .toast-item-enter { animation: toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .toast-item-exit  { animation: toast-out 0.38s ease forwards; }
`;

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const THEMES = {
  success: {
    bg: "linear-gradient(135deg, #0F2A1D 0%, #0D2218 100%)",
    border: "rgba(34,197,94,0.35)",
    icon: "#22C55E",
    bar: "#22C55E",
    text: "#DCFCE7",
    sub: "rgba(220,252,233,0.55)",
  },
  error: {
    bg: "linear-gradient(135deg, #2A0F0F 0%, #1E0808 100%)",
    border: "rgba(239,68,68,0.35)",
    icon: "#EF4444",
    bar: "#EF4444",
    text: "#FEE2E2",
    sub: "rgba(254,226,226,0.55)",
  },
  warning: {
    bg: "linear-gradient(135deg, #2A1A0A 0%, #1E1208 100%)",
    border: "rgba(245,158,11,0.35)",
    icon: "#F59E0B",
    bar: "#F59E0B",
    text: "#FEF3C7",
    sub: "rgba(254,243,199,0.55)",
  },
  info: {
    bg: "linear-gradient(135deg, #0A172A 0%, #081222 100%)",
    border: "rgba(59,111,255,0.35)",
    icon: "#3B6FFF",
    bar: "#3B6FFF",
    text: "#DBEAFE",
    sub: "rgba(219,234,254,0.55)",
  },
};

let _setToasts = null;
let _idCounter = 0;

/** Call from anywhere: toast("message", "success"|"error"|"warning"|"info") */
export function toast(message, type = "info", duration = 4000) {
  if (!_setToasts) {
    // Fallback to browser alert if container not mounted
    window.alert(message);
    return;
  }
  const id = ++_idCounter;
  _setToasts(prev => [...prev, { id, message, type, duration, exiting: false }]);
}

// Convenience aliases
toast.success = (msg, dur) => toast(msg, "success", dur);
toast.error   = (msg, dur) => toast(msg, "error",   dur);
toast.warning = (msg, dur) => toast(msg, "warning",  dur);
toast.info    = (msg, dur) => toast(msg, "info",     dur);

function ToastItem({ id, message, type, duration, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const th = THEMES[type] || THEMES.info;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(id), 400);
  }, [id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div
      className={exiting ? "toast-item-exit" : "toast-item-enter"}
      style={{
        position: "relative",
        background: th.bg,
        border: `1px solid ${th.border}`,
        borderRadius: "14px",
        padding: "14px 16px 16px",
        minWidth: "300px", maxWidth: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        marginBottom: "10px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={dismiss}
    >
      {/* Content row */}
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        {/* Icon */}
        <div style={{ color: th.icon, flexShrink: 0, marginTop: "1px" }}>
          {ICONS[type] || ICONS.info}
        </div>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: th.text, fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.45, wordBreak: "break-word" }}>
            {message}
          </div>
          <div style={{ color: th.sub, fontSize: "0.72rem", marginTop: "2px" }}>
            Click to dismiss
          </div>
        </div>
        {/* Close */}
        <button
          onClick={e => { e.stopPropagation(); dismiss(); }}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: "0", lineHeight: 1, flexShrink: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, height: "3px",
        width: "100%", background: "rgba(255,255,255,0.06)",
      }}>
        <div style={{
          height: "100%",
          background: `linear-gradient(90deg, ${th.bar}, ${th.bar}aa)`,
          animation: `toast-progress ${duration}ms linear forwards`,
          borderRadius: "0 0 14px 14px",
        }} />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _setToasts = setToasts;
    return () => { _setToasts = null; };
  }, []);

  const remove = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        position: "fixed", top: "1.25rem", right: "1.25rem",
        zIndex: 999999,
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem {...t} onRemove={remove} />
          </div>
        ))}
      </div>
    </>
  );
}
