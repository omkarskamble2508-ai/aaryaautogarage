import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "../Components/Sidebar";

const T = {
  bg: "#1A1E2E", surface: "#222840", card: "#252D48", border: "#303A58",
  text: "#CDD4E8", muted: "#7A87A8", accent: "#3B6FFF", accentHover: "#5A87FF",
  success: "#22C55E", orange: "#F97316", font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const AARYA_SUGGESTIONS = [
  "What parts do you have for Honda Activa?", "Show me brake pads",
  "What are your shop timings?", "Do you have Pulsar 150 chain sprocket?",
  "Show all categories", "How do I order a part?",
];

const GPT_SUGGESTIONS = [
  "What causes engine overheating?", "How often should I change engine oil?",
  "Explain the difference between disc and drum brakes", "Tips for bike maintenance in monsoon",
];

const API = "https://aaryaautogarage.onrender.com";

function ChatBot() {
  const [mode, setMode] = useState("aarya");

  const [aaryaMessages, setAaryaMessages] = useState([
    { sender: "Bot", text: "👋 Hello! I'm **Aarya Bot**, your dedicated spare parts assistant.\n\nI can help you find spare parts, check prices, know our shop timings, and more — all from our live inventory!\n\nWhat are you looking for today?" }
  ]);
  const [gptMessages, setGptMessages] = useState([
    { sender: "Bot", text: "👋 Hello! I'm the **AI Assistant** powered by GPT-OSS.\n\nAsk me anything related to bikes, spare parts, automotive tips, or garage services. I'm here to help!" }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = mode === "aarya" ? aaryaMessages : gptMessages;
  const setMessages = mode === "aarya" ? setAaryaMessages : setGptMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, mode]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "You", text: msg }]);
    setIsTyping(true);

    const endpoint = mode === "aarya" ? `${API}/chat` : `${API}/chat-gpt`;

    try {
      const res = await axios.post(endpoint, { message: msg });
      setMessages((prev) => [...prev, { sender: "Bot", text: res.data.reply || "Sorry, I didn't get a response." }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        sender: "Bot",
        text: mode === "aarya" ? "⚠️ Could not connect to Aarya Bot. Please ensure the backend is running." : "⚠️ AI Assistant is unavailable right now. Try switching to **Aarya Bot** mode.",
      }]);
    } finally { setIsTyping(false); }
  };

  const isAarya = mode === "aarya";
  const themeColor = isAarya ? T.accent : T.orange;
  const suggestions = isAarya ? AARYA_SUGGESTIONS : GPT_SUGGESTIONS;

  return (
    <Sidebar>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .chatbot-fullpage-wrapper { margin: -2rem; height: calc(100vh - 62px); display: flex; flex-direction: column; overflow: hidden; font-family: ${T.font}; }
        @keyframes typingBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .cb-msg-anim { animation: fadeIn 0.22s ease both; }
        .cb-md p { margin: 0 0 0.45rem 0; }
        .cb-md p:last-child { margin: 0; }
        .cb-md ul, .cb-md ol { margin: 0.3rem 0 0.4rem 1.2rem; padding: 0; }
        .cb-md li { margin-bottom: 0.2rem; }
        .cb-md code { background: rgba(255,255,255,0.1); padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.84em; }
        .cb-md pre { background: rgba(0,0,0,0.2); padding: 0.7rem; border-radius: 5px; overflow-x: auto; margin-bottom: 0.4rem; border: 1px solid ${T.border}; }
        .cb-md pre code { background: none; }
        .cb-md strong { font-weight: 700; color: #fff; }
        .cb-md em { font-style: italic; color: ${T.muted}; }
        .cb-suggest-pill:hover:not(:disabled) { background: ${themeColor}25 !important; border-color: ${themeColor}60 !important; color: ${themeColor} !important; }
      `}</style>

      <div className="chatbot-fullpage-wrapper">
        <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", background: T.bg, borderTop: `1px solid ${T.border}`, overflow: "hidden" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
            {[
              { id: "aarya", icon: "🏍️", label: "Aarya Bot", tag: "DEFAULT", color: T.accent },
              { id: "gpt", icon: "🤖", label: "AI Assistant", tag: "GPT-OSS", color: T.orange }
            ].map(t => {
              const active = mode === t.id;
              return (
                <button key={t.id} onClick={() => setMode(t.id)} style={{
                  flex: 1, padding: "0.85rem", border: "none",
                  borderBottom: `3px solid ${active ? t.color : "transparent"}`,
                  background: active ? `${t.color}15` : "transparent",
                  color: active ? t.color : T.muted,
                  fontWeight: active ? 700 : 500, fontSize: "0.88rem",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                  transition: "all 0.2s"
                }}>
                  <span style={{ fontSize: "1.05rem" }}>{t.icon}</span> {t.label}
                  <span style={{ fontSize: "0.65rem", background: active ? t.color : T.border, color: active ? "#fff" : T.muted, borderRadius: "100px", padding: "0.15rem 0.5rem", fontWeight: 700, marginLeft: "0.2rem" }}>{t.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Header */}
          <div style={{ padding: "1rem 1.4rem", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "0.85rem", background: T.surface }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${themeColor}20`, color: themeColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0, border: `1px solid ${themeColor}40` }}>
              {isAarya ? "🏍️" : "🤖"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: T.text }}>{isAarya ? "Aarya Bot — Spare Parts Assistant" : "AI Assistant (GPT-OSS)"}</p>
              <div style={{ fontSize: "0.75rem", color: T.success, display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.success }} />
                {isAarya ? "Connected to live inventory" : "Powered by OpenRouter GPT-OSS"}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((m, i) => {
              const user = m.sender === "You";
              return (
                <div key={i} className="cb-msg-anim" style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start", gap: "0.6rem", alignItems: "flex-end" }}>
                  {!user && <div style={{ width: "30px", height: "30px", borderRadius: "6px", background: `${themeColor}20`, border: `1px solid ${themeColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{isAarya ? "🏍️" : "🤖"}</div>}
                  <div className={!user ? "cb-md" : ""} style={{
                    maxWidth: "75%", padding: "0.85rem 1.1rem",
                    borderRadius: user ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: user ? `${themeColor}20` : T.card,
                    border: `1px solid ${user ? `${themeColor}40` : T.border}`,
                    color: user ? T.text : T.text, fontSize: "0.9rem", lineHeight: 1.6, wordBreak: "break-word",
                  }}>
                    {!user ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown> : m.text}
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="cb-msg-anim" style={{ display: "flex", justifyContent: "flex-start", gap: "0.6rem", alignItems: "flex-end" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "6px", background: `${themeColor}20`, border: `1px solid ${themeColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{isAarya ? "🏍️" : "🤖"}</div>
                <div style={{ padding: "0.9rem 1.2rem", borderRadius: "12px 12px 12px 2px", background: T.card, border: `1px solid ${T.border}`, display: "flex", gap: "0.35rem" }}>
                  {[0, 0.2, 0.4].map(d => <span key={d} style={{ width: "6px", height: "6px", borderRadius: "50%", background: themeColor, animation: `typingBounce 1.4s infinite ease-in-out ${d}s` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: "0.6rem 1.4rem", display: "flex", flexWrap: "wrap", gap: "0.45rem", background: T.surface, borderTop: `1px solid ${T.border}`, alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: T.muted, fontWeight: 600, marginRight: "0.2rem" }}>💬 Try:</span>
            {suggestions.map((s, i) => (
              <button key={i} className="cb-suggest-pill" onClick={() => !isTyping && sendMessage(s)} disabled={isTyping} style={{
                padding: "0.35rem 0.8rem", borderRadius: "100px", border: `1px solid ${T.border}`,
                background: T.card, color: T.text, fontSize: "0.76rem", fontWeight: 500,
                cursor: isTyping ? "not-allowed" : "pointer", opacity: isTyping ? 0.5 : 1, transition: "all 0.15s"
              }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{ padding: "1rem 1.4rem", background: T.surface, borderTop: `1px solid ${T.border}`, display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={isAarya ? "Ask about parts, prices, timings..." : "Ask any automotive question..."}
              autoFocus style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", color: T.text, padding: "0.85rem 1.1rem", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.currentTarget.style.borderColor = themeColor} onBlur={e => e.currentTarget.style.borderColor = T.border}
            />
            <button type="submit" disabled={!input.trim() || isTyping} style={{
              background: !input.trim() || isTyping ? T.bg : themeColor,
              color: !input.trim() || isTyping ? T.muted : "#fff",
              border: `1px solid ${!input.trim() || isTyping ? T.border : themeColor}`,
              borderRadius: "8px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: !input.trim() || isTyping ? "not-allowed" : "pointer", fontSize: "1.1rem", transition: "all 0.2s"
            }}>➤</button>
          </form>

        </div>
      </div>
    </Sidebar>
  );
}

export default ChatBot;