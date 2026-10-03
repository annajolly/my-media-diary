# MyMediaDiary

Track movies watched and books read. Built with React, MUI and Firebase, bundled with [Vite](https://vite.dev).

## Setup

Requires Node 22.12+.

```
npm install
cp .env.example .env   # then fill in the keys
```

Environment variables must start with `VITE_` to be exposed to the app, and are read with `import.meta.env.VITE_*`.

## Scripts

- `npm start` – dev server at http://localhost:3000
- `npm run build` – production build into `build/` (deployed to Firebase Hosting)
- `npm run preview` – serve the production build locally
- `npm test` – run tests with Vitest (watch mode; `npm test -- --run` for a single run)
