# raffaelesollecito.org — Site Structure & Content Analysis

## Overview

- **Platform:** WordPress (Twenty Twenty-Two theme), exported as static HTML via WP2Static
- **Language:** Italian (it-IT), with some English posts
- **Tagline:** "Relentless daydreamer"
- **Served via:** S3 + CloudFront (static files)

## Site Map

### Primary Navigation

| Path                  | Title              | Type                |
|-----------------------|--------------------|---------------------|
| `/`                   | Homepage / About   | Professional bio    |
| `/blog-processo/`     | Blog Processo      | Post archive (paginated) |
| `/documenti/`         | Documenti Processo | Document repository |
| `/progetti/`          | Progetti           | Projects portfolio  |
| `/honor-bound/`       | Honor Bound        | Book promotion page |
| `/famiglia-e-amici/`  | Famiglia e Amici   | Family & friends    |

### Footer Pages

| Path              | Title          |
|-------------------|----------------|
| `/cookie-policy/` | Cookie Policy  |
| `/privacy-policy/`| Privacy Policy |

### Blog Posts (under `/blog-processo/`)

| Path | Title | Language |
|------|-------|----------|
| `/considerazioni-sul-processo/` | Considerazioni sul processo | IT |
| `/the-supreme-court-considerations/` | The Supreme Court - considerations | EN |
| `/il-film-horror-dellomicidio-di-meredith-kercher/` | Il film horror dell'omicidio di Meredith Kercher | IT |
| `/la-storia-conosciuta-di-rudy-guede-patrick-king/` | La storia conosciuta di Rudy Guede - Patrick King | IT |
| `/the-dna-tale/` | The DNA tale | EN |
| `/le-orme-di-piede-sul-corridoio/` | Le orme di piede sul corridoio | IT |
| `/the-flying-cows/` | The flying cows | EN |
| `/commento-alla-sentenza-della-corte-di-cassazione-luca-cheli/` | Commento alla sentenza della Corte di Cassazione - Luca Cheli | IT |
| `/il-dna-sul-coltello/` | Il DNA sul Coltello | IT |
| `/requisitoria-procuratore-della-repubblica-italiana-a-firenze-alessandro-crini/` | Requisitoria Procuratore... | IT |
| `/quello-che-ha-detto-la-polizia-scientifica/` | Quello che ha detto la polizia scientifica | IT |
| `/the-actual-case-updated-in-pills/` | The actual case updated in pills | EN |

### Project Posts

| Path | Title |
|------|-------|
| `/suntickets-memories-it-company/` | SunTickets - Memories IT Company |

## Homepage Content Summary

Professional bio as Cloud Solutions Architect at Volkswagen Digital Solutions. Previous roles at ITnet srl, Tantosvago srl, Key Partner srl, Memories srls (CEO). Skills: AWS (CDK, CloudFormation, Control Tower), CI/CD (GitLab), event-driven architectures, REST APIs, containerization, Laravel, Angular 2+, WordPress. Certifications: AWS Solutions Architect Professional, Associate, Cloud Practitioner. Education: Master's (Visual Computing, Univ. of Verona), Erasmus (TU Munich), Bachelor's (CS, Univ. of Perugia).

## Key Assets (in `/wp-content/uploads/`)

- `2022/05/cropped-image2.jpg` — Profile photo / site logo (512x512)
- `2023/06/processo-meredith.jpg` — Blog Processo featured image
- `2022/05/resources-documents.jpg` — Documenti featured image
- `2023/06/multicloud-diagram.jpg` — Progetti featured image
- `2022/05/MEM_suntickets_logo_reg.png` — SunTickets logo
- Various family photos in `2022/05/`

## External Links

### Social Profiles
- LinkedIn: linkedin.com/in/raffasolaries/
- Twitter: twitter.com/Raffasolaries
- YouTube: youtube.com/channel/UC0mJESQVEjzvykfe-TiGGHw
- Instagram: instagram.com/raffasolaries/
- Facebook: facebook.com/raffaele.sollecito

### External Document Sites
- masseireport.wordpress.com — First-level trial conviction report (EN)
- hellmannreport.wordpress.com — Appellate acquittal report (EN)
- knoxdnareport.wordpress.com — Conti-Vecchiotti DNA expert report (EN)

## Technical Notes

- All content published May 2022, some images updated June 2023
- Blog categories: "Juris", "Mondi Paralleli", "Information Technology"
- Cookie compliance: GDPR Cookie Consent plugin + CCPA
- WP REST API, wp-login, robots.txt, sitemap.xml all return 403 (blocked)
- Schema.org markup: Person, Organization, WebSite, Article, WebPage
- Font: Source Serif Pro (variable weight 200-900)
- Color scheme: primary #1a4548 (dark teal), secondary #ffe2c7 (peach)
