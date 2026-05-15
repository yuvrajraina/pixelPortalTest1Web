export default function AboutSection() {
  return (
    <section className="studio-wall" id="about" aria-labelledby="wall-title">
      <div className="wall-card wall-one image-card" data-parallax="-0.12" aria-hidden="true">
        <img src="/assets/pixel-portal-website.jpg" alt="" />
      </div>
      <div className="wall-card wall-two image-card" data-parallax="0.18" aria-hidden="true">
        <img src="/assets/pixel-portal-growth.png" alt="" />
      </div>
      <div className="wall-card wall-three image-card" data-parallax="-0.2" aria-hidden="true">
        <img src="/assets/pixel-portal-webs.jpg" alt="" />
      </div>
      <div className="wall-card wall-four metric-card" data-parallax="0.14" aria-hidden="true">
        <span>230+</span>
        <small>companies connected through digital growth work</small>
      </div>

      <div className="wall-copy" data-wall-copy>
        <p>Business solutions</p>
        <h2 id="wall-title" data-kinetic-heading data-kinetic-small>
          <span>High-performance websites</span>
          <span>and marketing strategies</span>
          <span>built to drive measurable growth.</span>
        </h2>
        <a className="button-ghost magnetic" href="#services">
          View services
        </a>
      </div>
    </section>
  );
}
