"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getPusherClient } from "@/lib/pusher-client";

interface ChatMessage {
  role: string;
  content: string;
  timestamp: number;
}

interface SessionInfo {
  id: string;
  visitorName: string;
  messageCount: number;
  lastMessage?: ChatMessage;
}

function AdminChatInner() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const secretParam = searchParams.get("secret");

  const [authenticated, setAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState(secretParam || "");
  const [secret, setSecret] = useState(secretParam || "");
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(sessionParam || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-authenticate if secret is in URL
  useEffect(() => {
    if (secretParam) {
      setSecret(secretParam);
      setAuthenticated(true);
    }
  }, [secretParam]);

  // Load sessions
  useEffect(() => {
    if (!authenticated) return;
    const loadSessions = async () => {
      const res = await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-sessions", secret }),
      });
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    };
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, [authenticated, secret]);

  // Subscribe to admin notifications for new sessions
  useEffect(() => {
    if (!authenticated) return;
    const pusher = getPusherClient();
    const channel = pusher.subscribe("admin-notifications");
    channel.bind("new-session", (data: { sessionId: string; visitorName: string }) => {
      setSessions((prev) => [
        { id: data.sessionId, visitorName: data.visitorName, messageCount: 0 },
        ...prev,
      ]);
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-notifications");
    };
  }, [authenticated]);

  // Subscribe to active session messages
  useEffect(() => {
    if (!activeSession) return;

    // Load existing messages and notify visitor that Taj joined
    fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-messages", sessionId: activeSession }),
    })
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []));

    // Notify visitor that Taj has joined
    fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", sessionId: activeSession }),
    });

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`chat-${activeSession}`);

    channel.bind("new-message", (data: ChatMessage) => {
      if (data.role === "visitor") {
        setMessages((prev) => [...prev, data]);
        setVisitorTyping(false);
      }
    });

    channel.bind("typing", (data: { role: string }) => {
      if (data.role === "visitor") {
        setVisitorTyping(true);
        setTimeout(() => setVisitorTyping(false), 3000);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${activeSession}`);
    };
  }, [activeSession]);

  const sendMessage = async () => {
    if (!input.trim() || !activeSession) return;
    const content = input.trim();
    setInput("");

    const msg: ChatMessage = { role: "taj", content, timestamp: Date.now() };
    setMessages((prev) => [...prev, msg]);

    await fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", sessionId: activeSession, role: "taj", content }),
    });
  };

  const sendTyping = () => {
    if (!activeSession) return;
    fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "typing", sessionId: activeSession, role: "taj" }),
    });
  };

  const endSession = async () => {
    if (!activeSession) return;
    await fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "end", sessionId: activeSession }),
    });
    setActiveSession(null);
    setMessages([]);
    setSessions((prev) => prev.filter((s) => s.id !== activeSession));
  };

  const authenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setSecret(secretInput);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">
        <form onSubmit={authenticate} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-white text-center">Admin Chat</h1>
          <p className="text-sm text-gray-500 text-center">Enter your admin secret to access live chats.</p>
          <input
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            type="password"
            placeholder="Admin secret..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Sidebar — Session list */}
      <div className="w-72 border-r border-white/5 flex flex-col">
        <div className="px-4 py-4 border-b border-white/5">
          <h1 className="text-lg font-bold">Live Chats</h1>
          <p className="text-xs text-gray-500 mt-1">{sessions.length} active session{sessions.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-600">No active sessions.</p>
              <p className="text-xs text-gray-700 mt-1">Waiting for visitors...</p>
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSession(s.id);
                  setMessages([]);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                  activeSession === s.id ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : "hover:bg-white/5"
                }`}
              >
                <p className="text-sm font-medium text-white">{s.visitorName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {s.messageCount} message{s.messageCount !== 1 ? "s" : ""}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeSession ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {sessions.find((s) => s.id === activeSession)?.visitorName || "Visitor"}
                </h2>
                <p className="text-xs text-gray-500 font-mono">{activeSession}</p>
              </div>
              <button
                onClick={endSession}
                className="px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                End Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "taj" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "taj"
                        ? "bg-indigo-500 text-white rounded-br-md"
                        : "bg-white/10 text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {visitorTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="text-xs text-gray-400 mr-2">typing</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/5">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    sendTyping();
                  }}
                  placeholder="Reply to visitor..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 text-white rounded-xl font-medium transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Select a session to start chatting</p>
              <p className="text-xs text-gray-700 mt-2">
                Or wait for a visitor to request a live chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Loading...</div>}>
      <AdminChatInner />
    </Suspense>
  );
}
