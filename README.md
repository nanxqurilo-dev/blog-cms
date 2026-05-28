# Blog CMS

Custom blog CMS dashboard built with Next.js 16, React 19, Tailwind CSS, Radix UI, CKEditor, TipTap, and Recharts.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- CKEditor and TipTap
- Recharts

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Running backend API

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file from the example:

```bash
cp .env.example .env.local
```

If you are using PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` with your backend URL.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the backend API used by the dashboard |

Example:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint

## Build Troubleshooting

If `npm run build` fails with an error like `Failed to fetch Geist from Google Fonts`, the problem is usually not your page code. It means `next/font/google` is trying to download fonts during build, but the current machine or environment cannot reach Google Fonts.

How to identify it:

- Run `npm run build`
- Read the first real error, not only the final `Build error occurred` line
- If the stack mentions `next/font/google`, `fonts.googleapis.com`, or `Failed to fetch`, the failure is caused by build-time font downloading

How to fix it manually:

1. Open the file shown in the import trace, for example [app/layout.tsx](/C:/Users/vivek/OneDrive/Desktop/blog-cms/app/layout.tsx).
2. Look for imports such as `import { Geist } from "next/font/google"`.
3. Choose one of these approaches:
   - Best for offline-safe builds: replace Google font usage with local font files via `next/font/local`
   - Fastest fallback: remove `next/font/google` and use CSS/system font variables in `app/globals.css`
   - Keep Google fonts only if your build environment always has internet access
4. Run `npm run build` again and confirm the error is gone.

What this project now does:

- It uses CSS font variables backed by system fonts, so `npm run build` no longer depends on Google Fonts being reachable.

Reusable debugging approach for similar build errors:

1. Reproduce with `npm run build`
2. Read the earliest specific error block
3. Follow the import trace to the exact file
4. Decide whether the failure is caused by code, config, environment, or an external network dependency
5. Remove or isolate the external dependency if you need reliable local builds
6. Rebuild to verify the fix

Another common Next.js build issue:

- Error example: `File '.../app/page/[id]/page.tsx' is not a module`
- Meaning: the route file exists, but it is empty or does not export a valid page component
- Manual fix:
  1. Open the file named in the error
  2. Check whether it has `export default function Page()` or another valid page export
  3. If the route is unused, delete the file
  4. If the route is needed, add a valid default export and required imports
  5. Run `npm run build` again

Useful TypeScript workflow after the first build blocker is fixed:

1. Run `npx tsc --noEmit`
2. Fix the errors from top to bottom
3. Run `npx tsc --noEmit` again
4. When TypeScript is clean, run `npm run build`

Common TypeScript patterns in this project:

- Error example: `Argument of type '(prev: never[]) => any[]' is not assignable...`
- Meaning: `useState([])` was inferred as `never[]`
- Manual fix: type the state explicitly, for example `useState<Post[]>([])` or `useState<any[]>([])`

- Error example: `Parameter 'field' implicitly has an 'any' type`
- Meaning: TypeScript needs explicit parameter types
- Manual fix: add parameter types, for example `(field: string, value: string) => { ... }`

## Deployment

Detailed deployment instructions are in [DEPLOYMENT.md](/C:/Users/vivek/OneDrive/Desktop/blog-cms/DEPLOYMENT.md).

Short Vercel flow:

1. Push the finished code to the `main` branch.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_API_BASE_URL` in Vercel Project Settings.
4. Deploy.

## Branch Workflow

- `development` contains the latest completed work
- `main` should contain the production-ready code you deploy from

If you need to promote development work manually:

```bash
git checkout main
git merge development
git push origin main
```

## Notes

- This app depends on a separate backend API.
- In this environment, `next build` could not fully complete because Google Fonts were blocked by network sandboxing. Vercel builds should still be able to fetch those fonts normally.
- `npm run lint` currently reports existing lint errors in the codebase. Those do not stop the branch merge, but they should be cleaned up if you want a fully clean CI pipeline.
