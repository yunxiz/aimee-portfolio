# Aimee (Yunxi) Zeng — portfolio

Plain static site: `index.html`, `styles.css`, `script.js`, and an `assets/` folder. No build step.

## Add your files
- `assets/photo.jpg` — portrait, roughly 4:5 (e.g. 960×1200). Shown beside your name; a circle on phones. Until it exists, the hero shows "AZ".
- `assets/resume.pdf` — linked from the hero.
- Project images go in `assets/projects/`. Any figure whose file is missing hides itself, so these are optional:
  - `downscaling-1.jpg` — 25 km input vs 1.5 km output, side by side
  - `solar-siting-1.jpg` — a map from the Streamlit app
  - `baima-deforested-patches.jpg`, `baima-carbon-map.jpg` — already included (from the paper)
- Search `index.html` for `TODO` to fill in the EyeSpy dates and stack.

## Run locally
    python3 -m http.server 8000
Then open http://localhost:8000

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy. Every push to `main` redeploys automatically.

Custom domain: Project → Settings → Domains.
