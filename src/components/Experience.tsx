const jobs = [
  {
    company: "Hewlett Packard Enterprise",
    role: "Senior AI Engineer | Agentic AI Engineer",
    location: "Spring, Texas (Remote)",
    period: "Jan 2023 - Dec 2025",
    projects: [
      {
        name: "HPE Private Cloud AI - NVIDIA AI Computing by HPE",
        period: "2024-2025",
        highlights: [
          "Designed multi-agent Plan-and-Execute architecture using LangGraph, reducing infinite loop failures by 35% through state-machine transitions.",
          "Architected an MCP server layer to standardize tool integration across multi-agent workflows, reducing custom tool-binding code by 60%.",
          "Reduced production inference costs by 45% on NVIDIA NIM microservices via a Router Agent dynamically triaging between Llama 2 7B and GPT-4.",
          "Implemented HITL checkpoint system for high-stakes financial workflows with 0.85 confidence threshold.",
          "Built real-time observability dashboards using LangSmith and Arize Phoenix, resolving 10s+ latency bottlenecks.",
          "Architected LLM evaluation framework using DeepEval and LLM-as-a-Judge across 5,000+ test cases.",
          "Reduced LLM inference costs by 52% and p95 latency by 300ms through semantic caching with Redis.",
        ],
      },
      {
        name: "HPE Ezmeral Unified Analytics & Data Fabric",
        period: "2023-2024",
        highlights: [
          "Eliminated catastrophic forgetting in Llama 2 by mixing 15% pre-training replay data with proprietary instruction sets.",
          "Reduced training VRAM by 65% using QLoRA 4-bit quantization, enabling 70B parameter model fine-tuning.",
          "Improved inference throughput by 4x via multi-LoRA serving framework (vLLM/LoRAX) for 10+ specialized adapters.",
          "Architected multi-region Kafka deployment with sub-second cross-region replication latency.",
          "Engineered tiered memory system (Redis + Postgres) preserving intent across 20+ agent handoffs.",
        ],
      },
      {
        name: "HPE GreenLake Cloud Platform & OpsRamp AIOps",
        period: "2023-2025",
        highlights: [
          "Led migration from monolithic Django to Microservices architecture using Docker and Kubernetes.",
          "Engineered high-concurrency event-driven architecture using FastAPI handling 10k+ concurrent WebSocket connections.",
          "Built MCP-compliant tool registry for OpsRamp AIOps copilot enabling dynamic tool discovery at runtime.",
          "Architected Self-Correction loop for SQL-generating agent, reducing syntax errors by 50%.",
          "Built NER pipeline with Keras Bi-LSTM in spaCy v3.x, achieving 25% F1-score improvement.",
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
          "Architected high-throughput ETL pipeline processing 5TB+ of multi-modal data using Spark.",
          "Eliminated vector-relational desynchronization via CDC workflow (Debezium + Kafka) with 99.9% consistency.",
          "Engineered Blue-Green re-indexing for zero-downtime embedding migrations across 50M+ vectors.",
          "Optimized semantic search retrieval by 40% via hierarchical document indexing and semantic overlap.",
          "Reduced vector storage costs by $8k/month through tiered data strategy.",
        ],
      },
      {
        name: "Adobe Sensei ML Framework & Content Intelligence",
        period: "2020-2023",
        highlights: [
          "Deployed automated Semantic Data Guard monitoring data drift with 15% deviation alerting.",
          "Standardized AI Data Contracts across four engineering teams enforcing GDPR/CCPA compliance.",
          "Reduced inference latency by 65% via model distillation and FP16 serving on NVIDIA A100 GPUs.",
          "Built synthetic data generation engine using SDV and GPT-3.5, improving minority-class tasks by 18%.",
          "Engineered Fail-Soft orchestration layer saving $15k/month in compute costs.",
        ],
      },
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-[var(--color-surface-light)]/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Experience
        </h2>
        <div className="space-y-16">
          {jobs.map((job) => (
            <div key={job.company}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {job.company}
                  </h3>
                  <p className="text-[var(--color-primary)] font-medium">
                    {job.role}
                  </p>
                  <p className="text-sm text-slate-500">{job.location}</p>
                </div>
                <span className="text-sm text-slate-500 mt-2 md:mt-0 font-mono">
                  {job.period}
                </span>
              </div>

              <div className="space-y-8 border-l-2 border-[var(--color-surface-lighter)] pl-6 ml-2">
                {job.projects.map((proj) => (
                  <div key={proj.name}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] -ml-[1.9rem] shrink-0" />
                      <h4 className="text-lg font-semibold text-white">
                        {proj.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        {proj.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {proj.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-400 leading-relaxed pl-1"
                        >
                          <span className="text-[var(--color-primary)] mr-2">
                            &rarr;
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
