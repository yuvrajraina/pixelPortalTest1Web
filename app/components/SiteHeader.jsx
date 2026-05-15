export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand magnetic" href="/#top" aria-label="Pixel Portal home">
        <span className="brand-mark">P</span>
        <span>Pixel Portal</span>
      </a>

      <div className="header-dials" aria-hidden="true">
        <span>AI</span>
        <span>SEO</span>
      </div>

      <a className="nav-cta magnetic" href="/#contact" aria-label="Open contact section">
        <span>Contact</span>
        <i aria-hidden="true" />
      </a>
    </header>
  );
}
