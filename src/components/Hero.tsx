export default function Hero() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center pt-20 px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--color-primary)] font-medium mb-4 animate-fade-in-up opacity-0">
          Hello, I&apos;m
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up opacity-0 animate-delay-100">
          Taj Khunkhun
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-400 mb-8 animate-fade-in-up opacity-0 animate-delay-200">
          Senior AI Engineer &middot; Agentic AI &middot; Multi-Agent
          Orchestration
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up opacity-0 animate-delay-300">
          8+ years in backend systems, 2+ specializing in Agentic Workflows and
          Autonomous Reasoners. I transform experimental prototypes into
          production-grade agentic AI systems using LangGraph, CrewAI, AutoGen,
          and MCP. Passionate about building bounded autonomy&mdash;systems that
          reason through uncertainty but operate within deterministic guardrails.
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up opacity-0 animate-delay-400">
          <a
            href="#experience"
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg font-medium transition-colors"
          >
            View My Work
          </a>
          <a
            href="https://www.linkedin.com/in/taj-khunkhun-a46972339"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-600 hover:border-[var(--color-primary)] text-slate-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/pauxd26"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-600 hover:border-[var(--color-primary)] text-slate-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
