## Dynamic UI Architecture

### Overview
The frontend consumes meta-driven application definitions from the backend to render pages without hardcoding layout or component wiring. Hydrated page data contains:

- `placements`: Ordered array describing where and what to render (component/asset references, parameters, span metadata).
- `assets`: Reusable parameter bundles (e.g., data configs, default props) keyed by id.
- `components`: Component definition records (future: server-stored variations/functions).

### Rendering Flow
1. `useHydratedPage(appId, slug)` fetches `/meta/apps/:appId/pages/:slug?hydrate=1&include=assets` using `apiRequest`.
2. Hook normalizes arrays into `assetsMap` and `componentsMap` and exposes `placements` + loading/error state.
3. `HydratedDashboard` delegates directly to `<PageRenderer>` passing maps, placements, and loading.
4. `PageRenderer` merges parameters in precedence order: componentDef.parameters -> asset.parameters -> placement.parameters -> runtime override (slotPath keyed).
5. Each placement resolves a `resolvedType` used by the component registry's lazy loader.
6. Suspense boundaries provide skeleton fallbacks while components load; page-level skeletons display when initial data is loading.

### Component Registry
`registry/components.js` exports `hasComponent` / `loadComponent` which return dynamic imports. This keeps initial bundle lean and enables future remote module strategies.

### Data & Transforms
Server is authoritative for complex transform pipelines. Client `useDataSource` performs only lightweight shaping (pick/map). Hashes (`planHash`, etc.) on server ensure transform caching consistency.

### Telemetry
`apiClient` emits structured timing events to registered sinks. `useApiTelemetryBuffer` batches events with configurable interval and optional POST to `/metrics`. `TelemetryConsole` renders a developer overlay for live inspection.

### Theming
`ThemeProvider` loads base tokens + user overrides (from `localStorage`) and sets CSS variables (`--app-*`). `ThemePanel` allows editing primary/surface/border/radius tokens with preview & reset.

### Error Boundaries
`AppErrorBoundary` wraps the root, capturing render/runtime errors and offering a retry reset that re-mounts subtree.

### Accessibility
Global `:focus-visible` outlines, ARIA roles on tabs/navigation, skip link in `index.html`, and semantic landmarks (`role="main"`). Further work queued: keyboard trap audits & aria-label coverage.

### Responsive Layout
Placement `span` supports numeric or object `{ base, md, lg }`. `PageRenderer` converts to responsive span utility classes. Default fallback: full width on mobile, 6 cols (md), 4 cols (lg).

### Future Extensions
- Transform builder & function editor will persist definitions back to meta APIs.
- Remote plugin/component loading via manifest feed.
- Real-time updates via WebSocket channel for placement changes.

### Directory Highlights
- `src/hooks/useHydratedPage.js`: Fetch & normalize meta page.
- `src/components/PageRenderer.jsx`: Resolve & render placements.
- `src/lib/apiClient.js`: Request wrapper with telemetry + retries.
- `src/hooks/useApiTelemetryBuffer.js`: Event batching.
- `src/contexts/ThemeProvider.js`: Token management.

---
This document will evolve as the builder tooling and live editing capabilities are implemented in subsequent sprints.