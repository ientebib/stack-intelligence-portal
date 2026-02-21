# Stack Intelligence Engine Integration Plan

This repo should be your **presentation + portal frontend**.
Your separate backend repo should remain the **source of truth for data, calculations, and live API jobs**.

## Recommended Setup

Use a 3-service architecture:

1. `stack-intelligence-portal` (this repo, Next.js)
2. `stack-intelligence-engine` (your backend repo: calculations, orchestration, DB access)
3. `data-pipeline` (optional separate worker repo if heavy ingestion/cron jobs need isolation)

## Why This Split

- Frontend deploys fast and can iterate UI without touching pipelines.
- Backend can be locked down, versioned, and scaled independently.
- Data jobs can fail/retry without impacting user-facing pages.

## How They Connect

1. Frontend calls backend over HTTPS using a single base URL (for example `https://api.yourdomain.com`).
2. Backend validates auth and returns only filtered/permissioned data.
3. Frontend never queries raw databases directly.

## Minimal Contract To Start

Implement these backend endpoints first:

1. `POST /auth/login` for session/token exchange
2. `GET /me` for current user and roles
3. `GET /dashboard/summary` for homepage data cards
4. `GET /thesis/updates` for investment thesis updates
5. `GET /proprietary/overview` for internal/proprietary data view

## Auth and Permissions

Use role-based access control:

1. `public` -> thesis pages only
2. `investor` -> investor portal + approved docs
3. `research_internal` -> proprietary data portal
4. `admin` -> operational tooling

Recommended flow:

1. Login on frontend
2. Backend issues secure HTTP-only session cookie (or short-lived JWT + refresh)
3. Frontend requests `/me` on app load
4. Route guards in frontend hide pages user is not allowed to access

## Deployment Pattern

1. Deploy frontend on Vercel.
2. Deploy backend on a private compute service (Railway, Fly.io, ECS, Render, etc.).
3. Place backend behind `api.yourdomain.com`.
4. Add CORS allow-list only for your frontend domains.
5. Use separate env files per environment (`dev`, `staging`, `prod`).

## Local Development Pattern

1. Run backend locally (for example on `http://127.0.0.1:8000`).
2. Run this frontend repo (default Next.js dev server).
3. Set frontend env var `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`.
4. Confirm login and one dashboard endpoint before building additional UI.

## Migration Plan (Practical)

1. Keep repos separate initially.
2. Integrate auth and one shared dashboard endpoint first.
3. Move only stable UI components/pages from Stack Intelligence Engine into this repo.
4. Add monitoring/logging once first API path is live.
5. After stability, decide whether to keep multi-repo or move to monorepo.

## When To Use Monorepo

Move to monorepo only if:

1. Frontend/backend changes are tightly coupled every week.
2. You want shared TypeScript types/contracts in one workspace.
3. One CI pipeline is easier for your team than multiple.

If those are not true yet, keep multi-repo and add strict API contracts.
