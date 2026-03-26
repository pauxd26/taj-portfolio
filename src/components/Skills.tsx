"use client";

import { useRef, useEffect, useState } from "react";

const categories = [
  {
    title: "AI & Agents",
    icon: "🤖",
    span: "md:col-span-2",
    skills: [
      "LangChain", "LangGraph", "CrewAI", "AutoGen", "AutoGPT",
      "MCP", "Agentic RAG", "GraphRAG", "LangSmith", "Multi-Agent Orchestration",
      "Prompt Engineering",
    ],
  },
  {
    title: "ML & Deep Learning",
    icon: "🧠",
    span: "",
    skills: [
      "PyTorch", "TensorFlow", "Keras", "scikit-learn", "spaCy",
      "NLP", "LoRA / QLoRA", "Reinforcement Learning", "Neural Networks",
      "MLOps / LLMOps",
    ],
  },
  {
    title: "Languages & Frameworks",
    icon: "⚡",
    span: "",
    skills: [
      "Python", "Golang", "TypeScript", "JavaScript", "Django",
      "FastAPI", "Flask", "Node.js", "Next.js", "React", "Angular",
    ],
  },
  {
    title: "Data & Infrastructure",
    icon: "🗄️",
    span: "md:col-span-2",
    skills: [
      "Snowflake", "Databricks", "Spark", "Kafka", "Airflow",
      "BigQuery", "Neo4j", "Redis", "Pinecone", "Elasticsearch",
      "ChromaDB", "PostgreSQL",
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "☁️",
    span: "",
    skills: [
      "AWS", "Azure", "GCP", "Kubernetes", "Docker",
      "Terraform", "CI/CD", "Microsoft Fabric", "Copilot Studio",
      "Azure Data Lake",
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section id="skills" className="py-28 px-6 section-glow">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            What I Work With
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Technical Skills
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`glass-card glow rounded-2xl p-6 transition-all duration-500 ${cat.span} ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="tag-pill px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg border border-white/5 cursor-default"
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
