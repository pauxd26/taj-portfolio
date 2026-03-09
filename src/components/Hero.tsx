import Image from "next/image";
import ParticleNetwork from "./ParticleNetwork";

export default function Hero() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center pt-20 px-6 hero-gradient relative overflow-hidden"
    >
      {/* Interactive particle network background */}
      <ParticleNetwork />

      {/* Floating ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Profile image with glow ring */}
        <div className="mb-10 animate-fade-in-up opacity-0">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] blur-xl opacity-20 scale-110" />
            <Image
              src="/profile.png"
              alt="Taj Khunkhun"
              width={180}
              height={180}
              className="rounded-full relative border-2 border-white/10 shadow-2xl"
              priority
            />
          </div>
        </div>

        <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-6 animate-fade-in-up opacity-0 animate-delay-100">
          Senior AI Engineer
        </p>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 animate-fade-in-up opacity-0 animate-delay-200 tracking-tight">
          Taj{" "}
          <span className="gradient-text">Khunkhun</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4 animate-fade-in-up opacity-0 animate-delay-300">
          Transforming experimental prototypes into production-grade agentic AI
          systems. 8+ years in backend systems, specializing in Multi-Agent
          Orchestration and Autonomous Reasoners.
        </p>

        <p className="text-sm text-gray-500 font-mono mb-10 animate-fade-in-up opacity-0 animate-delay-400">
          LangGraph &middot; CrewAI &middot; AutoGen &middot; MCP &middot; RAG
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up opacity-0 animate-delay-500">
          <a
            href="https://calendly.com/taj479505/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/25 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule a Meeting
          </a>
          <a
            href="/api/resume"
            download="Taj_Khunkhun_Resume.pdf"
            className="px-8 py-3.5 glass-card rounded-xl text-gray-300 hover:text-white font-medium transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
          <a
            href="#experience"
            className="px-8 py-3.5 glass-card rounded-xl text-gray-300 hover:text-white font-medium transition-all hover:-translate-y-0.5"
          >
            View My Work
          </a>
          <a
            href="https://www.linkedin.com/in/taj-khunkhun-a46972339"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 glass-card rounded-xl text-gray-300 hover:text-white font-medium transition-all hover:-translate-y-0.5"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/pauxd26"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 glass-card rounded-xl text-gray-300 hover:text-white font-medium transition-all hover:-translate-y-0.5"
          >
            GitHub
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 animate-bounce opacity-0 animate-fade-in-up animate-delay-600">
          <svg
            className="w-5 h-5 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
