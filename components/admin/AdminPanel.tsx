"use client";

import { upload as uploadToBlob } from "@vercel/blob/client";
import { useEffect, useState, type ReactNode } from "react";
import type { Localised, PortfolioConfig, PortfolioExperience, PortfolioProject, SmtpConfig } from "@/lib/portfolio-config";

type AdminPayload = {
  portfolio: PortfolioConfig;
  smtp: SmtpConfig;
  storageConfigured: boolean;
  updatedAt: string | null;
};

const blankProject = (index: number): PortfolioProject => ({
  id: crypto.randomUUID(), num: String(index + 1).padStart(2, "0"),
  name: { es: "New project", en: "New project" }, stack: [],
  desc: { es: "", en: "" }, details: { es: "", en: "" }, highlights: [], media: [],
  align: index % 2 ? "right" : "left", section: `project${index + 1}`,
});

const blankExperience = (): PortfolioExperience => ({
  id: crypto.randomUUID(), role: { es: "", en: "" }, company: "",
  period: { es: "", en: "" }, location: { es: "", en: "" },
  summary: { es: "", en: "" }, bullets: [], stack: [],
});

function Field({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string | number; onChange: (value: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return <label className="admin-field"><span>{label}</span><input type={type} value={value} placeholder={placeholder} required={required} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <label className="admin-field admin-field--wide"><span>{label}</span><textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function LocalisedFields({ label, value, onChange, area = false }: { label: string; value: Localised; onChange: (value: Localised) => void; area?: boolean }) {
  const Element = area ? Area : Field;
  return <Element label={label} value={value.en} onChange={(english) => onChange({ es: english, en: english })} />;
}

function CsvField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <Field label={label} value={value.join(", ")} onChange={(raw) => onChange(raw.split(",").map((item) => item.trim()).filter(Boolean))} />;
}

function Section({ title, description, children, action }: { title: string; description?: string; children: ReactNode; action?: ReactNode }) {
  return <section className="admin-section"><div className="admin-section__head"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</section>;
}

function UploadField({ label, value, accept, onUploaded }: { label: string; value: string; accept: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const blob = await uploadToBlob(`portfolio/uploads/${crypto.randomUUID()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      onUploaded(blob.url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };
  return <div className="admin-upload"><Field label={label} value={value} onChange={onUploaded} placeholder="URL or upload a file" /><label className="admin-upload__button">{uploading ? "Uploading…" : "Upload"}<input type="file" accept={accept} disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} /></label></div>;
}

export default function AdminPanel({ initiallyAuthenticated }: { initiallyAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminPayload | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    fetch("/api/admin/config", { cache: "no-store" }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) { setAuthenticated(false); return; }
      if (!response.ok) { setStatus("Could not load the portfolio settings."); return; }
      setData(await response.json() as AdminPayload);
    }).catch(() => { if (active) setStatus("Could not load the portfolio settings."); });
    return () => { active = false; };
  }, [authenticated]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setStatus("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) return setStatus(result.error || "Login failed.");
    setPassword(""); setAuthenticated(true);
  };

  const updatePortfolio = (recipe: (draft: PortfolioConfig) => void) => {
    setData((current) => {
      if (!current) return current;
      const portfolio = structuredClone(current.portfolio); recipe(portfolio);
      return { ...current, portfolio };
    });
  };

  const save = async () => {
    if (!data) return;
    setBusy(true); setStatus("Saving…");
    const response = await fetch("/api/admin/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ portfolio: data.portfolio, smtp: data.smtp }) });
    const result = await response.json() as { error?: string };
    setBusy(false);
    setStatus(response.ok ? "Saved. The live portfolio will update within about a minute." : result.error || "Save failed.");
  };

  if (!authenticated) return <main className="admin-shell admin-login"><form onSubmit={login} className="admin-login__card"><p className="admin-eyebrow">Private portfolio editor</p><h1>Sign in to modify</h1><p>Enter the password configured as <code>ADMIN_PASSWORD</code>.</p><Field label="Password" type="password" value={password} onChange={setPassword} required /><button className="admin-primary" disabled={busy}>{busy ? "Checking…" : "Unlock editor"}</button>{status && <p role="alert" className="admin-status admin-status--error">{status}</p>}</form></main>;
  if (!data) return <main className="admin-shell admin-loading"><p>{status || "Loading editor…"}</p></main>;

  const { portfolio } = data;
  return <main className="admin-shell">
    <header className="admin-header"><div><p className="admin-eyebrow">Portfolio control room</p><h1>Modify your site</h1><p>Content, links, uploads, experience, projects, and mail delivery.</p></div><div className="admin-header__actions"><a href="/" target="_blank">View site ↗</a><button onClick={() => void save()} className="admin-primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); }} className="admin-secondary">Log out</button></div></header>
    {!data.storageConfigured && <div className="admin-warning"><strong>Vercel Blob is not connected.</strong> You can review the editor, but saving and uploads require <code>BLOB_READ_WRITE_TOKEN</code>.</div>}
    {status && <p role="status" className="admin-status">{status}</p>}

    <Section title="Identity & contact" description="These values power the hero, header, contact section, and footer."><div className="admin-grid">
      <Field label="Display name" value={portfolio.profile.name} onChange={(v) => updatePortfolio((d) => { d.profile.name = v; })} required />
      <Field label="First name" value={portfolio.profile.firstName} onChange={(v) => updatePortfolio((d) => { d.profile.firstName = v; })} required />
      <Field label="Last name" value={portfolio.profile.lastName} onChange={(v) => updatePortfolio((d) => { d.profile.lastName = v; })} required />
      <Field label="Email" type="email" value={portfolio.profile.email} onChange={(v) => updatePortfolio((d) => { d.profile.email = v; })} required />
      <Field label="Phone" type="tel" value={portfolio.profile.phone} onChange={(v) => updatePortfolio((d) => { d.profile.phone = v; })} />
      <Field label="Location" value={portfolio.profile.location} onChange={(v) => updatePortfolio((d) => { d.profile.location = v; })} />
      <LocalisedFields label="Role" value={portfolio.profile.role} onChange={(v) => updatePortfolio((d) => { d.profile.role = v; })} />
      <LocalisedFields label="Tagline" value={portfolio.profile.tagline} onChange={(v) => updatePortfolio((d) => { d.profile.tagline = v; })} area />
      <LocalisedFields label="Availability" value={portfolio.profile.availability} onChange={(v) => updatePortfolio((d) => { d.profile.availability = v; })} />
      <LocalisedFields label="Contact text" value={portfolio.profile.contactBody} onChange={(v) => updatePortfolio((d) => { d.profile.contactBody = v; })} area />
      <LocalisedFields label="Footer" value={portfolio.profile.footer} onChange={(v) => updatePortfolio((d) => { d.profile.footer = v; })} />
    </div></Section>

    <Section title="Brand & files" description="Paste an existing URL or upload to Vercel Blob."><div className="admin-grid">
      <UploadField label="Logo" value={portfolio.profile.logoUrl} accept="image/*" onUploaded={(v) => updatePortfolio((d) => { d.profile.logoUrl = v; })} />
      <UploadField label="Favicon" value={portfolio.profile.faviconUrl} accept="image/*,.ico" onUploaded={(v) => updatePortfolio((d) => { d.profile.faviconUrl = v; })} />
      <UploadField label="Résumé" value={portfolio.profile.resumeEnUrl} accept="application/pdf" onUploaded={(v) => updatePortfolio((d) => { d.profile.resumeEnUrl = v; d.profile.resumeEsUrl = v; })} />
    </div></Section>

    <Section title="Social links"><div className="admin-grid">{(Object.keys(portfolio.social) as Array<keyof typeof portfolio.social>).map((key) => <Field key={key} label={key[0].toUpperCase() + key.slice(1)} type="url" value={portfolio.social[key]} onChange={(v) => updatePortfolio((d) => { d.social[key] = v; })} />)}</div></Section>

    <Section title="Projects" description="Add, edit, or remove portfolio case studies." action={<button className="admin-secondary" onClick={() => updatePortfolio((d) => d.projects.push(blankProject(d.projects.length)))}>+ Add project</button>}>
      <div className="admin-repeat">{portfolio.projects.map((project, index) => <article className="admin-card" key={project.id}><div className="admin-card__head"><h3>{project.num} · {project.name.en || "Untitled"}</h3><button className="admin-danger" onClick={() => updatePortfolio((d) => { d.projects.splice(index, 1); })}>Remove</button></div><div className="admin-grid">
        <Field label="Number" value={project.num} onChange={(v) => updatePortfolio((d) => { d.projects[index].num = v; })} />
        <Field label="Section key" value={project.section} onChange={(v) => updatePortfolio((d) => { d.projects[index].section = v; })} />
        <LocalisedFields label="Name" value={project.name} onChange={(v) => updatePortfolio((d) => { d.projects[index].name = v; })} />
        <LocalisedFields label="Short description" value={project.desc} onChange={(v) => updatePortfolio((d) => { d.projects[index].desc = v; })} area />
        <LocalisedFields label="Full details" value={project.details} onChange={(v) => updatePortfolio((d) => { d.projects[index].details = v; })} area />
        <Field label="Live URL" type="url" value={project.url || ""} onChange={(v) => updatePortfolio((d) => { d.projects[index].url = v; })} />
        <Field label="GitHub URL" type="url" value={project.github || ""} onChange={(v) => updatePortfolio((d) => { d.projects[index].github = v; })} />
        <CsvField label="Tech stack · comma separated" value={project.stack} onChange={(v) => updatePortfolio((d) => { d.projects[index].stack = v; })} />
        <CsvField label="Keyboard highlights · simple-icons slugs" value={project.highlights || []} onChange={(v) => updatePortfolio((d) => { d.projects[index].highlights = v; })} />
        <Area label="Image URLs · one per line" rows={4} value={(project.media || []).join("\n")} onChange={(v) => updatePortfolio((d) => { d.projects[index].media = v.split("\n").map((x) => x.trim()).filter(Boolean); })} />
        <UploadField label="Upload project image" value="" accept="image/*" onUploaded={(v) => updatePortfolio((d) => { d.projects[index].media = [...(d.projects[index].media || []), v]; })} />
      </div></article>)}</div>
    </Section>

    <Section title="Experience" action={<button className="admin-secondary" onClick={() => updatePortfolio((d) => d.experiences.push(blankExperience()))}>+ Add experience</button>}><div className="admin-repeat">{portfolio.experiences.map((experience, index) => <article className="admin-card" key={experience.id}><div className="admin-card__head"><h3>{experience.role.en || "New role"} · {experience.company}</h3><button className="admin-danger" onClick={() => updatePortfolio((d) => { d.experiences.splice(index, 1); })}>Remove</button></div><div className="admin-grid">
      <Field label="Company" value={experience.company} onChange={(v) => updatePortfolio((d) => { d.experiences[index].company = v; })} />
      <LocalisedFields label="Role" value={experience.role} onChange={(v) => updatePortfolio((d) => { d.experiences[index].role = v; })} />
      <LocalisedFields label="Period" value={experience.period} onChange={(v) => updatePortfolio((d) => { d.experiences[index].period = v; })} />
      <LocalisedFields label="Location" value={experience.location} onChange={(v) => updatePortfolio((d) => { d.experiences[index].location = v; })} />
      <LocalisedFields label="Summary" value={experience.summary} onChange={(v) => updatePortfolio((d) => { d.experiences[index].summary = v; })} area />
      <CsvField label="Tech stack · comma separated" value={experience.stack} onChange={(v) => updatePortfolio((d) => { d.experiences[index].stack = v; })} />
      <Area label="Bullets · one per line" value={experience.bullets.map((b) => b.en).join("\n")} onChange={(v) => updatePortfolio((d) => { d.experiences[index].bullets = v.split("\n").filter(Boolean).map((english) => ({ es: english, en: english })); })} />
    </div></article>)}</div></Section>

    <Section title="Gmail SMTP" description="Use a Google app password, not your normal Gmail password. Stored encrypted in Vercel Blob."><div className="admin-grid">
      <Field label="SMTP host" value={data.smtp.host} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, host: v } })} />
      <Field label="Port" type="number" value={data.smtp.port} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, port: Number(v) } })} />
      <Field label="Gmail user" type="email" value={data.smtp.user} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, user: v } })} />
      <Field label="Google app password" type="password" value={data.smtp.password} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, password: v } })} />
      <Field label="From email" type="email" value={data.smtp.fromEmail} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, fromEmail: v } })} />
      <Field label="Receive messages at" type="email" value={data.smtp.toEmail} onChange={(v) => setData({ ...data, smtp: { ...data.smtp, toEmail: v } })} />
      <label className="admin-check"><input type="checkbox" checked={data.smtp.secure} onChange={(e) => setData({ ...data, smtp: { ...data.smtp, secure: e.target.checked } })} /><span>Use secure TLS (recommended for port 465)</span></label>
    </div></Section>
    <div className="admin-savebar"><span>{status}</span><button className="admin-primary" onClick={() => void save()} disabled={busy}>{busy ? "Saving…" : "Save all changes"}</button></div>
  </main>;
}
