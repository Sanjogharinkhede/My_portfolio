# Cloudflare Setup

## Pages Build

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- The `public/_redirects` file preserves React routes such as `/about` and `/briefing` on direct visits.

## Required Bindings

Add these bindings to the Pages project for the Production environment:

| Binding | Type | Purpose |
|---|---|---|
| `AI_QUOTA_DB` | D1 database | Atomic daily Gemini request/token reservation |
| `SITE_PULSE_KV` | KV namespace | Aggregate public views and likes |

Apply `functions/schema.sql` to the selected D1 database before enabling Gemini.

## Required Secrets and Variables

Add secrets through Cloudflare Pages settings. Do not commit them or put them in frontend variables.

| Name | Type | Value |
|---|---|---|
| `GEMINI_API_KEY` | Secret | Google AI Studio key |
| `TURNSTILE_SECRET_KEY` | Secret | Cloudflare Turnstile secret |
| `RESEND_API_KEY` | Secret | Resend API key |
| `GEMINI_MODEL` | Variable | `gemini-3.6-flash` |
| `CONTACT_RECIPIENT` | Variable | `sanjogharinkhede@gmail.com` |
| `CONTACT_FROM` | Variable | Verified sender address |

Set these public build variables only when their feature is configured:

```text
VITE_ENABLE_GEMINI=true
VITE_ENABLE_CONTACT=true
VITE_ENABLE_SITE_PULSE=true
VITE_TURNSTILE_SITE_KEY=your-public-site-key
```

## Wrangler

Copy `wrangler.toml.example` to `wrangler.toml` only after replacing the KV namespace ID and D1 database ID with the real non-secret values from Cloudflare.

Keep `.dev.vars` out of source control. It is for server-only local secrets when running a Functions-compatible local environment.

## Deployment Gate

Before production release:

1. Connect the GitHub repository to Cloudflare Pages.
2. Set the Vite build command and `dist` output directory.
3. Add the D1 and KV bindings.
4. Apply `functions/schema.sql` to D1.
5. Add encrypted secrets and public variables.
6. Verify Turnstile hostnames include the deployed Pages hostname.
7. Deploy and test `/briefing`, `/connect`, `/api/briefing`, `/api/contact`, `/api/metrics`, and `/api/like`.
8. Confirm no secret appears in build output or browser source.
