export type Lang = "en";

export const LANGUAGES: Lang[] = ["en"];
export const DEFAULT_LANG: Lang = "en";

type DictionaryNode = string | { [key: string]: DictionaryNode };

export const DICT = {
  picker: { season: "Season" },
  seasons: { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" },
  nav: { aria: "Sections", home: "Home", stack: "Stack", experience: "Experience", project: "Project", contact: "Contact" },
  header: { availability: "Open to opportunities" },
  hero: {
    greeting: "Hi, I am",
    roleLine: "Software Engineer & Tech Lead.",
    tagline: "Specialised in ERPs and full-stack apps for businesses.",
    cv: "Download résumé",
    hire: "Contact me",
    scroll: "Scroll to explore",
    keysHint: "· hover over the keys",
  },
  stack: {
    title: "Tech Stack",
    hint: "(hint: hover over a key)",
    hintMobile: "The tools I build with.",
  },
  experience: { title: "Experience", subtitle: "My professional journey." },
  projects: {
    kicker: "project",
    viewMore: "View more",
    openSite: "Visit site",
    viewCode: "View code",
    close: "Close",
    stackLabel: "Stack",
    overview: "Overview",
  },
  contact: {
    kicker: "contact",
    title: "Let's talk?",
    body: "If what you've seen interests you, the keyboard is ready for the first message.",
    copyEmail: "Copy email",
    openMail: "Open mail",
    github: "GitHub",
    linkedin: "LinkedIn",
    emailToast: "Email copied",
    footer: "© 2026 Txema Albero. All rights reserved.",
  },
  keyboard: {
    taglines: {
      javascript: "Where it all started. Still here, still in charge.",
      typescript: "Same JS, with a seatbelt.",
      html5: "The bones of any page.",
      css: "What separates good from beautiful.",
      tailwindcss: "Utility-first. Design inside the HTML.",
      python: "Reads like English, scales like a rocket.",
      react: "Components, components, components.",
      nextdotjs: "React all grown up: routing, SSR, edge.",
      vuedotjs: "The most relaxed frontend.",
      nodedotjs: "JavaScript on the server.",
      php: "Runs more of the web than you think.",
      odoo: "ERP that doesn't make you cry.",
      postgresql: "The boring database that always works.",
      docker: "Same on my machine, same in production.",
      git: "History and a time machine for the code.",
    },
  },
} as const satisfies Record<string, DictionaryNode>;

export function translate(path: string): string {
  const parts = path.split(".");
  let value: DictionaryNode = DICT;
  for (const part of parts) {
    if (typeof value === "string" || !(part in value)) return path;
    value = value[part];
  }
  return typeof value === "string" ? value : path;
}
