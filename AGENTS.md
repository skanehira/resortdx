# Repository Guidelines

## Project Structure & Module Organization
- `src/main.tsx` bootstraps React with Vite; routing and app shell live in `src/App.tsx`.
- UI is grouped by role: `src/components/admin`, `staff`, `guest`, `shuttle`, plus shared UI in `components/ui` and `components/shared`.
- Data is mocked under `src/data/mock`; update or extend these fixtures when adjusting features.
- Localization strings are in `src/i18n/locales/{en,ja}`; add keys in both languages and re-export via `src/i18n/index.ts`.
- State helpers sit in `src/contexts` (e.g., `AuthContext`) and typed models in `src/types`. Utility adapters live in `src/utils`.
- Static styles reside in `src/index.css`; Tailwind 4 utility classes are used throughout.

## Build, Test, and Development Commands
- `npm run dev` — start the Vite dev server with hot reload.
- `npm run build` — type-check (`tsc -b`) then produce production assets in `dist/`.
- `npm run preview` — serve the built site locally for final verification.
- `npm run fmt` — format TypeScript/TSX with `oxfmt` (writes in place).
- `npm run lint` — run `oxlint` with warnings treated as errors.
- `npm run check` — convenience: format, lint, and type-check in one go; run before pushing.

## Coding Style & Naming Conventions
- TypeScript + React with ES modules and functional components; prefer named exports.
- Indentation is 2 spaces; use double quotes for strings; keep imports sorted by path depth.
- Tailwind classes stay in JSX; avoid inline style objects when a utility exists.
- Components and files use `PascalCase.tsx`; utility modules use `camelCase.ts`.
- Keep translations consistent: use `t("namespace.key")` and ensure both `en` and `ja` entries exist.

## Testing Guidelines
- No automated tests are present yet; add Vitest + React Testing Library when contributing features that change logic.
- Place tests near sources (e.g., `src/components/admin/__tests__/Dashboard.test.tsx`).
- Favor realistic mock data from `src/data/mock` to mirror UI behavior.
- Targeted coverage is preferred over blanket thresholds; exercise hooks, context, and routing paths you modify.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative style (`"Update app auth routing"`, `"docs: update README"`); keep subject ≤72 chars.
- One change per commit where possible; include relevant files for formatting and i18n updates.
- Before opening a PR, run `npm run check` and note the output if anything fails.
- PRs should include: a concise summary, linked issue (if any), steps to verify, and screenshots/GIFs for UI changes (desktop and mobile views).

## Security & Configuration Tips
- Do not commit secrets; Vite only exposes `VITE_*` env vars to the client. Use `.env.local` for local values and add new vars to project docs when needed.
- Keep mock data free of real customer information; redact anything sensitive before sharing artifacts or screenshots.
