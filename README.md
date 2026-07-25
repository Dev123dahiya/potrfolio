# Dev Kumar Dahiya — Portfolio

A fast, responsive single-page portfolio built with **React + TypeScript + Vite + Tailwind CSS + Framer Motion**. It features your experience, projects, skills, publication, education, and a **live section that pulls your latest GitHub repositories** at runtime.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production
```bash
npm run build      # outputs static files to dist/
npm run preview    # preview the production build locally
```

## Deploy (pick one)
- **Vercel**: import the repo at vercel.com → framework "Vite" → deploy. Zero config.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: `npm run build`, then publish the `dist/` folder (the Vite `base: './'` is already set so relative asset paths work on a project subpath).

## Make it yours
- **All text/content** lives in `src/data.ts` — edit there.
- **Profile photo**: defaults to your public GitHub avatar (`github.com/Dev123dahiya.png`). To use your LinkedIn photo instead, save it as `public/profile.jpg` and set `photo: "/profile.jpg"` in `src/data.ts`.
- **Résumé**: replace `public/Dev_Kumar_Dahiya_Resume.pdf` to update the download.
- **GitHub feed**: set `GITHUB_USERNAME` in `src/data.ts` (already `Dev123dahiya`).
- **Colors/fonts**: `tailwind.config.js` (`accent`, `accent2`, etc.).

## Tech
React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · lucide-react
