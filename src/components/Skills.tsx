const categories = [
  {
    title: "AI & Agents",
    skills: [
      "LangChain",
      "LangGraph",
      "CrewAI",
      "AutoGen",
      "AutoGPT",
      "MCP",
      "Agentic RAG",
      "LangSmith",
      "Multi-Agent Orchestration",
      "Prompt Engineering",
    ],
  },
  {
    title: "ML & Deep Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "spaCy",
      "NLP",
      "LoRA / QLoRA",
      "Reinforcement Learning",
      "Neural Networks",
      "MLOps / LLMOps",
    ],
  },
  {
    title: "Languages & Frameworks",
    skills: [
      "Python",
      "Golang",
      "TypeScript",
      "JavaScript",
      "Django",
      "FastAPI",
      "Flask",
      "Node.js",
      "React",
      "Angular",
    ],
  },
  {
    title: "Data & Infrastructure",
    skills: [
      "Snowflake",
      "Databricks",
      "Spark",
      "Kafka",
      "Airflow",
      "BigQuery",
      "Neo4j",
      "Redis",
      "Pinecone",
      "Elasticsearch",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Kubernetes",
      "Docker",
      "Terraform",
      "CI/CD",
      "Microsoft Fabric",
      "Copilot Studio",
      "Azure Data Lake",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Technical Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-[var(--color-surface-light)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-primary)]/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-sm bg-[var(--color-surface)] text-slate-300 rounded-full border border-white/5"
                  >
                    {s}
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
