import { testimonials } from "../data/siteData";

export default function TestimonialsSection() {
  return (
    <section className="partner-scroll section-shell" id="work" aria-labelledby="partner-title">
      <div className="partner-head" data-reveal>
        <div className="section-label">
          <span className="chapter">02</span>
          <span>Client results</span>
        </div>
        <h2 id="partner-title" data-kinetic-heading>
          <span>Client</span>
          <span>Wins</span>
          <em aria-hidden="true">Wins</em>
        </h2>
        <p>Businesses come to Pixel Portal for practical execution across websites, search, paid media, content, and social growth.</p>
      </div>

      <div className="carousel-controls" data-reveal>
        <button
          className="carousel-button magnetic"
          type="button"
          aria-label="Previous client win"
          data-carousel-control
          data-carousel-target="#client-wins-track"
          data-carousel-direction="-1"
        >
          &larr;
        </button>
        <button
          className="carousel-button magnetic"
          type="button"
          aria-label="Next client win"
          data-carousel-control
          data-carousel-target="#client-wins-track"
          data-carousel-direction="1"
        >
          &rarr;
        </button>
      </div>

      <div id="client-wins-track" className="testimonial-track" data-drag-scroll data-cursor-label="Drag">
        {testimonials.map((testimonial, index) => (
          <figure className={`story-card ${index === 2 ? "text-story" : ""}`} data-reveal key={testimonial.name}>
            {index !== 2 && (
              <div className={`avatar ${index === 0 ? "avatar-one" : "avatar-two"}`} aria-hidden="true">
                {testimonial.initials}
              </div>
            )}
            <blockquote>{testimonial.copy}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </figcaption>
            {index !== 2 && (
              <a className="story-button magnetic" href="#contact">
                Start now
              </a>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
