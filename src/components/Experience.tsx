"use client";

import { useRef, useEffect, useState } from "react";

interface Project {
  name: string;
  url?: string;
  videoUrl?: string;
  period: string;
  highlights: string[];
}

interface Job {
  company: string;
  role: string;
  location: string;
  period: string;
  projects: Project[];
}

const jobs: Job[] = [
  {
    company: "Lextar AI Legal Solutions, Inc.",
    role: "Founding AI Engineer",
    location: "Remote",
    period: "Jan 2026 - Present",
    projects: [
      {
        name: "Lextar AI - Governance-Grade Legal Reasoning Platform",
        url: "https://www.lextarai.com/",
        videoUrl: "https://github.com/pauxd26/taj-portfolio/releases/download/v1.0.0/lextar-demo.mp4",
        period: "2026-Present",
        highlights: [
          "Architected a full-stack enterprise legal AI platform for Canadian and US immigration law using FastAPI, Next.js, PostgreSQL, SQLAlchemy, and ChromaDB for hybrid RAG.",
          "Engineered an 11-step lawyer-faithful reasoning pipeline integrating DeepSeek LLM, hierarchical issue framing, conflict resolution, and strict grounding verification.",
          "Built a hybrid GraphRAG retrieval system combining ChromaDB vector search with an in-memory knowledge graph (1,300+ legal nodes, 445 relationships) across 6,200+ ingested chunks.",
          "Implemented multi-tenant SaaS with Clerk authentication, role-based access control, Stripe checkout, PDF invoices, and automated SMTP email receipts.",
          "Designed superadmin dashboard with platform-wide analytics, user management, per-organization usage tracking, and real-time reasoning unit consumption monitoring.",
          "Built real-time streaming legal analysis workspace with SSE, live reasoning trace visualization, and role-specific output formatting.",
          "Implemented strict legal output governance including grounding verification, cross-reference resolution, and confidence-weighted scoring.",
        ],
      },
    ],
  },
  {
    company: "Hewlett Packard Enterprise",
    role: "Senior AI Engineer | Agentic AI Engineer",
    location: "Spring, Texas (Remote)",
    period: "Jan 2023 - Dec 2025",
    projects: [
      {
        name: "HPE Private Cloud AI - NVIDIA AI Computing",
        url: "https://www.hpe.com/us/en/private-cloud-ai.html",
        period: "2024-2025",
        highlights: [
          "Designed multi-agent Plan-and-Execute architecture using LangGraph, reducing infinite loop failures by 35%.",
          "Architected MCP server layer standardizing tool integration, reducing custom tool-binding code by 60%.",
          "Reduced inference costs by 45% via Router Agent dynamically triaging between Llama 2 7B and GPT-4.",
          "Implemented HITL checkpoint system for financial workflows with 0.85 confidence threshold.",
          "Built observability dashboards using LangSmith and Arize Phoenix, resolving 10s+ latency bottlenecks.",
          "Architected LLM evaluation framework using DeepEval across 5,000+ test cases.",
          "Reduced costs by 52% and p95 latency by 300ms through semantic caching with Redis.",
          "Developed Shadow Deployment pipeline for prompt engineering A/B tests on live traffic with 0% user impact.",
          "Designed multi-agent collaboration framework with Planner, Executor, and Critic agents via structured message-passing.",
        ],
      },
      {
        name: "HPE Ezmeral Unified Analytics & Data Fabric",
        url: "https://developer.hpe.com/platform/hpe-ezmeral/home/",
        period: "2023-2024",
        highlights: [
          "Eliminated catastrophic forgetting in Llama 2 by mixing 15% pre-training replay data.",
          "Reduced training VRAM by 65% using QLoRA 4-bit quantization for 70B parameter models.",
          "Improved inference throughput 4x via multi-LoRA serving (vLLM/LoRAX) for 10+ adapters.",
          "Architected multi-region Kafka with sub-second cross-region replication.",
          "Engineered tiered memory system preserving intent across 20+ agent handoffs.",
        ],
      },
      {
        name: "HPE GreenLake Cloud & OpsRamp AIOps",
        url: "https://www.hpe.com/us/en/greenlake.html",
        period: "2023-2025",
        highlights: [
          "Led migration from monolithic Django to Microservices with Docker and Kubernetes.",
          "Built high-concurrency FastAPI architecture handling 10k+ concurrent WebSocket connections.",
          "Built MCP-compliant tool registry enabling dynamic tool discovery at runtime.",
          "Architected Self-Correction loop for SQL agent, reducing syntax errors by 50%.",
          "Built NER pipeline with Keras Bi-LSTM achieving 25% F1-score improvement.",
          "Resolved critical GIL bottlenecks by refactoring to Python Multiprocessing and Celery/Redis worker cluster.",
          "Engineered custom spaCy and Transformer models integrated with Fabric Lakehouse using lazy-loading across Spark clusters.",
        ],
      },
    ],
  },
  {
    company: "Adobe",
    role: "Data & Machine Learning Engineer",
    location: "San Jose, California",
    period: "Aug 2019 - Jan 2023",
    projects: [
      {
        name: "Adobe Experience Platform Pipeline & Data Lake",
        url: "https://experience.adobe.com/",
        period: "2019-2022",
        highlights: [
          "Architected ETL pipeline processing 5TB+ multi-modal data using Spark.",
          "Eliminated vector-relational desync via CDC (Debezium + Kafka) with 99.9% consistency.",
          "Engineered Blue-Green re-indexing for zero-downtime migrations across 50M+ vectors.",
          "Optimized semantic search by 40% via hierarchical document indexing.",
          "Reduced vector storage costs by $8k/month through tiered data strategy.",
        ],
      },
      {
        name: "Adobe Sensei ML Framework & Content Intelligence",
        url: "https://experience.adobe.com/",
        period: "2020-2023",
        highlights: [
          "Deployed Semantic Data Guard monitoring data drift with 15% deviation alerting.",
          "Standardized AI Data Contracts across four teams enforcing GDPR/CCPA compliance.",
          "Reduced inference latency by 65% via model distillation on NVIDIA A100 GPUs.",
          "Built synthetic data engine using SDV and GPT-3.5, improving minority tasks by 18%.",
          "Engineered Fail-Soft orchestration saving $15k/month in compute costs.",
          "Solved multi-modal cold start problem with tiered embedding cache (Redis + Elasticsearch), reducing first-response time from 2.4s to 400ms.",
          "Built programmatic A/B testing framework promoting models based on Ground Truth alignment with statistical significance tests.",
        ],
      },
    ],
  },
];

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{job.company}</h3>
          <p className="gradient-text font-semibold mt-1">{job.role}</p>
          <p className="text-sm text-gray-500 mt-1">{job.location}</p>
        </div>
        <span className="text-sm text-gray-500 mt-2 md:mt-0 font-mono bg-white/5 px-3 py-1 rounded-lg">
          {job.period}
        </span>
      </div>

      <div className="space-y-6 border-l border-[var(--color-surface-lighter)] pl-6 ml-3">
        {job.projects.map((proj) => (
          <div key={proj.name} className="glass-card rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] -ml-[2.05rem] shrink-0 shadow-lg shadow-[var(--color-primary)]/30" />
              {proj.url ? (
                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
                  {proj.name}
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ) : (
                <h4 className="text-base font-semibold text-white">{proj.name}</h4>
              )}
              <span className="text-xs text-gray-500 font-mono">{proj.period}</span>
            </div>
            <ul className="space-y-2">
              {proj.highlights.map((h, i) => (
                <li key={i} className="text-sm text-gray-400 leading-relaxed flex gap-2">
                  <span className="text-[var(--color-accent)] shrink-0 mt-1">&#9656;</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {proj.videoUrl && (
              <div className="mt-5 rounded-xl overflow-hidden border border-white/10">
                <p className="text-xs text-gray-500 font-mono mb-2 px-1">Product Demo</p>
                <video
                  src={proj.videoUrl}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-6 section-glow">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            Where I&apos;ve Worked
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Experience
          </h2>
        </div>
        <div className="space-y-20">
          {jobs.map((job, i) => (
            <JobCard key={job.company} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
