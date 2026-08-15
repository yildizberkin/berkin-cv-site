# Berkin Yıldız — Infrastructure Console

Personal infrastructure, networking and security portfolio presented as an interactive operations console.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Cloudflare setup

1. Authenticate once with `npx wrangler login`.
2. Create the D1 database: `npx wrangler d1 create berkin-portfolio-contact`.
3. Replace the placeholder `database_id` in `wrangler.jsonc` with the returned ID.
4. Apply the migration: `npx wrangler d1 migrations apply berkin-portfolio-contact --remote`.
5. Deploy with `npm run deploy`.

The contact gateway remains inactive until its server-side secrets are configured. The destination email is never stored in client code.

## Contact secrets

Set each value interactively; never commit them:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_DESTINATION
npx wrangler secret put CONTACT_SENDER
npx wrangler secret put CONTACT_GUARD_SALT
```

## GitHub deployment

The included workflow deploys `main` after these repository secrets are configured:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Privacy

The public site does not expose a phone number, email destination, credential IDs, employer infrastructure identifiers, addresses, IPs or internal topology details.
