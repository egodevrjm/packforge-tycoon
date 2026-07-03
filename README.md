# PackForge Tycoon

PackForge Tycoon is a browser-based management tycoon framework and playable game collection. It includes a reusable simulation engine, multiple data-driven tycoon packs, a polished in-game command UI, and an SDK-style package layout for future game builders.

## What Is Included

- Reusable TypeScript simulation core with renderer-independent state.
- Data-driven game packs for studios, festivals, hotels, scrapyards, coffee shops, colonies, and more.
- Browser UI built with Vite, TypeScript, Shoelace, and Phaser-ready renderer boundaries.
- Local save support and pack selection/founder setup.
- Downloadable SDK bundles served from `public/downloads`.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Validate

```bash
npm test
npm run build
npm run test:e2e
```

## SDK Packages

The workspace contains:

- `@packforge/core`
- `@packforge/packs`
- `@packforge/builder-kit`

Use `npm run pack:sdk` to rebuild downloadable package archives.
