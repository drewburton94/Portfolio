# Drew Burton — Portfolio

Static site (no framework). Copy lives in `scripts/content.mjs`; regenerate pages with:

```
node scripts/build.mjs
```

This writes the whole site to a single `index.html`. The case studies open in place (deep links like `#work/academy` work). Styles are in `assets/css/site.css`, behaviour in `assets/js/site.js`.
Deploy the repo root as-is (Vercel / GitHub Pages / Netlify).

To do: add real project screenshots (the case-study visuals are placeholder art in `build.mjs`), a résumé PDF (`site.resume`), and a GitHub URL (`site.github`).

## Chat assistant

A floating "Ask about Drew" chat answers visitors' questions from `api/_knowledge/drew.md`.
Edit that file to teach it more (or remove anything you don't want it to say), then redeploy.

- Backend: `api/chat.js` (Vercel serverless function) calls the Claude API. Set `ANTHROPIC_API_KEY` in the Vercel project's environment variables. Optionally set `CHAT_MODEL` (default `claude-haiku-5-5`).
- Guardrails: answers only from the knowledge file, declines off-topic requests, caps message length and history, and rate-limits per visitor (20 messages per 10 minutes).
- It only works on the deployed site. The static preview shows a friendly "not available" message.
