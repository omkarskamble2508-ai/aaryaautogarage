import { useState, useRef, useEffect } from "react";
import axios from "axios";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const AARYA_SUGGESTIONS = ["Parts for Honda Activa", "Show me brake pads", "What are your shop timings?"];
const GPT_SUGGESTIONS   = ["What causes engine overheating?", "How often to change engine oil?", "Disc vs drum brakes?"];
const API = "http://localhost:3000";

const formatText = (text) => {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ color: T.text, fontWeight: 700 }}>{p.slice(2,-2)}</strong>
      : p
  );
};

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

function FloatingChatbot() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [mode,    setMode]    = useState("aarya");
  const [aaryaMsgs, setAaryaMsgs] = useState([{ sender: "Bot", text: "👋 Hello! I'm **Aarya Bot**, your spare parts assistant.\n\nWhat are you looking for today?" }]);
  const [gptMsgs,   setGptMsgs]   = useState([{ sender: "Bot", text: "👋 Hello! I'm the **AI Assistant**.\n\nAsk me anything about bikes, maintenance, or repairs!" }]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const endRef = useRef(null);

  const isAarya    = mode === "aarya";
  const messages   = isAarya ? aaryaMsgs : gptMsgs;
  const setMessages= isAarya ? setAaryaMsgs : setGptMsgs;
  const suggestions= isAarya ? AARYA_SUGGESTIONS : GPT_SUGGESTIONS;
  const accent     = isAarya ? T.blue : "#8B5CF6";

  useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, isOpen, mode]);

  const send = async (text) => {
    const msg = (text || input).trim(); if (!msg) return;
    setInput(""); setMessages(p => [...p, { sender: "You", text: msg }]); setTyping(true);
    try {
      const res = await axios.post(isAarya ? `${API}/chat` : `${API}/chat-gpt`, { message: msg });
      setMessages(p => [...p, { sender: "Bot", text: res.data.reply || "Sorry, no response." }]);
    } catch {
      setMessages(p => [...p, { sender: "Bot", text: "⚠️ Service unavailable. Please try again." }]);
    } finally { setTyping(false); }
  };

  return (
    <>
      <style>{`
        @keyframes cbSlideIn { from { opacity:0; transform:translateY(12px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes cbPulse { 0%,100%{box-shadow:0 0 0 0 rgba(59,111,255,0.4)} 50%{box-shadow:0 0 0 10px rgba(59,111,255,0)} }
        .cb-msg { animation: cbSlideIn 0.2s ease both; }
        .cb-dots span { display:inline-block; width:6px; height:6px; background:#9CA3AF; border-radius:50%; animation:cbDot 1.2s ease infinite; margin:0 2px; }
        .cb-dots span:nth-child(2){animation-delay:.2s} .cb-dots span:nth-child(3){animation-delay:.4s}
        @keyframes cbDot { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position:"fixed", bottom:"100px", right:"24px", width:"380px", height:"560px",
          background:T.surface, borderRadius:"20px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
          display:"flex", flexDirection:"column", overflow:"hidden", zIndex:9999,
          fontFamily:T.font, border:`1.5px solid ${T.border}`,
          animation:"cbSlideIn 0.28s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Mode tabs */}
          <div style={{ display:"flex", background:T.bg, borderBottom:`1px solid ${T.border}` }}>
            {[["aarya","🏍️ Aarya Bot", T.blue], ["gpt","🤖 AI Assistant","#8B5CF6"]].map(([m, label, col]) => {
              const active = mode === m;
              return (
                <button key={m} onClick={()=>setMode(m)} style={{
                  flex:1, padding:"0.72rem 0", border:"none",
                  borderBottom:`3px solid ${active ? col : "transparent"}`,
                  background: active ? `${col}12` : "transparent",
                  color: active ? col : T.muted,
                  fontWeight: active ? 700 : 500, fontSize:"0.82rem",
                  cursor:"pointer", fontFamily:T.font, transition:"all 0.18s",
                }}>{label}</button>
              );
            })}
          </div>

          {/* Header */}
          <div style={{
            padding:"1rem 1.25rem", background:T.surface,
            borderBottom:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <div style={{
                width:"36px", height:"36px", borderRadius:"50%",
                background:`linear-gradient(135deg, ${accent}, ${accent}cc)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.1rem", boxShadow:`0 2px 8px ${accent}40`,
              }}>{isAarya ? "🏍️" : "🤖"}</div>
              <div>
                <div style={{ color:T.text, fontWeight:800, fontSize:"0.95rem" }}>{isAarya ? "Aarya Bot" : "AI Assistant"}</div>
                <div style={{ color:T.muted, fontSize:"0.73rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#10B981", display:"inline-block" }} />
                  {isAarya ? "Live Inventory Assistant" : "Powered by GPT-OSS"}
                </div>
              </div>
            </div>
            <button onClick={()=>setIsOpen(false)} style={{
              background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:"8px",
              width:"30px", height:"30px", cursor:"pointer", color:T.muted,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem",
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", display:"flex", flexDirection:"column", gap:"0.75rem", background:T.bg }}>
            {messages.map((m, i) => {
              const isBot = m.sender === "Bot";
              return (
                <div key={i} className="cb-msg" style={{
                  alignSelf: isBot ? "flex-start" : "flex-end",
                  maxWidth:"82%",
                }}>
                  <div style={{
                    background: isBot ? T.surface : `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                    color: isBot ? T.text : "#fff",
                    border: isBot ? `1.5px solid ${T.border}` : "none",
                    padding:"0.65rem 0.9rem",
                    borderRadius: isBot ? "4px 14px 14px 14px" : "14px 14px 4px 14px",
                    fontSize:"0.86rem", lineHeight:1.55,
                    boxShadow: isBot ? "0 2px 8px rgba(0,0,0,0.05)" : `0 3px 12px ${accent}30`,
                  }}>
                    {isBot ? <span style={{whiteSpace:"pre-wrap"}}>{formatText(m.text)}</span> : m.text}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="cb-msg" style={{ alignSelf:"flex-start" }}>
                <div style={{ background:T.surface, border:`1.5px solid ${T.border}`, padding:"0.65rem 0.9rem", borderRadius:"4px 14px 14px 14px" }}>
                  <div className="cb-dots"><span/><span/><span/></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick suggestions */}
          <div style={{ padding:"0.6rem 0.75rem", display:"flex", gap:"0.4rem", overflowX:"auto", background:T.surface, borderTop:`1px solid ${T.border}` }}>
            {suggestions.map((s,i) => (
              <button key={i} onClick={()=>!typing && send(s)} disabled={typing} style={{
                padding:"0.3rem 0.75rem", borderRadius:"100px",
                border:`1.5px solid ${T.border}`, background:T.bg,
                color:T.sub, fontSize:"0.75rem", whiteSpace:"nowrap",
                cursor: typing ? "not-allowed" : "pointer", flexShrink:0, fontFamily:T.font,
                transition:"all 0.15s",
              }}
                onMouseEnter={e=>{ if(!typing){ e.currentTarget.style.borderColor=accent; e.currentTarget.style.color=accent; }}}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.sub; }}
              >{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:"0.75rem", display:"flex", gap:"0.5rem", background:T.surface, borderTop:`1px solid ${T.border}` }}>
            <input
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); }}}
              placeholder="Type a message..." disabled={typing}
              style={{
                flex:1, padding:"0.6rem 0.9rem",
                background:T.bg, color:T.text,
                border:`1.5px solid ${T.border}`, borderRadius:"10px",
                fontSize:"0.88rem", outline:"none", fontFamily:T.font,
                transition:"border-color 0.2s",
              }}
              onFocus={e=>{ e.currentTarget.style.borderColor=accent; }}
              onBlur={e=>{ e.currentTarget.style.borderColor=T.border; }}
            />
            <button onClick={()=>send()} disabled={!input.trim()||typing} style={{
              background: (!input.trim()||typing) ? T.bg : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: (!input.trim()||typing) ? T.muted : "#fff",
              border: `1.5px solid ${(!input.trim()||typing) ? T.border : accent}`,
              borderRadius:"10px", width:"42px", height:"42px",
              cursor: (!input.trim()||typing) ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"all 0.2s",
            }}><SendIcon /></button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={e=>{ e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{
          position:"fixed", bottom:"24px", right:"24px",
          width:"60px", height:"60px", borderRadius:"50%",
          background: isOpen ? T.surface : `linear-gradient(135deg, ${T.blue}, #6B9FFF)`,
          color: isOpen ? T.muted : "#fff",
          border: isOpen ? `1.5px solid ${T.border}` : "none",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,0.1)" : "0 6px 24px rgba(59,111,255,0.45)",
          cursor:"pointer", zIndex:99999,
          transition:"all 0.28s cubic-bezier(0.175,0.885,0.32,1.275)",
          animation: !isOpen ? "cbPulse 2.5s ease 2s" : "none",
        }}
      >
        {isOpen
          ? <span style={{ fontSize:"1.2rem" }}>✕</span>
          : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="3" fill="white" fillOpacity="0.9"/>
              <path d="M12 11V5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="4" r="1.5" fill="white"/>
              <circle cx="8.5" cy="16" r="1.2" fill="#3B6FFF"/>
              <circle cx="12" cy="16" r="1.2" fill="#3B6FFF"/>
              <circle cx="15.5" cy="16" r="1.2" fill="#3B6FFF"/>
            </svg>
        }
      </button>
    </>
  );
}

export default FloatingChatbot;
