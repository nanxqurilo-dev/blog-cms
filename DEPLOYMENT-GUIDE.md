# Blog CMS - Deployment Guide

## Overview
This document provides step-by-step instructions to merge your complete code from the **development** branch into the **main** branch and deploy it on Vercel.

---

## Current Situation
- ✅ Complete code is in `development` branch
- ⚠️ Partial code is in `main` branch
- ✅ Goal: Merge all code into `main` branch for Vercel deployment

---

## Step-by-Step Process

### Step 1: Check Current Branch Status

Open your terminal in the project folder and run:

```bash
git status
git branch
```

This will show:
- Which branch you're currently on
- Any uncommitted changes
- List of all branches

---

### Step 2: Backup Your Code (Recommended)

Before making any changes, create a backup branch:

```bash
git checkout development
git branch backup-development
git push -u origin backup-development
```

This saves a copy of your complete development code on remote.

---

### Step 3: Switch to Main Branch

```bash
git checkout main
```

---

### Step 4: Merge Development Branch into Main

Merge all code from development branch to main:

```bash
git merge development
```

**If you get merge conflicts:**
1. Open the conflicting files
2. Look for conflict markers like `<<<<<<< HEAD`
3. Keep the code you want (from development branch)
4. Remove conflict markers
5. Save the files
6. Run:
   ```bash
   git add .
   git commit -m "Resolve merge conflicts"
   ```

---

### Step 5: Push Main Branch to Remote

```bash
git push -u origin main
```

This uploads all your complete code to the main branch on GitHub.

---

### Step 6: Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in

2. **Add New Project**:
   - Click **"Add New..."** button
   - Select **"Project"**

3. **Import Repository**:
   - Find your `blog-cms` repository
   - Click **"Import"**

4. **Configure Project**:
   - Framework Preset: `Next.js` (auto-detected)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy**:
   - Click **"Deploy"** button
   - Wait for deployment to complete

6. **Get Your URL**:
   - Vercel will provide a live URL (e.g., `your-project.vercel.app`)
   - Share this URL to access your deployed blog

#### Option B: Via Vercel CLI

If you have Vercel CLI installed:

```bash
vercel login
vercel --prod
```

Follow the on-screen instructions.

---

### Step 7: Verify Deployment

After deployment:
1. Visit your live URL
2. Test all pages:
   - Home page
   - Login page
   - Dashboard
   - Blog posts
3. Check for any errors

---

## Troubleshooting

### Issue: Merge Conflicts

**Solution**:
```bash
# Abort merge if needed
git merge --abort

# Try again after resolving
git merge development
```

### Issue: Main Branch Not Showing on Vercel

**Solution**:
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Git**
4. Under **Production Branch**, ensure `main` is selected
5. Click **"Deploy"** again

### Issue: Build Errors on Vercel

**Solution**:
1. Check build logs on Vercel dashboard
2. Common fixes:
   - Run `npm run build` locally to check errors
   - Ensure all dependencies are in `package.json`
   - Check environment variables are set in Vercel

---

## Quick Command Reference

| Action | Command |
|--------|---------|
| Check branches | `git branch` |
| Switch to main | `git checkout main` |
| Merge development | `git merge development` |
| Push to remote | `git push -u origin main` |
| Check status | `git status` |

---

## Post-Deployment Checklist

- [ ] Main branch has all complete code
- [ ] Vercel deployment successful
- [ ] All pages working correctly
- [ ] No build errors
- [ ] Environment variables configured (if needed)

---

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify GitHub repository has main branch updated
3. Contact support or search Vercel documentation

---

**Document Created**: April 25, 2026
**Project**: Blog CMS
**Purpose**: Deploy complete code to Vercel via main branch