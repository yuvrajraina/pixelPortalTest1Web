import Link from "next/link";
import { strategicServices } from "../data/siteData";

export default function ServicesSection() {
  return (
    <section className="join-section section-shell" id="services" aria-labelledby="join-title">
      <div className="join-title" data-reveal>
        <h2 id="join-title" data-kinetic-heading>
          <span>Growth</span>
          <span>Services</span>
        </h2>
        <em aria-hidden="true">Services</em>
      </div>

      <div className="social-list service-list" data-reveal>
        {strategicServices.map((service) => (
          <Link className="magnetic" href={`/services/${service.slug}`} key={service.title}>
            <span>
              {service.title}
              <small>{service.short}</small>
            </span>
            <i>{service.code}</i>
          </Link>
        ))}
      </div>
    </section>
  );
}
