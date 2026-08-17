export type Localised = { es: string; en: string };

export type PortfolioProject = {
  id: string;
  num: string;
  name: Localised;
  stack: string[];
  desc: Localised;
  details: Localised;
  url?: string;
  github?: string;
  badge?: Localised;
  highlights?: string[];
  media?: string[];
  align: "left" | "right";
  section: string;
};

export type PortfolioExperience = {
  id: string;
  role: Localised;
  company: string;
  period: Localised;
  location: Localised;
  summary: Localised;
  bullets: Localised[];
  stack: string[];
};

export type SocialLinks = {
  github: string;
  linkedin: string;
  twitter: string;
  repository: string;
};

export type PortfolioConfig = {
  profile: {
    name: string;
    firstName: string;
    lastName: string;
    role: Localised;
    tagline: Localised;
    availability: Localised;
    email: string;
    phone: string;
    location: string;
    contactBody: Localised;
    footer: Localised;
    logoUrl: string;
    faviconUrl: string;
    resumeEsUrl: string;
    resumeEnUrl: string;
  };
  social: SocialLinks;
  projects: PortfolioProject[];
  experiences: PortfolioExperience[];
};

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  toEmail: string;
};

export type StoredPortfolio = {
  portfolio: PortfolioConfig;
  smtp?: string;
  updatedAt: string;
};

export const DEFAULT_PORTFOLIO: PortfolioConfig = {
  profile: {
    name: "Txema Albero",
    firstName: "Txema",
    lastName: "Albero",
    role: {
      es: "Software Engineer & Tech Lead.",
      en: "Software Engineer & Tech Lead.",
    },
    tagline: {
      es: "Especializado en ERPs y aplicaciones full-stack para empresas.",
      en: "Specialised in ERPs and full-stack apps for businesses.",
    },
    availability: {
      es: "Open to opportunities",
      en: "Open to opportunities",
    },
    email: "josemariaalberobelamendia@gmail.com",
    phone: "",
    location: "Alcoy, Spain",
    contactBody: {
      es: "Si lo que has visto te interesa, el teclado ya está listo para recibir el primer mensaje.",
      en: "If what you've seen interests you, the keyboard is ready for the first message.",
    },
    footer: {
      es: "© 2026 Txema Albero. Todos los derechos reservados.",
      en: "© 2026 Txema Albero. All rights reserved.",
    },
    logoUrl: "",
    faviconUrl: "/favicon.ico",
    resumeEsUrl: "/cv.pdf",
    resumeEnUrl: "/cv_en.pdf",
  },
  social: {
    github: "https://github.com/Txemalon",
    linkedin: "https://es.linkedin.com/in/jose-mar%C3%ADa-albero-belamendia-b9319a246",
    twitter: "https://x.com/Txemalon",
    repository: "https://github.com/Txemalon/3d-portfolio",
  },
  projects: [
    {
      id: "revio",
      num: "01",
      name: { es: "Contestador IA de Reseñas Google", en: "AI Responder for Google Reviews" },
      stack: ["Next.js", "FastAPI", "Python", "PostgreSQL", "Supabase", "Claude API", "Stripe", "Celery"],
      desc: {
        es: "SaaS que genera respuestas personalizadas a reseñas de Google Business Profile con IA, manteniendo el tono de la marca.",
        en: "SaaS that generates personalised replies to Google Business Profile reviews with AI while keeping the brand tone.",
      },
      details: {
        es: "Plataforma orientada a negocios locales en España para gestionar sus reseñas de Google Business Profile. El sistema hace polling cada 15 minutos, llama a Claude para generar respuestas alineadas con el tono de marca y las publica automáticamente (o las manda a revisión). Incluye Stripe con suscripciones y Customer Portal, autenticación con Google OAuth + PKCE, alertas por email/SMS para reseñas negativas y un dashboard con métricas.",
        en: "A platform for local businesses in Spain to manage their Google Business Profile reviews. The system polls every 15 minutes, uses Claude to draft replies in the brand's tone and publishes them automatically (or sends them to review). Stripe handles subscriptions and Customer Portal, auth is Google OAuth with PKCE, and negative reviews fire email/SMS alerts. Dashboard with metrics included.",
      },
      url: "https://revio.txemaalbero.com/",
      media: ["/projects/revio/landing.png", "/projects/revio/dashboard.png", "/projects/revio/alertas.png", "/projects/revio/analiticas.png", "/projects/revio/negocios.png", "/projects/revio/analiticas-ia.png"],
      highlights: ["nextdotjs", "tailwindcss", "python", "postgresql"],
      align: "left",
      section: "project1",
    },
    {
      id: "aptia",
      num: "02",
      name: { es: "Control de Temperaturas APPCC", en: "HACCP Temperature Control" },
      stack: ["Next.js 16", "FastAPI", "Python", "PostgreSQL", "Supabase", "Claude API", "Stripe", "Celery"],
      desc: {
        es: "App para restaurantes que digitaliza el registro de temperaturas APPCC y genera planes e informes automáticos.",
        en: "App for restaurants that digitises HACCP temperature logs and auto-generates plans and reports.",
      },
      details: {
        es: "Digitaliza el control APPCC completo de un restaurante: registros de temperatura, trazabilidad, alérgenos y generación asistida por IA de los planes HACCP. Integración con Open Food Facts para importar alérgenos, MFA en la autenticación, multi-idioma con next-intl y pagos por suscripción con Stripe. Backend 100% async con FastAPI + SQLAlchemy y tareas en Celery.",
        en: "Full HACCP digitisation for a restaurant: temperature logs, traceability, allergens, and AI-assisted generation of HACCP plans. Integrates with Open Food Facts for allergens, MFA-protected auth, i18n with next-intl, subscription billing with Stripe. Fully async backend with FastAPI + SQLAlchemy and Celery workers.",
      },
      url: "https://aptia.txemaalbero.com/",
      media: ["/projects/aptia/landing.png", "/projects/aptia/panel.png", "/projects/aptia/registros.png", "/projects/aptia/carta-alergenos.png", "/projects/aptia/inspeccion.png", "/projects/aptia/cuestionario.png"],
      highlights: ["nextdotjs", "tailwindcss", "python", "postgresql", "typescript"],
      badge: { es: "En desarrollo", en: "In progress" },
      align: "right",
      section: "project2",
    },
    {
      id: "gestor-gastos",
      num: "03",
      name: { es: "Gestor de Finanzas Personales", en: "Personal Finance Tracker" },
      stack: ["Django", "Python", "SQLite", "HTML5", "CSS3", "JavaScript", "Chart.js", "pandas"],
      desc: {
        es: "Dashboard para seguimiento de ingresos, gastos y objetivos de ahorro.",
        en: "Dashboard to track income, expenses and savings goals.",
      },
      details: {
        es: "Aplicación Django clásica (MVT) para finanzas personales: categorización de gastos, objetivos de ahorro, importación masiva desde Excel (xlsx/xls) y gráficos con Chart.js. Temas claro/oscuro hechos con CSS puro y sin dependencias frontend. Un proyecto que prioriza simplicidad y robustez: sin frameworks en el cliente, autenticación nativa de Django, base de datos SQLite.",
        en: "Classic Django (MVT) app for personal finance: expense categorisation, savings goals, bulk import from Excel (xlsx/xls) and Chart.js-powered graphs. Light/dark themes in pure CSS with zero frontend dependencies. A project that favours simplicity and robustness: no client framework, Django's built-in auth, SQLite storage.",
      },
      github: "https://github.com/Txemalon/Gestor-de-gastos-personales",
      media: ["/projects/gestor-gastos/dashboard.png", "/projects/gestor-gastos/wallets.png", "/projects/gestor-gastos/transacciones.png", "/projects/gestor-gastos/categorias.png", "/projects/gestor-gastos/reportes.png", "/projects/gestor-gastos/inversiones.png"],
      highlights: ["python", "javascript", "html5", "css"],
      align: "left",
      section: "project3",
    },
    {
      id: "dianas",
      num: "04",
      name: { es: "Tienda online de dianas", en: "Dartboards e-commerce" },
      stack: ["Next.js 15", "React", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Stripe", "Framer Motion"],
      desc: {
        es: "E-commerce moderno para venta de dianas con pagos, autenticación y administración.",
        en: "Modern dartboard e-commerce with payments, authentication and administration.",
      },
      details: {
        es: "Tienda online completa con catálogo, carrito y checkout con Stripe. NextAuth con Google OAuth y credenciales, rate limiting con Upstash Redis, validación con Zod y un panel de administración separado. Transiciones y microinteracciones con Framer Motion para darle un acabado premium.",
        en: "A full e-commerce with catalogue, cart and Stripe checkout. NextAuth with Google OAuth and credentials, Upstash Redis for rate limiting, Zod validation, and a separate admin panel. Framer Motion powers transitions and micro-interactions for a premium finish.",
      },
      media: ["/projects/dianas/packs.png", "/projects/dianas/catalogo.png"],
      highlights: ["nextdotjs", "react", "typescript", "tailwindcss", "postgresql"],
      badge: { es: "En construcción", en: "Under construction" },
      align: "right",
      section: "project4",
    },
  ],
  experiences: [
    {
      id: "activalink",
      role: { es: "Tech Lead", en: "Tech Lead" },
      company: "Activalink",
      period: { es: "2023 — Presente", en: "2023 — Present" },
      location: { es: "Alcoy, España", en: "Alcoy, Spain" },
      summary: {
        es: "Activalink implementa y adapta ERPs para pymes y grandes empresas. Desarrollo módulos y personalizaciones custom sobre Odoo, integraciones a medida y proyectos de implantación llave en mano. Lidero un equipo de 3 desarrolladores: nuestro trabajo se mide en tiempo ahorrado y errores evitados.",
        en: "Activalink implements and customises ERPs for SMBs and large companies. I build custom modules and personalisations on top of Odoo, bespoke integrations, and end-to-end implementation projects. I lead a team of 3 developers: our work is measured in time saved and errors avoided.",
      },
      bullets: [
        { es: "OCR de facturas en Odoo — de 4 h/día a 30 min.", en: "Invoice OCR in Odoo — from 4 h/day to 30 min." },
        { es: "Logística con mapa interactivo — 60 % menos errores.", en: "Interactive logistics map — 60% fewer errors." },
        { es: "Conciliación automática — cierre de 3 días a medio día.", en: "Automated reconciliation — close from 3 days to half a day." },
        { es: "Dashboards financieros — detección temprana de facturas sin emitir.", en: "Financial dashboards — early detection of uninvoiced orders." },
      ],
      stack: ["Odoo", "Python", "PostgreSQL", "Next.js", "TypeScript"],
    },
  ],
};

// Keep old stored records compatible while ensuring only English copy is
// returned and saved from now on.
export function toEnglishOnly(portfolio: PortfolioConfig): PortfolioConfig {
  const english = (value: Localised): Localised => ({ es: value.en, en: value.en });
  return {
    ...portfolio,
    profile: {
      ...portfolio.profile,
      role: english(portfolio.profile.role),
      tagline: english(portfolio.profile.tagline),
      availability: english(portfolio.profile.availability),
      contactBody: english(portfolio.profile.contactBody),
      footer: english(portfolio.profile.footer),
      resumeEsUrl: portfolio.profile.resumeEnUrl,
    },
    projects: portfolio.projects.map((project) => ({
      ...project,
      name: english(project.name),
      desc: english(project.desc),
      details: english(project.details),
      badge: project.badge ? english(project.badge) : undefined,
    })),
    experiences: portfolio.experiences.map((experience) => ({
      ...experience,
      role: english(experience.role),
      period: english(experience.period),
      location: english(experience.location),
      summary: english(experience.summary),
      bullets: experience.bullets.map(english),
    })),
  };
}
