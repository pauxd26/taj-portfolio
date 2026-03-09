"use client";

import { useRef, useEffect, useState } from "react";

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

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section id="contact" className="py-28 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
      </div>

      <div
        className={`max-w-2xl mx-auto text-center relative z-10 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        ref={ref}
      >
        <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
          Let&apos;s Connect
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          I&apos;m always open to discussing new opportunities in Agentic AI,
          Multi-Agent Systems, and production ML engineering.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <a
            href="mailto:taj479505@gmail.com"
            className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/25 hover:-translate-y-0.5"
          >
            taj479505@gmail.com
          </a>
          <a
            href="tel:+14083802726"
            className="px-8 py-3.5 glass-card rounded-xl text-gray-300 hover:text-white font-medium transition-all hover:-translate-y-0.5"
          >
            +1 408 380 2726
          </a>
        </div>

        <div className="flex justify-center gap-8">
          <a
            href="https://www.linkedin.com/in/taj-khunkhun-a46972339"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm font-mono"
          >
            linkedin
          </a>
          <a
            href="https://github.com/pauxd26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm font-mono"
          >
            github
          </a>
        </div>
      </div>
    </section>
  );
}
