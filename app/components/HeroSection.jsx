export default function HeroSection() {
  return (
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <img className="hero-product" src="/assets/pixel-portal-dashboard.png" alt="" />
      </div>

      <div className="hero-grid">
        <div className="eyebrow-block" data-reveal>
          <span className="chapter">01</span>
          <span>Digital strategy and intelligent growth systems</span>
        </div>

        <div className="hero-copy" data-reveal>
          <p className="kicker">Elevating your brand with digital excellence</p>
          <h1 id="hero-title" data-kinetic-heading>
            Pixel Portal
          </h1>
          <p className="hero-lede">
            Grow smarter with predictive acquisition, semantic SEO, connected digital journeys, and executive-ready analytics.
          </p>
        </div>

        <div className="hero-actions" data-reveal>
          <a className="button-primary magnetic" href="#services">
            <span>Explore services</span>
            <span aria-hidden="true">&darr;</span>
          </a>
          <a className="button-ghost magnetic" href="#contact">
            Get consultation
          </a>
        </div>
      </div>

      <div className="hero-bottom" data-reveal>
        <span>Algorithmic Growth</span>
        <span>Cognitive SEO</span>
        <span>Omnichannel Architecture</span>
        <span>Data Engineering</span>
      </div>
    </section>
  );
}
