# Drew Burton — Portfolio

Static site (no framework). Copy lives in `scripts/content.mjs`; regenerate pages with:

```
node scripts/build.mjs
```

This writes `index.html` and `work/*.html`. Styles are in `assets/css/site.css`, behaviour in `assets/js/site.js`.
Deploy the repo root as-is (Vercel / GitHub Pages / Netlify).

To do: add real project screenshots (the case-study visuals are placeholder art in `build.mjs`), a résumé PDF (`site.resume`), and a GitHub URL (`site.github`).
