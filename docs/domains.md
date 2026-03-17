# Domain Management

## Domain Inventory

```mermaid
graph LR
    subgraph "Primary"
        A[raffaelesollecito.org] --> CF[CloudFront CDN]
    end

    subgraph "Redirects → raffaelesollecito.org"
        B[www.raffaelesollecito.org] -->|301| A
        C[raffaelesollecito.com] -->|301| A
        D[www.raffaelesollecito.com] -->|301| A
        E[raffaelesollecito.it] -->|301| A
        F[www.raffaelesollecito.it] -->|301| A
    end

    subgraph "Redirects → /archive/"
        G[suntickets.it] -->|301 locale| H["/en/archive/ or /it/archive/"]
        I[www.suntickets.it] -->|301 locale| H
    end

    subgraph "Separate (not redirected)"
        J[italianfinestone.com]
        K[ivorycleanersflorida.com]
    end
```

## Route53 Hosted Zones

| Domain | Zone ID | Records | Purpose |
|--------|---------|---------|---------|
| raffaelesollecito.org | Z10348702D3SPFDJMEVEN | A alias, www CNAME, ACM CNAME | Primary site |
| raffaelesollecito.com | Z00061822XXU0URGO4KDL | A alias, www A alias, ACM CNAME | Redirect to .org |
| raffaelesollecito.it | Z00582702KHBK8CRMY8OK | A alias, www A alias, ACM CNAME | Redirect to .org |
| suntickets.it | Z05555093JQD0GMO8XCAN | A alias, www A alias, ACM CNAME | Redirect to /archive/ |
| italianfinestone.com | Z02731132IAQ61MXV0IF | Various | Separate site |
| ivorycleanersflorida.com | Z07197043QJJL2YKDTJN8 | Various | Separate site |

## ACM Certificate

Single certificate covering all domains:

- `raffaelesollecito.org` (primary)
- `www.raffaelesollecito.org`
- `raffaelesollecito.com` + `www`
- `raffaelesollecito.it` + `www`
- `suntickets.it` + `www`

Managed in Terraform (`acm.tf`). DNS validation records are created in each domain's hosted zone automatically.

## Redirect Logic

All redirects are handled at the CloudFront edge by a single CloudFront Function (`modules/cloudfront/functions/url-rewrite.js`):

```mermaid
flowchart TD
    A[Incoming Request] --> B{Host header?}
    B -->|www.raffaelesollecito.org| C[301 → raffaelesollecito.org + path]
    B -->|.com or .it variants| D[301 → raffaelesollecito.org + path]
    B -->|suntickets.it| E{Accept-Language?}
    E -->|starts with 'it'| F[301 → /it/archive/]
    E -->|else| G[301 → /en/archive/]
    B -->|raffaelesollecito.org| H{URI pattern?}
    H -->|ends with /| I[Append index.html]
    H -->|ends with .php| J[Replace with .html]
    H -->|no extension| K[Append /index.html]
    H -->|has extension| L[Pass through]
```

## SEO Considerations

- **Canonical domain**: `raffaelesollecito.org` (no www)
- All alternate domains return **301 Moved Permanently** (permanent redirect)
- Google consolidates link equity to the canonical domain
- `sitemap.xml` and `robots.txt` reference only `raffaelesollecito.org`
- `hreflang` alternates in sitemap for EN/IT language versions

## Adding a New Redirect Domain

1. Register the domain and create a Route53 hosted zone
2. Add to `redirect_domains` in `local.tfvars` / GitHub Variables:
   ```hcl
   "newdomain.com" = {
     zone_id     = "Z_NEW_ZONE_ID"
     redirect_to = "https://raffaelesollecito.org"
   }
   ```
3. Add `"newdomain.com"` and `"www.newdomain.com"` to `cloudfront_aliases`
4. Add the domain to the `REDIRECT_MAP` in `url-rewrite.js`
5. Run Terraform apply — creates ACM SANs, DNS validation, Route53 records
