# ChoicePilot

The ChoicePilot MVP is deployed and all major live flows have been manually verified.

Live URL:
`https://choice-pilot-5hyd.vercel.app/`

Do only this task: replace/update `README.md` into a concise professional recruiter-facing README.

Do not modify application code, UI, APIs, database schema, dependencies, env files, docs, or deployment configuration.

README must include these sections:

# ChoicePilot — The Decision Atlas

One-line description:
An explainable engineering counselling planner that helps Madhya Pradesh students explore college routes, evaluate rank/budget/branch fit, compare options and save preferred routes.

## Live Demo

* Live Application: `https://choice-pilot-5hyd.vercel.app/`
* Note that users can sign up to test saved routes.

## Problem Statement

Briefly explain:
Students during engineering counselling must balance rank eligibility, preferred branch, annual budget, location and placement expectations. ChoicePilot converts these factors into transparent route recommendations rather than hidden or guaranteed predictions.

## Core Features

Keep concise bullets:

* Premium route-based landing experience
* Database-backed college explorer with search and filters
* College detail pages with programme/cutoff information
* Explainable Smart Match Predictor with Dream / Target / Safe classifications
* Score breakdown across cutoff, branch, budget, location, placement and source trust
* Side-by-side route comparison with fee and placement trade-offs
* Credentials authentication and saved-routes dashboard
* Visible demo-data and verification disclaimers

## Product Walkthrough

Brief numbered journey:

1. Explore colleges
2. Open programme details
3. Generate a personalised route
4. Compare 2–3 options
5. Create an account and save shortlisted routes

## Technology Stack

Include:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Motion
* Auth.js / NextAuth Credentials
* PostgreSQL via Neon
* Prisma ORM
* Zod
* Vercel

## System Architecture

Add a small text diagram:

`Next.js UI → Route Handlers / Auth.js → Zod Validation + Recommendation Engine → Prisma ORM → Neon PostgreSQL`

## Recommendation Logic

Explain concisely:

* Chance band is based on historical closing-rank fit:

  * Safe: rank comfortably within closing-rank range
  * Target: rank close to historical closing rank
  * Dream: rank slightly beyond historical closing rank
* Match Score combines:

  * Cutoff Fit
  * Branch Preference
  * Budget Fit
  * Location Fit
  * Placement Indicator
  * Source Trust
  * optional priority bonus

Clearly state:
`ChoicePilot uses deterministic explainable scoring, not AI-generated admission guarantees.`

## Data Reliability Policy

State clearly:

* Current deployed dataset is development/demo data for product evaluation.
* The UI labels demo/historical values and advises users to verify official current-year counselling data.
* Production expansion would use official counselling, college and regulatory sources.

## Key Routes

List:

* `/`
* `/colleges`
* `/predictor`
* `/compare`
* `/signup`
* `/login`
* `/dashboard`

## Local Setup

Include short commands:

* clone repository
* `npm install`
* create `.env` from `.env.example`
* set `DATABASE_URL` and `AUTH_SECRET`
* `npx prisma migrate dev`
* `npx prisma db seed`
* `npm run dev`

Do not expose real secret values.

## Deployment

Mention:

* Frontend/backend deployed on Vercel
* PostgreSQL hosted on Neon
* Prisma Client generated during deployment through the configured postinstall script

## Trade-offs and Future Scope

Mention:

* MVP uses a focused MP engineering dataset rather than unreliable all-India breadth.
* Future scope: official verified data expansion, saved comparisons, preference-list planner and what-if simulations.

## Author

* Shaurya Agrawal

Formatting requirements:

* Clean markdown only.
* No emojis.
* No fake metrics.
* No screenshots section yet.
* No long marketing language.
* Keep README readable and concise.

After editing:

1. Run `git diff -- README.md` only to verify.
2. Commit only `README.md` with:
   `docs: add submission-ready project README`
3. Push to `origin/main`.

Return only:

* file modified
* README sections added
* commit hash
* push result
* any issue

