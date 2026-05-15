export default function SiteFooter() {
  return (
    <footer className="footer-v2 section-shell" id="contact">
      <div className="footer-hero" data-reveal>
        <h2 data-kinetic-heading>
          <span>Level up</span>
          <span>online.</span>
        </h2>
        <a className="footer-pill magnetic" href="https://www.pixelportal.in/contact-us" target="_blank" rel="noreferrer">
          Get started
        </a>
      </div>

      <div className="footer-contact" data-reveal>
        <a href="https://www.pixelportal.in/" target="_blank" rel="noreferrer">
          <small>Website</small>
          <span>pixelportal.in</span>
        </a>
        <a href="/#services">
          <small>Services</small>
          <span>Growth, SEO, Data</span>
        </a>
        <a href="https://www.pixelportal.in/contact-us" target="_blank" rel="noreferrer">
          <small>Contact</small>
          <span>Answer your queries</span>
        </a>
      </div>

      <div className="footer-bottom" data-reveal>
        <p>(c)2026 Pixel Portal</p>
        <a className="to-top magnetic" href="#top" aria-label="Back to top">
          &uarr;
        </a>
      </div>

      <div className="footer-ghost" aria-hidden="true">
        PIXEL
      </div>
    </footer>
  );
}
