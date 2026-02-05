# ClawPilot Landing + Cockpit UI

Premium, arcade‑industrial UI for ClawPilot — a one‑click hosting layer for OpenClaw. This repo includes the full flow: Hangar (landing/config), Terminal Boot Sequence, and Cockpit dashboard.

## Features
- Gamified landing + loadout selection
- Terminal boot sequence (no spinners)
- HUD‑style cockpit dashboard
- Sanitized logs with God Mode toggle
- Skill marketplace modal

## Tech Stack
- Next.js (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (or the port shown in the terminal).

## Scripts
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — run production server

## Notes
This UI uses mocked data and timed effects to simulate boot logs and live telemetry until a backend is connected.

---
Built for the ClawPilot “Agent Cockpit” experience.
