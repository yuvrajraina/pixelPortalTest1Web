import Link from "next/link";
import { notFound } from "next/navigation";
import SiteEffects from "../../components/SiteEffects";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { getServiceBySlug, strategicServices } from "../../data/siteData";

export function generateStaticParams() {
  return strategicServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Pixel Portal",
    };
  }

  return {
    title: `${service.title} | Pixel Portal`,
    description: service.short,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <SiteEffects />
      <SiteHeader />

      <main id="top" className="service-page">
        <section className="service-hero section-shell" aria-labelledby="service-title">
          <div className="service-hero-media" aria-hidden="true">
            <span>{service.code}</span>
          </div>

          <div className="service-hero-grid">
            <div className="eyebrow-block" data-reveal>
              <span className="chapter">{service.code}</span>
              <span>{service.eyebrow}</span>
            </div>

            <div className="service-hero-copy" data-reveal>
              <p className="kicker">Pixel Portal strategic service</p>
              <h1 id="service-title" data-kinetic-heading>
                {service.heroLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="hero-lede">{service.lede}</p>
            </div>

            <div className="service-hero-actions" data-reveal>
              <Link className="button-primary magnetic" href="/#contact">
                Start a brief
              </Link>
              <Link className="button-ghost magnetic" href="/#services">
                All services
              </Link>
            </div>
          </div>
        </section>

        <section className="service-overview section-shell" aria-label={`${service.title} overview`}>
          <div className="service-summary" data-reveal>
            <span>Overview</span>
            <p>{service.short}</p>
          </div>

          <div className="service-outcomes" data-reveal>
            {service.outcomes.map((outcome, index) => (
              <article key={outcome}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h2>{outcome}</h2>
              </article>
            ))}
          </div>
        </section>

        <section className="service-detail section-shell" aria-labelledby="service-detail-title">
          <div className="process-head" data-reveal>
            <div className="section-label">
              <span className="chapter">PP</span>
              <span>Service system</span>
            </div>
            <h2 id="service-detail-title">What this unlocks</h2>
          </div>

          <div className="service-capability-grid">
            {service.capabilities.map((capability) => (
              <article className="process-card" data-reveal key={capability}>
                <span>{service.title}</span>
                <h3>{capability}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="service-metrics section-shell" aria-label={`${service.title} metrics`}>
          {service.metrics.map((metric) => (
            <span data-reveal key={metric}>
              {metric}
            </span>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
