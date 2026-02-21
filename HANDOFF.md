# Handoff Note (Stack Intelligence)

## Canonical Repo Paths

- Frontend (this repo): `/Users/isaacentebi/Desktop/stack-intelligence-portal`
- Backend: `/Users/isaacentebi/Desktop/stack-intelligence-engine`

## Important Clarification

- Nothing was auto-migrated from backend to frontend or vice versa.

## Naming Decisions

- Frontend name: `stack-intelligence-portal`
- Backend name: `stack-intelligence-engine`
- Frontend GitHub remote: `https://github.com/ientebib/stack-intelligence-portal.git`
- Backend GitHub remote: `https://github.com/ientebib/stack-intelligence-engine.git`

## Frontend Changes Already Applied

- Homepage nav now includes `Research Dashboard`.
- Canonical route is `/research-dashboard`.
- Branding updated in key UI/metadata to `Stack Intelligence Portal`.
- Package metadata updated to `stack-intelligence-portal`.

## Architecture Direction (Agreed)

- Keep repos separate for now.
- `stack-intelligence-portal` = frontend (presentation + investor/research portal UI)
- `stack-intelligence-engine` = backend/data/calculations/APIs (source of truth)
- Frontend should call backend via API, not read duplicated local datasets long-term.

## Immediate Next Technical Step

Build first backend API contract and wire frontend login/dashboard:

1. `POST /auth/login`
2. `GET /me`
3. `GET /dashboard/summary`

Then connect `/research-dashboard` to those endpoints.
