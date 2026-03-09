"use client";

import { useRef, useEffect, useState } from "react";

const degrees = [
  {
    school: "Santa Clara University",
    degree: "Master of Computer Science",
    period: "Aug 2019 - Jun 2020",
  },
  {
    school: "Santa Clara University",
    degree: "Bachelor of Computer Science",
    period: "Sep 2015 - Jun 2019",
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

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section id="education" className="py-28 px-6 section-glow">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            Academic Background
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Education
          </h2>
        </div>
        <div className="space-y-4">
          {degrees.map((d, i) => (
            <div
              key={d.degree}
              className={`glass-card glow rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white">{d.degree}</h3>
                <p className="gradient-text font-medium mt-1">{d.school}</p>
              </div>
              <span className="text-sm text-gray-500 font-mono mt-2 md:mt-0 bg-white/5 px-3 py-1 rounded-lg">
                {d.period}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
