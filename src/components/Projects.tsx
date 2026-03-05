const projects = [
  {
    title: "HPE Private Cloud AI & NVIDIA AI Computing",
    period: "2024 - 2025",
    description:
      "Built multi-agent Plan-and-Execute architectures, Router Agents, MCP server integrations, HITL checkpoints, semantic caching, shadow deployment pipelines, and LLM evaluation frameworks for HPE's enterprise AI platform co-engineered with NVIDIA.",
    tags: [
      "LangGraph",
      "MCP",
      "NVIDIA NIM",
      "RAG",
      "Multi-Agent",
      "LangSmith",
      "DeepEval",
      "GPT-4",
      "Llama 2",
      "Redis",
      "FastAPI",
    ],
  },
  {
    title: "HPE Ezmeral Unified Analytics & Data Fabric",
    period: "2023 - 2024",
    description:
      "Fine-tuned LLMs with QLoRA on HPE ProLiant GPU clusters, built multi-region Kafka replication, NER pipelines, multi-agent memory systems, and multi-LoRA inference serving across HPE's Kubernetes-based ML platform.",
    tags: [
      "Spark",
      "Kafka",
      "Kubernetes",
      "spaCy",
      "Keras",
      "Bi-LSTM",
      "PyTorch",
      "QLoRA",
      "vLLM",
      "MLFlow",
    ],
  },
  {
    title: "HPE GreenLake Cloud Platform & OpsRamp AIOps",
    period: "2023 - 2025",
    description:
      "Migrated monolithic services to microservices, built high-concurrency event-driven APIs, MCP-compliant tool registries, SQL-generating agents for AIOps, and resolved GIL/integration bottlenecks for HPE's hybrid cloud platform.",
    tags: [
      "Django",
      "FastAPI",
      "Docker",
      "Kubernetes",
      "MCP",
      "Agentic AI",
      "Celery",
      "Redis",
      "WebSocket",
    ],
  },
  {
    title: "Adobe Experience Platform Pipeline & Sensei ML",
    period: "2019 - 2023",
    description:
      "Built high-throughput ETL/search pipelines, CDC-based vector sync, embedding drift management, synthetic data generation, inference optimization, and A/B testing frameworks for Adobe's globally distributed AI platform.",
    tags: [
      "Spark",
      "Kafka",
      "Debezium",
      "Pinecone",
      "Elasticsearch",
      "Grafana",
      "GPT-3.5",
      "NVIDIA A100",
      "GDPR",
    ],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <div
              key={p.title}
              className="bg-[var(--color-surface-light)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-primary)]/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <span className="text-xs text-slate-500 font-mono whitespace-nowrap ml-3">
                  {p.period}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-md border border-[var(--color-accent)]/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
