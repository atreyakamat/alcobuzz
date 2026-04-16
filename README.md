# Alcobuzz

Production-ready monorepo scaffold for an editorial-first media publishing platform.

## Folder Structure

```text
/apps
  /web                 # Next.js 15 frontend
/packages
  /ui                  # shared UI primitives
  /lib                 # typed CMS/data/SEO helpers + tests
/cms
  /strapi              # Strapi runtime mount + CMS setup notes
/infra
  /docker              # Dockerfiles
```

## Implemented Features

- Homepage: Vogue-inspired editorial hero, trending/latest, category blocks, magazine spotlight
- Articles: `/articles/[slug]`, SEO metadata, JSON-LD, tags, related content
- Category pages: `/category/[slug]` with tag filtering + grid/list toggle
- Magazine rack and issue detail pages
- Flipbook reader: `/magazine/[issue]/read` using PDF.js + framer-motion transitions + mobile swipe
- Search: global bar + `/search` with query/category/tag filtering
- CMS integration: Strapi + WordPress headless client support with robust fallback data
- Integrations: Mailchimp newsletter API route, social-ready sharing hooks, GA script
- Accessibility + responsive layout + loading + 404 fallback
- Sitemap generation and image optimization via Next.js

## Key Components

- `apps/web/components/article-card.tsx`
- `apps/web/components/flipbook-viewer.tsx`
- `apps/web/components/search-bar.tsx`
- `packages/lib/src/cms.ts`
- `packages/lib/src/seo.ts`

## Environment Variables

Use `.env.example`:

- `CMS_PROVIDER` (`strapi` or `wordpress`)
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `WORDPRESS_API_URL`
- `WORDPRESS_API_USER`
- `WORDPRESS_API_APP_PASSWORD`
- `WORDPRESS_MAGAZINE_POST_TYPE` (optional, defaults to `magazine_issue`)
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- `CLOUDINARY_*`
- `MAILCHIMP_*`

## Local Setup

```bash
npm install
npm run dev
```

Web app: `http://localhost:3000`

## Test

```bash
npm test
```

## Lint + Build

```bash
npm run lint
npm run build
```

## WordPress (Hostinger) Headless Integration

1. In your Hostinger WordPress admin, enable REST API access and create an Application Password for an editor/admin user.
2. Configure frontend env vars:
   - `CMS_PROVIDER=wordpress`
   - `WORDPRESS_API_URL=https://your-domain.com`
   - `WORDPRESS_API_USER=editor-username`
   - `WORDPRESS_API_APP_PASSWORD=xxxxxxxxxxxxxxxx` (use the app password value without spaces)
3. Publish content in WordPress:
   - Posts for articles
   - Categories/Tags taxonomy
   - Optional custom post type `magazine_issue` for the digital rack
4. Redeploy frontend on Vercel after updating env vars.

## Docker / Deployment

### Full local stack

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Strapi CMS: `http://localhost:1337`
- PostgreSQL: `localhost:5432`

### Vercel (Frontend)

1. Import repository in Vercel.
2. Set project root to `apps/web`.
3. Configure environment variables from `.env.example`.
4. Deploy.

### CMS hosting

- **Strapi path:**
  1. Deploy Strapi container with Postgres.
  2. Configure media provider (Cloudinary) in Strapi.
  3. Add production `STRAPI_API_URL` and `STRAPI_API_TOKEN` to Vercel.

- **WordPress path (Hostinger-ready):**
  1. Use Hostinger-managed WordPress.
  2. Create application password credentials.
  3. Add `WORDPRESS_*` variables and `CMS_PROVIDER=wordpress` in Vercel.
