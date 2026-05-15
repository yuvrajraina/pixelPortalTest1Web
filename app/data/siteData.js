export const strategicServices = [
  {
    slug: "algorithmic-growth",
    title: "Algorithmic Growth",
    code: "01",
    eyebrow: "Predictive LTV acquisition",
    short:
      "Leveraging predictive models to identify and capture high-LTV market segments before the competition.",
    heroLines: ["Algorithmic", "Growth"],
    lede:
      "A growth system for teams that want sharper acquisition bets, better audience prioritization, and clearer paths from campaign signal to revenue.",
    outcomes: [
      "High-LTV segment modeling",
      "Predictive acquisition scoring",
      "Campaign prioritization frameworks",
      "Growth experiment roadmaps",
    ],
    capabilities: [
      "Build predictive models around customer value, channel quality, conversion behavior, and market timing.",
      "Translate audience signals into paid, organic, and lifecycle experiments with measurable decision gates.",
      "Create reporting loops that show which segments deserve more budget, better creative, or faster follow-up.",
    ],
    metrics: ["LTV", "CAC", "ROAS", "Pipeline"],
  },
  {
    slug: "cognitive-seo",
    title: "Cognitive SEO",
    code: "02",
    eyebrow: "Semantic search engineering",
    short:
      "Semantic search engineering that aligns brand assets with evolving LLM algorithms and user intent.",
    heroLines: ["Cognitive", "SEO"],
    lede:
      "A modern search program that prepares your brand for classic search, answer engines, and LLM-shaped discovery behavior.",
    outcomes: [
      "Semantic content architecture",
      "Search and answer intent mapping",
      "Entity-led optimization",
      "Technical SEO prioritization",
    ],
    capabilities: [
      "Map audience intent into topic clusters, landing pages, service narratives, and conversion assets.",
      "Shape content around entities, schema, authority signals, and the questions customers actually ask.",
      "Improve crawlability, performance, internal linking, and metadata so search systems can understand the brand.",
    ],
    metrics: ["Intent", "Entities", "Rankings", "Qualified traffic"],
  },
  {
    slug: "omnichannel-architecture",
    title: "Omnichannel Architecture",
    code: "03",
    eyebrow: "Integrated consumer journeys",
    short:
      "Seamless brand integration across digital touchpoints, ensuring frictionless consumer journeys.",
    heroLines: ["Omnichannel", "Architecture"],
    lede:
      "A connected experience layer for brands that need their website, content, ads, CRM, social channels, and commerce flows to feel like one journey.",
    outcomes: [
      "Touchpoint journey mapping",
      "Cross-channel messaging systems",
      "CRM and campaign flow alignment",
      "Conversion path optimization",
    ],
    capabilities: [
      "Audit every digital touchpoint for friction, message gaps, broken handoffs, and inconsistent brand signals.",
      "Design journey architecture across awareness, evaluation, purchase, onboarding, and retention.",
      "Align campaigns, landing pages, content, and follow-up systems around the same customer story.",
    ],
    metrics: ["Journey", "Retention", "Conversion", "Consistency"],
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    code: "04",
    eyebrow: "Executive intelligence systems",
    short:
      "Structuring fragmented analytics into unified, actionable intelligence dashboards for C-suite decisioning.",
    heroLines: ["Data", "Engineering"],
    lede:
      "A cleaner analytics foundation for leaders who need marketing, website, commerce, and customer signals in one decision-ready view.",
    outcomes: [
      "Analytics source mapping",
      "Dashboard architecture",
      "KPI taxonomy and governance",
      "Executive reporting workflows",
    ],
    capabilities: [
      "Unify fragmented analytics sources into a practical measurement model that leaders can trust.",
      "Define KPI layers for acquisition, engagement, conversion, retention, and revenue contribution.",
      "Create dashboards and reporting rituals that turn raw activity into clear decisions.",
    ],
    metrics: ["Dashboards", "Attribution", "KPI clarity", "Decision speed"],
  },
];

export const testimonials = [
  {
    initials: "A",
    name: "Anjali Mehta",
    role: "Digital marketing client",
    copy: "Pixel Portal's SEO and social media strategy helped improve online visibility with a responsive, results-focused team.",
  },
  {
    initials: "R",
    name: "Rohit Sharma",
    role: "Website development client",
    copy: "The team delivered a modern, user-friendly website with thoughtful design details and a noticeable lift in customer inquiries.",
  },
  {
    initials: "P",
    name: "Priya Verma",
    role: "Growth client",
    copy: "From web design to digital marketing, Pixel Portal brought a data-led approach that helped scale traffic and business momentum.",
  },
];

export const process = [
  "Understanding your goals",
  "Design and development",
  "Launch and optimization",
  "Growth and support",
];

export function getServiceBySlug(slug) {
  return strategicServices.find((service) => service.slug === slug);
}
