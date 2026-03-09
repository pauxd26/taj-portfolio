"use client";

import { useRef, useEffect, useState } from "react";

const sideProjects = [
  {
    title: "Agentic AI Chat Analyzer",
    description:
      "AI-powered platform for analyzing agent chat transcripts. Performs exploratory data analysis, LLM-based summarization, and sentiment classification through an interactive Streamlit frontend.",
    tags: ["FastAPI", "Streamlit", "HuggingFace", "Flan-T5", "RoBERTa", "Docker", "Pandas"],
    features: [
      "Modular data pipeline (ingestion, cleaning, transformation)",
      "EDA with word clouds and sentiment visualizations",
      "Model caching for offline operation",
    ],
    github: "https://github.com/pauxd26/agentic-ai-chat-analyzer",
    stars: 1,
  },
  {
    title: "AI Recruiter",
    description:
      "Intelligent recruitment platform that automates candidate discovery by scanning GitHub profiles and Google Scholar to identify qualified AI/ML professionals with relevance scoring.",
    tags: ["Python", "Flask", "Web Scraping", "Docker", "NLP"],
    features: [
      "Multi-source profile analysis (GitHub + Google Scholar)",
      "Relevance-based intelligence scoring for AI/ML skills",
      "Geographic filtering and co-author extraction",
    ],
    github: "https://github.com/pauxd26/ai-recruiter",
    stars: 2,
  },
  {
    title: "AI Email Agent (Supervisor Mode)",
    description:
      "Email automation system using supervisor-pattern multi-agent architecture that categorizes emails, generates RAG-powered responses, proofreads with AI, and sends replies via Gmail.",
    tags: ["LangChain", "LangGraph", "Groq", "Llama 3.3", "ChromaDB", "Gmail API", "FastAPI"],
    features: [
      "Supervisor pattern for dynamic agent coordination",
      "RAG-powered response generation from knowledge base",
      "AI proofreading layer before sending",
    ],
    github: "https://github.com/pauxd26/ai-email-agent",
    stars: 0,
  },
  {
    title: "Simple Chatbot",
    description:
      "Lightweight, rule-based chatbot with Gradio UI that answers questions about healthcare automation agents using fuzzy string matching -- no external LLM calls required.",
    tags: ["Python", "Gradio", "NLP", "Fuzzy Matching"],
    features: [
      "Weighted scoring: string similarity (60%) + keyword matching (40%)",
      "Confidence threshold for answer selection",
      "Graceful fallback responses listing available topics",
    ],
    github: "https://github.com/pauxd26/SimpleChatbot",
    stars: 0,
  },
];

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

export default function SideProjects() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section id="side-projects" className="py-28 px-6 section-glow">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            Open Source
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Side Projects
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Personal projects exploring agentic AI patterns, multi-agent architectures, and intelligent automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sideProjects.map((p, i) => (
            <a
              key={p.title}
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card glow rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 group block ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* GitHub icon */}
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white group-hover:gradient-text transition-colors">
                    {p.title}
                  </h3>
                </div>
                {p.stars > 0 && (
                  <span className="flex items-center gap-1 text-xs text-yellow-500/80 font-mono">
                    &#9733; {p.stars}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {p.description}
              </p>

              <ul className="space-y-1.5 mb-5">
                {p.features.map((f, j) => (
                  <li key={j} className="text-xs text-gray-500 flex gap-2">
                    <span className="text-[var(--color-accent)] shrink-0">&#9656;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="tag-pill px-2.5 py-1 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] rounded-md border border-[var(--color-accent)]/15"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                <span>View on GitHub</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
