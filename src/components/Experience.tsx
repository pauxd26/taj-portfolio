"use client";

import { useRef, useEffect, useState } from "react";

const jobs = [
  {
    company: "Hewlett Packard Enterprise",
    role: "Senior AI Engineer | Agentic AI Engineer",
    location: "Spring, Texas (Remote)",
    period: "Jan 2023 - Dec 2025",
    projects: [
      {
        name: "HPE Private Cloud AI - NVIDIA AI Computing",
        period: "2024-2025",
        highlights: [
          "Designed multi-agent Plan-and-Execute architecture using LangGraph, reducing infinite loop failures by 35%.",
          "Architected MCP server layer standardizing tool integration, reducing custom tool-binding code by 60%.",
          "Reduced inference costs by 45% via Router Agent dynamically triaging between Llama 2 7B and GPT-4.",
          "Implemented HITL checkpoint system for financial workflows with 0.85 confidence threshold.",
          "Built observability dashboards using LangSmith and Arize Phoenix, resolving 10s+ latency bottlenecks.",
          "Architected LLM evaluation framework using DeepEval across 5,000+ test cases.",
          "Reduced costs by 52% and p95 latency by 300ms through semantic caching with Redis.",
        ],
      },
      {
        name: "HPE Ezmeral Unified Analytics & Data Fabric",
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
        period: "2023-2025",
        highlights: [
          "Led migration from monolithic Django to Microservices with Docker and Kubernetes.",
          "Built high-concurrency FastAPI architecture handling 10k+ concurrent WebSocket connections.",
          "Built MCP-compliant tool registry enabling dynamic tool discovery at runtime.",
          "Architected Self-Correction loop for SQL agent, reducing syntax errors by 50%.",
          "Built NER pipeline with Keras Bi-LSTM achieving 25% F1-score improvement.",
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
        period: "2020-2023",
        highlights: [
          "Deployed Semantic Data Guard monitoring data drift with 15% deviation alerting.",
          "Standardized AI Data Contracts across four teams enforcing GDPR/CCPA compliance.",
          "Reduced inference latency by 65% via model distillation on NVIDIA A100 GPUs.",
          "Built synthetic data engine using SDV and GPT-3.5, improving minority tasks by 18%.",
          "Engineered Fail-Soft orchestration saving $15k/month in compute costs.",
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

function JobCard({ job, index }: { job: typeof jobs[number]; index: number }) {
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
              <h4 className="text-base font-semibold text-white">{proj.name}</h4>
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
