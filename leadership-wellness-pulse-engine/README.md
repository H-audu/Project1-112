# Leadership & Wellness Pulse Engine

A full-stack MVP for short-cycle assessment of leadership stress, workload, recovery, and organizational support. It provides a weekly survey, automatic 0–100 scoring, burnout-risk thresholds, trend charts, alerts, and an executive-summary PDF.

## Stack
- Next.js + React + TypeScript
- Node.js + Express
- PostgreSQL
- JWT authentication with bcrypt password hashing
- Recharts and PDFKit
- Docker Compose, Vercel, Render, and GitHub Actions

## Run with Docker
1. Copy `.env.example` to `.env` and replace `JWT_SECRET`.
2. Run `docker compose up --build`.
3. Open `http://localhost:3000`.
4. Register a user, complete the pulse survey, and open the dashboard.

The API health check is at `http://localhost:4000/health`.

## Run without Docker
Create a PostgreSQL database, run `database/schema.sql` and `database/seed.sql`, then:

```bash
cd server
npm install
DATABASE_URL=postgresql://... JWT_SECRET=... CLIENT_ORIGIN=http://localhost:3000 npm run dev
```

In another terminal:

```bash
cd client
npm install
NEXT_PUBLIC_API_URL=http://localhost:4000/api npm run dev
```

## Scoring
Responses use a 1–5 Likert scale. Negative stress items are reversed to a positive-wellbeing orientation, normalized to 0–100, then inverted to produce the stress score. Workload is similarly expressed as burden, while recovery and support remain positive scores.

Risk thresholds:
- Severe: stress ≥ 80 and recovery < 40
- High: stress ≥ 60 and recovery < 60
- Moderate: stress ≥ 40 or workload ≥ 70
- Low: all other cases

These thresholds are screening rules for organizational wellness monitoring and are not medical diagnoses.

## Deployment
- **Frontend:** Import the repository in Vercel, use `client` as the root directory, and set `NEXT_PUBLIC_API_URL` to the deployed API URL plus `/api`.
- **Backend/database:** Use `render.yaml` as a starting Blueprint. After PostgreSQL is created, run `database/schema.sql` and `database/seed.sql` once against it.
- Update `CLIENT_ORIGIN` to the deployed Vercel domain.

## Production hardening
Before handling real employee health or wellness information, add privacy review, consent language, data-retention rules, audit logging, encryption/key management, rate limiting, account recovery, organization-level tenancy, minimum-group-size suppression, and legal/security review appropriate to the deployment jurisdiction.
