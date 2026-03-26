"use client";

import { useRef, useEffect, useState } from "react";

const projects = [
  {
    title: "Lextar AI - Governance-Grade Legal Reasoning Platform",
    period: "2026 - Present",
    description:
      "Full-stack legal AI SaaS platform with hybrid GraphRAG retrieval (1,300+ node knowledge graph + vector search), 11-step structured legal reasoning pipeline, multi-tenant RBAC, real-time streaming analysis workspace, and governance-grade output verification for Canadian and US immigration law.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "ChromaDB", "DeepSeek", "GraphRAG", "Clerk", "Stripe", "SSE"],
    url: "https://www.lextarai.com/",
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    title: "HPE Private Cloud AI & NVIDIA AI Computing",
    period: "2024 - 2025",
    description:
      "Multi-agent Plan-and-Execute architectures, Router Agents, MCP server integrations, HITL checkpoints, semantic caching, shadow deployment pipelines, and LLM evaluation frameworks for HPE's enterprise AI platform.",
    tags: ["LangGraph", "MCP", "NVIDIA NIM", "RAG", "Multi-Agent", "LangSmith", "DeepEval", "GPT-4", "Llama 2"],
    url: "https://www.hpe.com/us/en/private-cloud-ai.html",
    color: "from-indigo-500/20 to-cyan-500/20",
  },
  {
    title: "HPE Ezmeral Unified Analytics & Data Fabric",
    period: "2023 - 2024",
    description:
      "Fine-tuned LLMs with QLoRA on GPU clusters, multi-region Kafka replication, NER pipelines, multi-agent memory systems, and multi-LoRA inference serving across Kubernetes-based ML platform.",
    tags: ["Spark", "Kafka", "Kubernetes", "spaCy", "Keras", "Bi-LSTM", "PyTorch", "QLoRA", "vLLM"],
    url: "https://developer.hpe.com/platform/hpe-ezmeral/home/",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "HPE GreenLake Cloud & OpsRamp AIOps",
    period: "2023 - 2025",
    description:
      "Migrated monolithic services to microservices, high-concurrency event-driven APIs, MCP-compliant tool registries, SQL-generating agents, and GIL/integration bottleneck resolution.",
    tags: ["Django", "FastAPI", "Docker", "Kubernetes", "MCP", "Agentic AI", "Celery", "Redis"],
    url: "https://www.hpe.com/us/en/greenlake.html",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Adobe Experience Platform & Sensei ML",
    period: "2019 - 2023",
    description:
      "High-throughput ETL/search pipelines, CDC-based vector sync, embedding drift management, synthetic data generation, inference optimization, and A/B testing frameworks.",
    tags: ["Spark", "Kafka", "Debezium", "Pinecone", "Elasticsearch", "Grafana", "GPT-3.5", "NVIDIA A100"],
    url: "https://experience.adobe.com/",
    color: "from-red-500/20 to-orange-500/20",
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

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section id="projects" className="py-28 px-6 section-glow">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            Enterprise Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className={`glass-card glow rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 group ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white pr-4 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
                      {p.title}
                      <svg className="w-3.5 h-3.5 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ) : (
                    <h3 className="text-lg font-semibold text-white pr-4">{p.title}</h3>
                  )}
                  <span className="text-xs text-gray-500 font-mono whitespace-nowrap mt-1">
                    {p.period}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="tag-pill px-2.5 py-1 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] rounded-md border border-[var(--color-primary)]/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
