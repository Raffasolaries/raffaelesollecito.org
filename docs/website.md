# Website — Next.js Frontend

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 | App Router, static export, Turbopack |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling (`@theme inline` + CSS custom properties) |
| next-intl | 4.8+ | i18n with path-based routing (`/en/`, `/it/`) |
| Node.js | 25 | Runtime (CI and local dev) |

## Pages

| Route | EN | IT | Description |
|-------|----|----|-------------|
| `/[locale]` | Home | Home | Hero with photo, stats, featured sections |
| `/[locale]/about` | About Me | Chi Sono | Bio, photos, education |
| `/[locale]/experience` | Experience | Esperienza | Career timeline |
| `/[locale]/projects` | Projects | Progetti | Selected cloud architecture work |
| `/[locale]/family` | Family & Friends | Famiglia & Amici | Childhood photos, friend testimonials |
| `/[locale]/book` | Honor Bound | Honor Bound | Memoir by Simon & Schuster |
| `/[locale]/case` | The Case | Il Caso | Legal case timeline, DNA evidence |
| `/[locale]/documents` | Documents | Documenti | 29 legal PDFs/DOCXs for download |
| `/[locale]/contact` | Contact | Contatti | Email, phone, social links |
| `/[locale]/archive` | Archive | Archivio | Memories IT, SunTickets, BeOnMemories |

## i18n

Path-based routing via `next-intl`:
- English: `/en/...`
- Italian: `/it/...`
- Root `/` redirects to `/en/` (default)

Translation files: `src/messages/en.json` and `src/messages/it.json` (198 keys each).

Async params pattern (Next.js 16):
```tsx
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // ...
}
```

## Dark/Light Mode

- CSS custom properties on `:root` (light) and `.dark` class (dark)
- `ThemeToggle` component reads/writes `localStorage("theme")`
- Inline `<script>` in `<head>` prevents flash on page load
- System preference fallback via `prefers-color-scheme`

## SEO

- **Favicon**: SVG + PNG (32px, 192px, 512px) + apple-touch-icon (180px)
- **OG Image**: 1200x630 PNG with RS monogram branding
- **Sitemap**: `sitemap.xml` with all pages, `hreflang` alternates, priorities
- **Robots**: `robots.txt` allowing all crawlers, pointing to sitemap
- **Manifest**: `site.webmanifest` for PWA support
- **Meta**: canonical URLs, Open Graph, Twitter Cards, theme-color
- **JSON-LD**: Person schema with sameAs links (LinkedIn, GitHub, Twitter)
- **GoogleBot**: max-image-preview: large, max-snippet: -1

## Legal Documents

29 PDF/DOCX files (~93MB) including court verdicts, appeals, expert reports, and transcripts. These files:

- Are **not committed to git** (`.gitignore`: `/public/documents/`)
- Already exist on the production S3 bucket from the WordPress era
- Are preserved during deploys via `--exclude "documents/*"` in the S3 sync
- Source backup: `s3://www.raffaelesollecito.org-backup-2026-03-16/documents/`

## Images

| Directory | Contents |
|-----------|----------|
| `public/images/` | Profile photos (raffaele-1 through 4), art portrait, book cover |
| `public/images/family/` | 13 childhood photos + 4 friend photos |
| `public/images/archive/` | Memories logo, SunTickets infographic, BeOnMemories brochure/design |
| `public/` | favicon.ico, icon.svg, apple-touch-icon.png, og-image.png |

## Build & Deploy

```bash
# Development
npm run dev              # localhost:3000 with Turbopack

# Production build
npm run build            # Static export to out/

# Manual staging deploy
AWS_PROFILE=iamadmin aws s3 sync out/ s3://staging.raffaelesollecito.org/ --delete
AWS_PROFILE=iamadmin aws cloudfront create-invalidation --distribution-id E1JC5ON7Q19C1J --paths "/*"
```

Production deploys happen automatically via GitHub Actions (`website.yaml`) on push to `main` when `website/**` files change.

### Deploy Pipeline Details

The `website.yaml` workflow runs three S3 sync passes:

1. **Assets** (immutable cache): All files except HTML, documents, and legacy WordPress paths
2. **HTML** (no cache): `*.html` files with `must-revalidate`
3. **SEO files** (daily cache): `sitemap.xml`, `robots.txt`, `site.webmanifest`

After sync, a CloudFront invalidation (`/*`) clears the CDN cache.
