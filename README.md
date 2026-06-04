# ChoicePilot — The Decision Atlas

Live URL: https://choice-pilot-5hyd.vercel.app/

ChoicePilot is an explainable engineering counselling planner for Madhya Pradesh students to explore college routes, evaluate rank/budget/branch fit, compare options and save preferred routes.

## Problem Statement

Engineering counselling decisions require students to balance rank eligibility, preferred branch, annual budget, location and placement expectations. ChoicePilot turns these factors into transparent route guidance instead of hidden scores or guaranteed predictions.

## Core Features

- College Explorer
- College Detail
- Explainable Predictor
- Route Comparison
- Authentication and Saved Routes
- Secured Admin Data Console
- Visible data-confidence policy

## Product Walkthrough

1. Start from the route-based landing page.
2. Explore colleges with search and filters.
3. Review college detail pages for programmes, fees and cutoff context.
4. Generate an explainable route in the predictor.
5. Compare two or three shortlisted routes side by side.
6. Sign up or log in to save preferred routes.
7. Admin users can access secured data management tools from the dashboard.

## Technology Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion
- Auth.js
- Prisma
- PostgreSQL/Neon
- Zod
- Vercel

## System Architecture

`Next.js UI → Route Handlers / Auth.js → Zod Validation + Recommendation Engine → Prisma ORM → Neon PostgreSQL`

## Recommendation Logic

ChoicePilot classifies route chance bands from historical closing-rank fit:

- Safe: rank comfortably within the historical closing-rank range.
- Target: rank close to the historical closing rank.
- Dream: rank slightly beyond the historical closing rank.

The match score combines cutoff fit, branch preference, budget fit, location fit, placement indicator, source trust and an optional priority bonus.

ChoicePilot uses deterministic explainable scoring, not AI-generated admission guarantees.

## Data Reliability Policy

Current deployed records are development/demo data for product evaluation. Demo-labelled records are visible in the interface, and students should verify official current-year counselling information before making final admission decisions. Production dataset expansion would use official counselling cutoff records, official college fee and programme information, and regulatory or official placement disclosures where available.

## Admin Console

Authorised admins can add/update colleges, programmes, cutoff records and source confidence labels through a secured Admin Data Console.

## Key Routes

- `/`
- `/colleges`
- `/predictor`
- `/compare`
- `/login`
- `/signup`
- `/dashboard`
- `/admin`
- `/about-data`

## Local Setup

```bash
git clone <repository-url>
cd ChoicePilot
npm install
```

Create a local environment file from `.env.example`, then set:

- `DATABASE_URL`
- `AUTH_SECRET`

Run the database setup and development server:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Deployment

The application is deployed on Vercel with PostgreSQL hosted on Neon. Prisma Client generation runs during installation through the configured `postinstall` script.

## Future Scope

- Official verified dataset expansion
- Saved comparisons
- Preference-list planner
- What-if simulations

## Author

Shaurya Agrawal
