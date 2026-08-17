# 3D Developer Portfolio

An immersive, interactive developer portfolio built with **Next.js 16**, **React Three Fiber**, and **Tailwind CSS v4**. Features a 3D mechanical keyboard hero scene, seasonal themes, smooth scroll animations, English content, and a fully responsive design.

**[Live Demo](https://txemaalbero.com)** &nbsp;|&nbsp; **Built by [Txema Albero](https://es.linkedin.com/in/jose-mar%C3%ADa-albero-belamendia-b9319a246)**

---

## Highlights

- **Interactive 3D Keyboard** — A full mechanical keyboard rendered with React Three Fiber and Three.js. Keys react to real keypresses with physics-based animations and sound effects.
- **Seasonal Themes** — Four complete visual themes (Winter, Spring, Summer, Autumn) that re-skin the entire UI — colours, gradients, and 3D scene lighting — with a single click.
- **Project Showcases** — Modal dialogs with image carousels, tech stack chips, and links to live demos and source code.
- **English content** — A focused single-language experience across the portfolio and admin editor.
- **Smooth Scroll & Reveal Animations** — Powered by [Lenis](https://github.com/darkroomengineering/lenis) for buttery smooth scrolling with intersection-observer-based reveal effects.
- **Custom Cursor & Magnetic Targets** — A custom cursor that morphs on interactive elements, with magnetic snap behaviour on buttons.
- **Responsive & Mobile-First** — Optimised for recruiters reviewing on phones. WebGL performance and touch interactions are first-class concerns.
- **Security Headers** — HSTS, X-Frame-Options, Content-Type-Options, Referrer-Policy, and Permissions-Policy configured out of the box.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| 3D | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) + [Three.js](https://threejs.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Icons | [Simple Icons](https://simpleicons.org/) (tech logos on 3D keycaps) |
| Language | TypeScript |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/Txemalon/3d-portfolio.git
cd 3d-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Admin editor

Open `/modify` and sign in with the password stored in `ADMIN_PASSWORD`. The editor controls profile and contact information, social links, logo, favicon, résumés, projects, experience, and Gmail SMTP settings.

Copy `.env.example` to `.env.local` for local development. In Vercel, add `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `ADMIN_DATA_SECRET` in Project Settings → Environment Variables. Connect a Vercel Blob store to the project; Vercel supplies `BLOB_READ_WRITE_TOKEN` automatically.

For Gmail SMTP, create a Google app password after enabling two-step verification. Enter that app password in `/modify`; do not use your regular Google password.

## Project Structure

```
├── app/
│   ├── globals.css        # Tailwind + CSS custom properties (seasonal themes)
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with all sections
├── components/
│   ├── FrozenKeyboard.tsx # 3D keyboard scene (R3F)
│   ├── FrozenBackground.tsx # Animated background particles
│   ├── Carousel.tsx       # Image carousel for project modals
│   ├── ProjectModal.tsx   # Fullscreen project detail dialog
│   ├── SeasonProvider.tsx # Seasonal theme context
│   ├── SeasonPicker.tsx   # Theme switcher UI
│   ├── LanguageProvider.tsx # i18n context
│   ├── CustomCursor.tsx   # Custom cursor with hover states
│   ├── MagneticTargets.tsx# Magnetic snap on interactive elements
│   ├── Reveal.tsx         # Scroll-triggered reveal animations
│   ├── SectionNav.tsx     # Dot navigation sidebar
│   ├── ScrollProgress.tsx # Scroll progress indicator
│   ├── CopyEmail.tsx      # Copy-to-clipboard button
│   └── smooth-scroll.tsx  # Lenis smooth scroll wrapper
├── lib/
│   ├── i18n.ts            # English UI dictionary
│   └── seasons.ts         # Season theme definitions
├── public/
│   ├── fonts/             # 3D text typefaces
│   ├── projects/          # Project screenshots
│   └── sounds/            # Keyboard sound effects
├── next.config.ts         # Security headers
└── package.json
```

## Customisation

### Adding a Project

Projects are defined in `app/page.tsx` in the `projects` array. Each entry supports:

```typescript
{
  num: "05",
  name: { es: "My Project", en: "My Project" },
  stack: ["Next.js", "TypeScript"],
  desc: { es: "Descripción corta", en: "Short description" },
  details: { es: "Descripción larga...", en: "Long description..." },
  url: "https://myproject.com",          // optional — adds "View Site" button
  github: "https://github.com/user/repo", // optional — adds "View Code" button
  media: ["/projects/my-project/1.png"], // optional — carousel screenshots
  highlights: ["nextdotjs", "typescript"], // simple-icons slugs for 3D keyboard
  badge: { es: "En desarrollo", en: "In progress" }, // optional status badge
  align: "left",                         // card alignment
  section: "project5",                   // data attribute for scroll nav
}
```

### Changing Themes

Seasonal colour tokens are defined as CSS custom properties in `app/globals.css` under `[data-season="..."]` selectors. Edit or add new seasons there.

### Interface copy

All shared English UI strings live in `lib/i18n.ts`.

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Txemalon/3d-portfolio)

## Performance

- **Lazy loading** — Project screenshots use native lazy loading.
- **Font optimisation** — Uses `next/font` for zero-layout-shift web fonts.
- **Turbopack** — Sub-300ms dev server cold starts.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Jose Maria Albero Belamendia (Txema)**

- [LinkedIn](https://es.linkedin.com/in/jose-mar%C3%ADa-albero-belamendia-b9319a246)
- [GitHub](https://github.com/Txemalon)
- [X / Twitter](https://x.com/Txemalon)
"# divya" 
"# divya" 
"# s1" 
