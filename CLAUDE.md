# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 web application for the Chinese TTRPG "Band of Blades" (刀锋联队). It is a campaign assistant tool supporting room-based multiplayer collaboration: a GM manages a campaign room and players join via a 6-digit room code to view character sheets, legion status, and rules reference.

The aesthetic is "immersive field archive" — dark military-fantasy, resembling a weathered military ledger. The interface should feel like scanned wartime documents, not a modern SaaS dashboard.

## Common Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Static generation
npm run generate

# Preview production build
npm run preview

# Database migrations (Drizzle Kit)
npx drizzle-kit generate
npx drizzle-kit migrate
```

There is **no test framework, ESLint, or Prettier** configured in this project.

## High-Level Architecture

### Stack
- **Framework**: Nuxt 4.4.2 (Vue 3, Vue Router 5)
- **Styling**: Tailwind CSS 4 + custom `field-*` design tokens in `tailwind.config.ts`
- **Database**: SQLite via `@libsql/client` + Drizzle ORM
- **Server**: Nuxt Nitro (server-side API routes)
- **Deployment**: Self-hosted VPS; `dist` is a symlink to `.output/public`

### Data Flow
```
Browser (Vue composables)
  ↓ $fetch
Nitro Server API (server/api/rooms/[code]/...)
  ↓ @libsql/client
SQLite file (data/campaign.db)
```

### Room & Permission Model
- **Room**: 6-character alphanumeric code (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`)
- **GM Access**: `gmToken` (32-char random) or universal GM code `199851998`. GM has full read/write.
- **Player Access**: room code only, read-only view.
- **No user registration or accounts**.
- Player name is stored in `localStorage` via `usePlayerName()` composable.

### Database Schema (`db/schema.ts`)
Key tables:
- `rooms` — campaign rooms
- `legionState` — per-room legion resources, role states (JSON columns for marshal/quartermaster/lorekeeper state, spy network, etc.)
- `characters` — player characters with 16 action columns, harm/stress/trauma/rot tracking, gear JSON
- `deployments` — missions
- `progressClocks` — progress clocks
- `chronicleEntries` — lore/chronicle records
- `actionLogs` — operation audit trail
- `mapAnnotations` — drawing annotations for the tactical map

Drizzle migrations live in `db/migrations/`. The SQLite file is `data/campaign.db` (gitignored).

### Routing Structure
| Route | Purpose |
|-------|---------|
| `/` | Home / legion status overview |
| `/wiki` | Rules reference (single-page, heavy use of `WikiSection`/`WikiCard`) |
| `/room` | Create or join a campaign room |
| `/room/:code` | Room dashboard (legion status, character roster, deployments) |
| `/room/:code/create-character` | 6-step character creation wizard |
| `/room/:code/character/:id` | Character detail sheet |
| `/room/:code/legion-role/:role` | Role management (commander, marshal, quartermaster, lorekeeper, spymaster) |

### Component Organization
Components are auto-imported with two registration rules in `nuxt.config.ts`:
- `~/components/wiki` → imported without path prefix (e.g., `<WikiCard>`)
- `~/components` → imported with path prefix (e.g., `<LegionActionPanel>`, `<CharacterCreateStepRole>`)

### Shared Game Data
Game rules data (roles, cultures, actions, gear, legion roles, etc.) is defined in TypeScript under `shared/data/` and re-exported through `shared/game-data.ts`. Nuxt auto-imports the `shared/` directory to both client and server.

### Server API Patterns
- DB access via `getDb()` from `server/utils/db.ts` (singleton, lazy-init)
- GM verification via `verifyGMToken()` / `verifyGMCode()` (supports both per-room token and universal GM code)
- Error responses use `createError({ statusCode, statusMessage })`

## Design System Constraints

These are hard requirements derived from `.impeccable.md` and `DESIGN.md`. Violating them degrades the product identity.

### Aesthetic
- **Theme**: "Immersive Field Archive" — dark, weathered paper, ink stamps, military ledgers.
- **Mood keywords**: 残破 (tattered), 庄严 (solemn), 紧迫 (urgent).
- **Dark mode only**. No light mode.

### Color Palette (Tailwind `field-*` tokens)
- Background: `bg-field-bg` (`#252320`)
- Paper/card surface: `bg-field-paper` / `#d8c8a8` for archive cards
- Primary text on dark: `text-field-paper`
- Ink/brown text on paper: `text-field-ink` (`#2c2418`)
- Accent — gold: `text-field-gold` / `border-field-gold`
- Accent — red (harm/death/warning): `text-field-red` / `border-field-red`
- Accent — purple (corruption/mystery): `text-field-purple`
- Muted: `text-field-slate`, `text-field-ink-light`

### Typography
- **Brush/title**: `font-brush` (`Ma Shan Zheng`) — page titles, decorative headers
- **Handwritten note**: `font-hand` (`ZCOOL XiaoWei`) — marginalia, flavor text
- **Body**: `font-serif-zh` (`Noto Serif SC`) — readable body text
- **Data/mono**: `font-mono` (`JetBrains Mono`) — stats, labels, numbers, military codes

### Predefined Component Classes (`app/assets/css/main.css`)
Reuse these instead of inventing new UI patterns:
- `.card-archive` — yellowed paper card with noise texture
- `.btn-seal` — gold-bordered button for dark backgrounds
- `.btn-seal-dark` — dark-bordered button for paper cards
- `.input-ink` — transparent underline input for dark bg
- `.input-paper` — boxed input for paper cards
- `.stamp` / `.stamp-gold` — angled border badges
- `.handnote` — handwritten annotation style
- `.title-brush` — brush-stroke title

### Forbidden Patterns
Do **not** use:
- Blue/purple gradients, glassmorphism, neon glows
- Large rounded card grids, centered hero metrics
- SaaS dashboard aesthetics (white cards, blue buttons, flat icons)
- Anime/cartoon styles
- Perfect pixel symmetry — real archives are slightly imperfect

## Runtime Configuration

Environment variables consumed via `nuxt.config.ts` `runtimeConfig`:
- `NUXT_DB_URL` — SQLite database URL (default: `file:./data/campaign.db`)
- `NUXT_GM_TOKEN_SECRET` — fallback secret (default: `dev-secret-change-in-production`)

## Important File References

- `app/assets/css/main.css` — global styles, Tailwind layers, archive component classes
- `tailwind.config.ts` — `field-*` color palette and font families
- `db/schema.ts` — Drizzle ORM schema (source of truth for data model)
- `server/utils/db.ts` — database client singleton, room code generation, GM verification
- `shared/game-data.ts` — shared game rule constants
- `app/composables/usePlayerName.ts` — localStorage-backed player identity
- `app/composables/useLegionRoleData.ts` — static data for legion role UI
