# Deployment Guide

## Goal

Use this file when you are ready to deploy the latest CMS code from `main` to Vercel.

## 1. Move The Finished Code To `main`

If your completed work is already in `development`, promote it with:

```bash
git checkout main
git merge development
git push origin main
```

If Git reports conflicts:

1. Open the conflicted files.
2. Keep the correct final code.
3. Save the files.
4. Run:

```bash
git add .
git commit
git push origin main
```

## 2. Confirm The Project Builds

Run:

```bash
npm install
npm run build
```

If the build fails locally because fonts cannot be downloaded, that is usually an environment/network issue. Vercel normally has access to Google Fonts during build.

## 3. Required Environment Variable

Set this variable in Vercel:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

Use the full backend base URL, for example:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## 4. Deploy To Vercel

1. Open `https://vercel.com`
2. Click `Add New Project`
3. Import your GitHub repository
4. Select the repository that contains this project
5. Keep the default framework as `Next.js`
6. Add the environment variable from the previous section
7. Click `Deploy`

## 5. Vercel Project Settings

Recommended settings:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave default

## 6. After Deployment

Check these flows in production:

- Login
- Dashboard data loading
- Posts list
- Drafts
- Builder/editor
- SEO page
- Settings page
- Image loading from allowed remote domains

## 7. If Something Breaks

Common checks:

- Confirm `NEXT_PUBLIC_API_BASE_URL` is correct
- Confirm your backend allows requests from your Vercel domain
- Confirm API routes are live in production
- Confirm image URLs are from allowed domains in `next.config.ts`
- Check Vercel build logs for the exact failing file

## 8. Suggested Release Flow

Use this flow for future updates:

1. Build features on `development`
2. Test locally
3. Merge `development` into `main`
4. Push `main`
5. Let Vercel deploy from `main`
