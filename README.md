# Dynamic Dashboard

## Meta Architecture Overview

The dashboard runtime is driven by metadata stored in MongoDB. Core collections:

- Application: Logical app container.
- Page: Holds legacy `components[]` and new `placements[]` (asset references).
- ComponentDef: Concrete render unit (table/chart/etc.) wired to a DataSource + TransformPipeline.
- DataSource: Inline or remote data plus optional `sampleData` for server transforms.
- TransformPipeline: Ordered transform `steps` with a computed `planHash` (stable SHA256 of canonical steps) for caching/diffing.
- Asset: Versioned abstraction wrapping one (future: multiple) components with parameters + visualization spec.
- FunctionDef: User-defined server function (currently JS) referenced by transform steps (`map` with `fnRef`).
- ConfigItem: Theme colors, axis configs, form definitions, etc.

## Transform Pipelines

Pipelines contain a `steps` array. Supported typed ops: `filter`, `map`, `limit`, `join`, `aggregate` plus legacy passthrough (e.g. `pickFields`).

Validation runs on save:
- Invalid steps block persistence.
- Legacy (unknown) ops are kept but recorded in `warnings` (format: `legacySteps:N`).
- `planHash` recomputed whenever steps change.

## Function Execution

- Each `FunctionDef` stores `code` (CommonJS export) and `codeHash` (SHA256) for integrity.
- A secure-ish sandbox (`vm`) executes code with a short timeout.
- Transform `map` step can specify either `expr` (inline JS expression using `r`) or `fnRef` referencing a FunctionDef name.

Example map step using fnRef:
```json
{ "op": "map", "fnRef": "formatCurrency" }
```

## Assets & Placements

- Migration script (`migrate-page-placements.ts`) creates an `Asset` per legacy component and mirrors `components[]` into `placements[]`.
- Hydration endpoint supports `?hydrate=1&include=assets` to return resolved assets alongside component hydration.

## Builder Bootstrap Endpoint

`GET /meta/builder/bootstrap/:appId/:slug` returns:
```json
{
	"page": { "_id": "...", "slug": "management-dashboard", "placements": [...] },
	"assets": [ { "_id": "...", "name": "Sample Asset", "type": "chart", "parameters": [] } ],
	"functions": [ { "name": "formatCurrency", "codeHash": "..." } ],
	"config": { "themeColors": [...], "axisConfig": [...] }
}
```

## Scripts

- `seed-meta-samples.ts` seeds sample data sources, pipelines, components, functions, assets, and config items.
- `migrate-page-placements.ts` backfills assets + placements (idempotent) with a summary report.
- `backfill-plan-hash.ts` computes missing `planHash` values.

## Next Steps (Planned)

- Enhanced sandbox resource limits & logging.
- Pipeline caching keyed by `planHash`.
- Multi-component Assets with composite output specs.
- UI builder leveraging bootstrap payload.

## CI & Build Pipeline

Recommended baseline commands (CI environment):

```bash
npm install --prefix server
npm run build:ci --prefix server
docker compose build server
docker compose up -d mongo server
docker compose exec server node dist/scripts/seed-meta-samples.js # optional smoke seed
```

`build:ci` ensures `dist/` is produced in the build stage; the runtime container excludes dev dependencies. A safety no-op `build` script in production avoids failures if invoked post-build.

## Docker Health Check

Container includes a `HEALTHCHECK` hitting `/health` every 30s (5s timeout, 10s start period, 3 retries). Inspect status:

```bash
docker inspect --format='{{.State.Health.Status}}' dynamic_mangement_dashboard-server-1
```

Typical states: `starting`, `healthy`, or `unhealthy` after consecutive failures.

## Branch & PR Guidelines

Use feature branches (e.g. `chore/healthcheck-docs`). Follow conventional commits:

Examples:
- `chore(server): add docker healthcheck`
- `feat(pipeline): cache transforms by planHash`
- `fix(asset): handle null parameters array`

PR template outline:
- Motivation / context
- Changes summary (bulleted)
- Testing steps (commands & endpoints)
- Rollback plan
- Follow-up tasks (if deferred)


