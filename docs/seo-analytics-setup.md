# SEO, GEO/AEO and Analytics setup — raffaelesollecito.org

Status of what the code already does, and the manual steps in Google (and friends)
that only the site owner can perform. Work top to bottom; each step is idempotent.

## What the site ships (no action needed)

| Concern | Implementation |
|---|---|
| Unique title/description per page, both locales | `seo.*` in `website/src/messages/{en,it}.json`, applied via `pageMetadata()` in `website/src/lib/site.ts` |
| Canonical + `hreflang` (en, it, x-default) per page | `pageMetadata()` — self-referencing canonical, all locales + `x-default → /en/` |
| Title template `%s · Raffaele Sollecito` (home uses absolute title) | `[locale]/layout.tsx` |
| Sitemap with hreflang alternates | `website/src/app/sitemap.ts` → `/sitemap.xml` |
| robots.txt (explicitly allows AI crawlers: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) | `website/src/app/robots.ts` |
| `llms.txt` (GEO: machine-readable identity + preferred citation) | `website/public/llms.txt` |
| Structured data | Person + WebSite (every page); ProfilePage (about); Book ×2 (books); Article + FAQPage (case); BreadcrumbList (all subpages) |
| Custom 404 (bilingual) | `website/src/app/not-found.tsx` → `out/404.html`, mapped by CloudFront `custom_error_response` 403/404 |
| Redirects | CloudFront Function `modules/cloudfront/functions/url-rewrite.js`: `/` → `/{locale}/` by Accept-Language (302), no-slash → slash (301), `/book/` → `/books/`, legacy WordPress slugs → new routes |
| Security headers | `aws_cloudfront_response_headers_policy.security` (HSTS preload, nosniff, DENY framing, referrer policy, permissions policy) |
| GA4 + Search Console / Bing verification | Read from build env: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` (GitHub **Variables** `GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`) |

## 1. Google Search Console (do this first)

1. https://search.google.com/search-console → **Add property** → choose **Domain** → `raffaelesollecito.org`.
   A *Domain* property covers `https://`, `http://`, `www.` **and** `resume.raffaelesollecito.org` in one go.
2. Google gives you a TXT record `google-site-verification=…`. Add it to Route 53:
   ```bash
   AWS_PROFILE=iamadmin aws route53 change-resource-record-sets \
     --hosted-zone-id Z10348702D3SPFDJMEVEN \
     --change-batch '{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"raffaelesollecito.org","Type":"TXT","TTL":300,"ResourceRecords":[{"Value":"\"google-site-verification=PASTE_TOKEN\""}]}}]}'
   ```
   (If a TXT record already exists at the apex — e.g. SPF — add the new value as a second `ResourceRecords` entry; do not replace it.)
3. Back in Search Console → **Verify**. Then:
   - **Sitemaps** → submit `https://raffaelesollecito.org/sitemap.xml` and `https://resume.raffaelesollecito.org/sitemap.xml`.
   - **URL Inspection** → request indexing for `/en/`, `/en/case/`, `/en/books/`, `/it/`, `/it/case/`, `/de/`, `/de/case/` and the résumé root. This is the fastest way to get the new case/FAQ page into the index.
   - **Settings → Users** → keep only your accounts.
4. Optional belt-and-braces: also add the meta-tag token as GitHub Variable `GOOGLE_SITE_VERIFICATION` (repo → Settings → Secrets and variables → Actions → Variables). The DNS TXT already verifies; the meta tag survives a DNS migration.

What to watch weekly for the first two months: **Performance → Queries** for `raffaele sollecito` (brand), `raffaele sollecito aws`, `raffaele sollecito oggi`, `raffaele sollecito cloud architect`; **Enhancements → FAQ / Breadcrumbs** for rich-result validity; **Pages → Not indexed** for any legacy WordPress URL still being crawled (the CloudFront redirects should turn them into "Page with redirect").

## 2. Google Analytics 4

1. https://analytics.google.com → **Admin → Create → Property**: name `raffaelesollecito.org`, timezone Europe/Lisbon, currency EUR.
2. **Data stream → Web** → URL `https://raffaelesollecito.org`, stream name `Web`. Enable *Enhanced measurement* (scrolls, outbound clicks, file downloads — this captures the PDF résumé and Credly/Amazon clicks without custom events).
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
   - Apex site: GitHub → repo `Raffasolaries/raffaelesollecito.org` → Settings → Secrets and variables → Actions → **Variables** → `GA_MEASUREMENT_ID = G-…`. Next push to `main` that touches `website/**` bakes it in (`@next/third-parties` `GoogleAnalytics` component, loaded `afterInteractive`).
   - Résumé site: edit `raffasolaries.github.io/index.html`, replace `G-XXXXXXXXXX` in the inline GA snippet, commit. (Same property, same stream — the résumé is a subdomain of the same domain, so sessions stitch.)
4. **Admin → Data settings → Data retention** → 14 months. **Google Signals** → off (not needed; avoids consent complexity).
5. **Admin → Data streams → Configure tag settings → Define internal traffic** → add your home/office IP so your own visits are excluded; then **Data filters** → activate the *Internal Traffic* filter.
6. Mark as **Key events** (Admin → Events): `file_download` (résumé PDF), `click` with `link_domain` = `credly.com` / `linkedin.com` / `amazon.com`. These are your "recruiter intent" signals.
7. **Admin → Product links → Search Console** → link the property. GA4 then shows organic queries next to landing pages.
8. Consent: the site sets no marketing cookies; GA4 with `anonymize_ip` (résumé) / default IP truncation (GA4 does not store IP) is generally treated as low-risk, but Portugal/Italy regulators expect a notice. Add a one-line cookie/analytics notice in the footer when you have a moment (`footer.analytics_notice` key; not yet implemented).

## 3. Bing Webmaster Tools (feeds Bing, DuckDuckGo, Copilot/ChatGPT search)

https://www.bing.com/webmasters → **Import from Google Search Console** (one click, uses the same verification). Submit both sitemaps. Optional: paste the `msvalidate.01` token into GitHub Variable `BING_SITE_VERIFICATION`. Enable **IndexNow** and use the "URL submission" tool for the case and books pages once live.

## 4. Knowledge panel and entity hygiene (GEO)

The search engines already have an entity for you; the goal is to make the *professional* facts the strongest signals.

1. **Google Knowledge Panel** — search `Raffaele Sollecito` while signed in to the Google account that owns Search Console; if a panel shows, click **Claim this knowledge panel** and verify via Search Console / YouTube. Once claimed, use **Suggest edits** to set the official website (`raffaelesollecito.org`) and profile image (`/images/raffaele-1.jpg`), and to suggest the occupation "Cloud Solutions Architect".
2. **Wikidata** — there is an item for you. Add/correct: `official website` (P856) = `https://raffaelesollecito.org`, `occupation` (P106) = software engineer / cloud computing specialist, `educated at` (P69) Verona and Perugia, `notable work` (P800) both books with ISBNs, `LinkedIn personal profile ID` (P6634) = `raffasolaries`, `GitHub username` (P2037) = `Raffasolaries`. Wikidata is what LLM-based answer engines read most for disambiguation. (Editing your own item is allowed on Wikidata for factual, sourced statements; cite the site, Credly and the publishers.)
3. **LinkedIn** — set the profile *Website* to `https://raffaelesollecito.org`, add both books under *Publications*, and set the custom URL to `raffasolaries` (already). LinkedIn is the #2 result for your name and the one recruiters trust.
4. **Credly** — public profile is already linked from every page; keep badges public.
5. **Amazon Author Central** (https://author.amazon.com) — claim the author page for *Honor Bound*, add bio + website link; the author page ranks for your name in every Amazon locale.
6. **Google Books / Longanesi** — nothing to do; the Book schema on `/books/` links ISBNs, which is how Google merges the entities.
7. **YouTube / Instagram** — if you keep them, put the website in the channel/profile link fields so `sameAs` is reciprocal.

## 5. GEO / AEO specifics already in place — and how to extend

- The `/case/` page is written as *answer-first*: lede states the outcome in the first paragraph; eight FAQ pairs use the exact phrasing people ask AI assistants ("Was Raffaele Sollecito acquitted?", "How long was he in prison?"). `FAQPage` schema mirrors them. Keep answers self-contained (no "see above").
- `llms.txt` gives a preferred citation. Update `dateModified` in the JSON-LD and the résumé `ProfilePage` when facts change.
- Consider a short **/en/now/** page later (what you are working on this quarter) — AI engines weight recency for people queries.
- Do **not** add `noindex` to the case or documents pages: suppressing them makes third-party sources the only answer.

## 6. Verification checklist after the PR merges

```bash
curl -sI https://raffaelesollecito.org/ | grep -i location          # 302 → /en/, /it/ or /de/ (Accept-Language)
curl -sI https://raffaelesollecito.org/en/book/ | grep -i location  # 301 → /en/books/
curl -sI https://raffaelesollecito.org/honor-bound/ | grep -i location
curl -sI https://raffaelesollecito.org/en/nope/ | head -1           # HTTP/2 404
curl -sI https://raffaelesollecito.org/en/ | grep -i strict-transport
curl -s https://raffaelesollecito.org/sitemap.xml | head
```
Then: https://search.google.com/test/rich-results?url=https://raffaelesollecito.org/en/case/ (expect FAQ + Breadcrumb), https://validator.schema.org for `/en/books/`, and https://pagespeed.web.dev for `/en/`.
