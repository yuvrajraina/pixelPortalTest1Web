import { process } from "../data/siteData";

export default function ProcessSection() {
  return (
    <section className="process-section section-shell" aria-labelledby="process-title">
      <div className="process-head" data-reveal>
        <div className="section-label">
          <span className="chapter">03</span>
          <span>How we work</span>
        </div>
        <h2 id="process-title">Let's do great work together</h2>
      </div>

      <div className="process-grid">
        {process.map((item, index) => (
          <article className="process-card" data-reveal key={item}>
            <span>Step {index + 1}</span>
            <h3>{item}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
