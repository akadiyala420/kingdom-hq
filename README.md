# Kingdom HQ — Minecraft Co-op Campaign

A mobile-first React/Vite app for a two-player Minecraft Bedrock kingdom campaign.

## What it does
- State-driven campaign phases and prerequisites
- Main objectives unlock based on completed objectives
- Current recommended objective
- 60–90 minute session screen
- Beginner Minecraft guide
- Capital/district planner
- Villager progression and profession reference
- Resource guide
- Build checklist
- Custom projects
- Royal coordinates
- Local persistence via browser localStorage
- No backend and no paid service required

## Run locally
1. Install Node.js (LTS).
2. In this folder run:
   npm install
   npm run dev
3. Open the URL Vite prints, usually http://localhost:5173

## Build
npm run build
npm run preview

## Free hosting: GitHub Pages
Recommended if you want a simple permanent URL.

1. Create a GitHub repository named `kingdom-hq`.
2. Upload this project.
3. In repository Settings → Pages, choose GitHub Actions.
4. Add a Vite deployment workflow (or use the Vite/GitHub Pages documentation).
5. The resulting URL will be `https://YOURNAME.github.io/kingdom-hq/`.

For the cleanest no-configuration deployment, Cloudflare Pages or Vercel can deploy a Vite repository automatically. Use build command `npm run build` and output directory `dist`.

## Important
The app stores campaign progress on each device/browser separately. There is currently no shared online database. If both players need to see the exact same progress, the next version should add a small free backend (for example Supabase).
