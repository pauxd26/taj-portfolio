export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Get in Touch
        </h2>
        <p className="text-slate-400 mb-10">
          I&apos;m always open to discussing new opportunities in Agentic AI,
          Multi-Agent Systems, and production ML engineering.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="mailto:taj479505@gmail.com"
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg font-medium transition-colors"
          >
            taj479505@gmail.com
          </a>
          <a
            href="tel:+14083802726"
            className="px-6 py-3 border border-slate-600 hover:border-[var(--color-primary)] text-slate-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            +1 408 380 2726
          </a>
        </div>
        <div className="flex justify-center gap-6 mt-8">
          <a
            href="https://www.linkedin.com/in/taj-khunkhun-a46972339"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[var(--color-primary)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/pauxd26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[var(--color-primary)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
