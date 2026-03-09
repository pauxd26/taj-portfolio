"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getPusherClient } from "@/lib/pusher-client";

interface Message {
  role: "user" | "assistant" | "system" | "taj";
  content: string;
}

interface AgentStep {
  agent: string;
  status: "running" | "complete";
  detail: string;
  tool_name?: string;
  tool_input?: Record<string, string>;
  tool_result?: string;
}

type ChatMode = "ai" | "connecting" | "live";

const AGENT_COLORS: Record<string, string> = {
  Classifier: "text-yellow-400",
  Router: "text-blue-400",
  Executor: "text-purple-400",
  Responder: "text-emerald-400",
};

const AGENT_ICONS: Record<string, string> = {
  Classifier: "🔍",
  Router: "🔀",
  Executor: "⚡",
  Responder: "💬",
};

const SUGGESTED_QUESTIONS = [
  "What is Taj's experience?",
  "Show me his side projects",
  "Schedule a meeting",
  "Talk to Taj directly",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [showPipeline, setShowPipeline] = useState(true);
  const [mode, setMode] = useState<ChatMode>("ai");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tajTyping, setTajTyping] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, steps, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Subscribe to Pusher channel when in live or connecting mode
  useEffect(() => {
    if (!sessionId || mode === "ai") return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`chat-${sessionId}`);

    channel.bind("new-message", (data: { role: string; content: string }) => {
      if (data.role === "taj") {
        setMessages((prev) => [...prev, { role: "taj", content: data.content }]);
        setTajTyping(false);
      }
    });

    channel.bind("typing", (data: { role: string }) => {
      if (data.role === "taj") {
        setTajTyping(true);
        setTimeout(() => setTajTyping(false), 3000);
      }
    });

    channel.bind("admin-joined", () => {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Taj has joined the chat!" },
      ]);
    });

    channel.bind("session-ended", () => {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Taj has ended the chat. Switching back to AI assistant." },
      ]);
      setMode("ai");
      setSessionId(null);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${sessionId}`);
    };
  }, [mode, sessionId]);

  const startLiveChat = async (name: string) => {
    setShowNamePrompt(false);
    setMode("connecting");
    setMessages((prev) => [
      ...prev,
      { role: "system", content: `Connecting you with Taj... He'll be notified by email. Please wait.` },
    ]);

    try {
      const res = await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", visitorName: name }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      setMode("live");
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Connected! Taj has been notified. You can start typing — he'll see your messages in real-time." },
      ]);
    } catch {
      setMode("ai");
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Failed to start live chat. Staying with AI assistant." },
      ]);
    }
  };

  const sendLiveMessage = async (text: string) => {
    if (!sessionId || !text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    await fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "message",
        sessionId,
        role: "visitor",
        content: text,
      }),
    });
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    // Check if user wants to talk to Taj
    if (mode === "ai" && msg.toLowerCase().match(/talk to taj|chat with taj|speak to taj|connect me|live chat|real person|human/)) {
      setShowNamePrompt(true);
      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setInput("");
      return;
    }

    // Live mode — send via Pusher
    if (mode === "live") {
      sendLiveMessage(msg);
      return;
    }

    // AI mode
    const userMsg: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSteps([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role === "user" || m.role === "assistant"),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "step") {
              setSteps((prev) => {
                const existing = prev.findIndex(
                  (s) => s.agent === data.step.agent && s.status === "running"
                );
                if (existing >= 0 && data.step.status === "complete") {
                  const updated = [...prev];
                  updated[existing] = data.step;
                  return updated;
                }
                return [...prev, data.step];
              });
            } else if (data.type === "message") {
              setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const exitLiveChat = () => {
    if (sessionId) {
      fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", sessionId }),
      });
    }
    setMode("ai");
    setSessionId(null);
    setMessages((prev) => [
      ...prev,
      { role: "system", content: "Switched back to AI assistant." },
    ]);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 3 seconds if chat hasn't been opened
  useEffect(() => {
    if (open) { setShowTooltip(false); return; }
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <>
      {/* Floating button with attention effects */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip bubble */}
        {showTooltip && !open && (
          <div
            className="absolute bottom-full right-0 mb-3 animate-fade-in-up cursor-pointer"
            onClick={() => { setShowTooltip(false); setOpen(true); }}
          >
            <div className="bg-white text-gray-900 text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap relative">
              Hey! Ask me anything about Taj
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 rounded-sm" />
            </div>
          </div>
        )}

        {/* Ping/pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] animate-ping opacity-20" />
        )}

        <button
          onClick={() => { setOpen(!open); setShowTooltip(false); }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            open
              ? "bg-[var(--color-surface-lighter)] rotate-45"
              : "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-xl hover:shadow-[var(--color-primary)]/25 hover:scale-110 animate-bounce-subtle"
          }`}
          aria-label="Toggle chat"
        >
          {open ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[var(--color-surface)]">
          {/* Header */}
          <div className={`px-4 py-3 border-b border-white/5 ${
            mode === "live"
              ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
              : "bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    mode === "live" ? "bg-emerald-400" : "bg-emerald-400"
                  }`} />
                  {mode === "live" ? "Live Chat with Taj" : mode === "connecting" ? "Connecting..." : "Taj's AI Assistant"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {mode === "live" ? "Real-time conversation" : "Multi-Agent Pipeline"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {mode === "live" && (
                  <button
                    onClick={exitLiveChat}
                    className="text-xs px-2 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    End Chat
                  </button>
                )}
                {mode === "ai" && (
                  <button
                    onClick={() => setShowPipeline(!showPipeline)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${
                      showPipeline
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary-light)]"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {showPipeline ? "Pipeline ON" : "Pipeline OFF"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    Hi! I&apos;m Taj&apos;s AI assistant, built with a{" "}
                    <span className="text-[var(--color-primary-light)]">multi-agent architecture</span>.
                    I can answer questions about his experience, skills, and projects.
                  </p>
                  <p className="text-xs text-gray-500">
                    You can also request to <strong className="text-emerald-400">talk to Taj directly</strong> via live chat.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                  {["Classifier", "Router", "Executor", "Responder"].map((agent, i) => (
                    <span key={agent} className="flex items-center gap-1">
                      {i > 0 && <span className="text-gray-700">→</span>}
                      <span className={`${AGENT_COLORS[agent]} opacity-50`}>
                        {AGENT_ICONS[agent]} {agent}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600 text-center">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          if (q === "Talk to Taj directly") {
                            setShowNamePrompt(true);
                          } else if (q === "Schedule a meeting") {
                            window.open("https://calendly.com/taj479505/30min", "_blank");
                          } else {
                            sendMessage(q);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/5 ${
                          q === "Talk to Taj directly"
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                            : q === "Schedule a meeting"
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] hover:bg-[var(--color-primary)]/20 border-[var(--color-primary)]/20"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Name prompt for live chat */}
            {showNamePrompt && (
              <div className="glass-card rounded-xl p-4 space-y-3">
                <p className="text-sm text-gray-300">
                  What&apos;s your name? Taj will be notified you want to chat.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    startLiveChat(visitorName || "Anonymous");
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your name..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                </form>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "system" ? (
                  <div className="text-center">
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                ) : (
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "taj" && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                        <span className="text-xs">T</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[var(--color-primary)] text-white rounded-br-md"
                          : msg.role === "taj"
                          ? "bg-emerald-500/15 text-gray-200 rounded-bl-md border border-emerald-500/20"
                          : "glass-card text-gray-300 rounded-bl-md"
                      }`}
                    >
                      <MessageContent content={msg.content} />
                    </div>
                  </div>
                )}

                {/* Pipeline steps */}
                {msg.role === "user" && mode === "ai" && showPipeline && steps.length > 0 &&
                  (i === messages.length - 1 || i === messages.length - 2) && (
                  <div className="mt-3 mb-2">
                    <AgentPipeline steps={steps} />
                  </div>
                )}
              </div>
            ))}

            {/* Loading pipeline */}
            {loading && showPipeline && steps.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="mt-1">
                <AgentPipeline steps={steps} />
              </div>
            )}

            {/* Taj typing indicator */}
            {tajTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs">T</span>
                </div>
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* AI loading indicator */}
            {loading && steps.length === 0 && (
              <div className="flex justify-start">
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Persistent "Talk to Taj" banner — always visible in AI mode */}
          {mode === "ai" && !showNamePrompt && (
            <div className="px-4 pt-2">
              <button
                onClick={() => setShowNamePrompt(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-medium group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Talk to Taj directly — Live Chat
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="px-4 py-3 border-t border-white/5 bg-[var(--color-surface-light)]/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "live" ? "Message Taj..." : "Ask about Taj's experience..."}
                disabled={loading || mode === "connecting"}
                className={`flex-1 bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 disabled:opacity-50 transition-colors ${
                  mode === "live"
                    ? "border-emerald-500/20 focus:border-emerald-500/50 focus:ring-emerald-500/25"
                    : "border-white/10 focus:border-[var(--color-primary)]/50 focus:ring-[var(--color-primary)]/25"
                }`}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || mode === "connecting"}
                className={`px-4 py-2.5 disabled:opacity-30 text-white rounded-xl transition-colors ${
                  mode === "live"
                    ? "bg-emerald-500 hover:bg-emerald-600 disabled:hover:bg-emerald-500"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:hover:bg-[var(--color-primary)]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AgentPipeline({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="glass-card rounded-xl p-3 space-y-1.5">
      <p className="text-[10px] text-gray-600 uppercase tracking-wider font-mono mb-1">Agent Pipeline</p>
      {steps.map((step, i) => (
        <div key={`${step.agent}-${i}`} className="flex items-start gap-2">
          <span className="text-xs mt-0.5">
            {step.status === "running" ? (
              <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin text-[var(--color-primary)]" />
            ) : (
              <span className="text-emerald-400">✓</span>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs">{AGENT_ICONS[step.agent]}</span>
              <span className={`text-xs font-medium ${AGENT_COLORS[step.agent]}`}>{step.agent}</span>
              <span className="text-[10px] text-gray-600 truncate">{step.detail}</span>
            </div>
            {step.tool_name && (
              <div className="mt-1 ml-5 text-[10px] font-mono text-gray-600 bg-white/3 rounded px-2 py-0.5">
                {step.tool_name}({step.tool_input ? Object.values(step.tool_input).join(", ") : ""})
                {step.tool_result && (
                  <span className="block text-gray-500 mt-0.5 truncate">→ {step.tool_result.substring(0, 80)}...</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        let processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)] underline underline-offset-2">$1</a>');
        if (line.startsWith("- ")) {
          processed = `<span class="text-[var(--color-accent)]">•</span> ${processed.slice(2)}`;
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} className={line.startsWith("- ") ? "pl-1" : ""} />;
      })}
    </div>
  );
}
