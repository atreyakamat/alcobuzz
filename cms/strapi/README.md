# Strapi CMS Setup

This directory is mounted into the Strapi Docker container.

## Start CMS

```bash
docker compose up cms db
```

Then open `http://localhost:1337/admin` to create an admin user and define collections:
- articles
- categories
- tags
- authors
- magazines

Use Cloudinary provider in Strapi settings for media uploads.
