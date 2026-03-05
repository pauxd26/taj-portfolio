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

export default function Education() {
  return (
    <section
      id="education"
      className="py-24 px-6 bg-[var(--color-surface-light)]/30"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Education
        </h2>
        <div className="space-y-8">
          {degrees.map((d) => (
            <div
              key={d.degree}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-[var(--color-surface-light)] rounded-xl p-6 border border-white/5"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">{d.degree}</h3>
                <p className="text-[var(--color-primary)]">{d.school}</p>
              </div>
              <span className="text-sm text-slate-500 font-mono mt-2 md:mt-0">
                {d.period}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
