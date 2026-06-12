# Design Spec: Mini CRM UI/UX Redesign

## Goal
Redesign the entire application UI and UX (both Landing Page and Internal Console Workspace) to follow a simple, elegant, premium, and catchy "Minimalist Tech" aesthetic.

## Scope
1. **Visual Style**: Minimalist Obsidian / Dark Mode.
   - Backgrounds: Solid `#09090b` (zinc-950) and `#18181b` (zinc-900).
   - Borders: Thin `#27272a` (zinc-800) solid strokes (replacing neon glows and heavy blurs).
   - Primary Accent: Indigo (`#6366f1` / `#818cf8`) for hovers, selected buttons, active tab indicators.
   - Status Badges: Small, flat, border-aligned indicators.
2. **Layout**: Grouped sidebar navigation:
   - **Explore**: Telemetry Dashboard, Shopper Database
   - **Orchestrate**: Campaign Composer, Cohort Segmenter
   - **Manage**: Data Ingest & Seed, AI Agent Copilot
3. **Core Elements**:
   - Refactor landing page to be a premium, developer-focused portal.
   - High-fidelity SVG chart designs matching the dark monochrome style.
   - Redesigned WhatsApp/SMS/Email simulator preview.

## Architecture & Data Flow
No changes to database schema or backend routes.
- Frontend: Next.js 16 Client Component in `src/app/page.tsx`.
- Styling: `src/app/globals.css` and `src/app/page.module.css`.
- Assets: SVG vectors drawn inline inside React.
