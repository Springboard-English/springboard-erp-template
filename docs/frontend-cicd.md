# Frontend CI/CD — options and recommendation

**Scope:** `lms.springboard.vn`, `erp-crm`, `erp-hrm` (and this template repo).
**Assessed:** 2026-08-03, against `main` of each repo.
**Home for this doc:** the template repo, because it already owns the only
cross-repo automation we have (`publish-gpr.yml` dispatches to all three
frontends). The workflows it proposes land in each frontend repo.

---

## 1. Where we are

### The API is fully automated

Per `api.springboard.vn/CLAUDE.md`:

- **`main` → Cloud Build trigger → auto-deploy** to the dev/staging Cloud Run
  service. Merging to `main` is shipping.
- **`production` → Cloud Build trigger → gated on manual approval** → production
  Cloud Run service.
- `cloudbuild.integration.yaml` runs the integration suite in CI.

### The frontends are not automated at all

All three deploy by a developer running `npm run deploy` on their own machine:

```jsonc
// lms.springboard.vn
"deploy": "VITE_BASE_URL=https://api.springboard.vn npm run build
  && gcloud storage rsync ./dist gs://lms.springboard.vn --recursive --delete-unmatched-destination-objects
       --exclude=\".*index[.]html$\" --cache-control=\"public, max-age=3600\"
  && gcloud storage cp ./dist/index.html gs://lms.springboard.vn/index.html
       --cache-control=\"no-store, max-age=0\""
```

`erp-crm` and `erp-hrm` are the same shape, into `gs://springboard_erp-crm/crm`
and `gs://springboard_erp-hrm/hrm`, with `VITE_ROUTER_BASE_URL=/crm` and
`--base=/hrm/` respectively.

The script itself is **good** — the two-step split (hashed assets cached for an
hour, `index.html` with `no-store`) is exactly right for an SPA on a bucket, and
`--delete-unmatched-destination-objects` keeps the bucket clean. **The problem is
not the deploy command, it is that a human runs it.**

### What that costs us

1. **No gate.** Nothing runs `tsc`, `eslint`, or `vitest` before a deploy.
   `erp-hrm` has a `test` script (`vitest run`) that CI never executes.
2. **Deploys from unknown source state.** `npm run deploy` ships the developer's
   working tree — uncommitted changes, a stale branch, whatever `node_modules`
   resolved to. There is no link between a deployed bundle and a commit.
3. **Requires ambient `gcloud` credentials** with write access to production
   buckets, on individual laptops.
4. **No staging.** The `VITE_BASE_URL` is hardcoded to
   `https://api.springboard.vn` in the deploy script, so there is no way to
   preview a frontend against the dev API — even though the API *has* a dev
   environment.
5. **Asymmetric with the API.** An API change that needs a coordinated frontend
   change auto-deploys its half and waits on a human for the other.

### What we already have to build on

GitHub Actions is **already in use and already trusted across repo boundaries**:

- `springboard-erp-template/.github/workflows/publish-gpr.yml` — on release:
  `npm ci` → `npm run build` → `npx tsc` → `npm publish` to GitHub Packages →
  `repository_dispatch` to all three consumers.
- `{lms,erp-crm,erp-hrm}/.github/workflows/update-template.yml` — identical in
  all three; on `template-published`, installs the new template version and opens
  a PR via `peter-evans/create-pull-request`.

So Actions is enabled and the workflow files exist. **We are adding a workflow to
an existing setup, not introducing CI.**

### …except that chain does not currently work (verified 2026-08-03)

An earlier draft of this document claimed the org already had a working
`DISPATCH_TOKEN` and GitHub Packages auth in CI. Cutting the v1.8.2 release to
exercise the chain end to end disproved both halves:

1. **The dispatch never fires.** `secrets.DISPATCH_TOKEN` is unset, so `gh api`
   exits immediately with "set the GH_TOKEN environment variable". The step was
   written as `gh api ... || echo "Warning: ..."`, so it swallowed the error and
   **reported success while notifying nobody** — which is why this went unnoticed
   for months. That `|| echo` has since been replaced with an explicit failure.
2. **Even when dispatched, the consumer install fails.** Sending the dispatch by
   hand with a valid token produced a run that failed on `npm install
   @springboard-english/springboard-erp-template@latest`:

   ```
   npm error 403 Forbidden - GET https://npm.pkg.github.com/@springboard-english%2fspringboard-erp-template
   npm error 403 Permission installation not allowed to Read organization package
   ```

   A repo's own `secrets.GITHUB_TOKEN` cannot read a package published by a
   *different* repository. This is a GitHub Packages restriction, not a
   misconfiguration of the workflow.

**Two fixes, both requiring admin rights this document's author does not have:**

- *Preferred, no PAT needed* — on the package page (Packages →
  springboard-erp-template → Package settings → Manage Actions access), add
  `erp-crm`, `erp-hrm` and `lms.springboard.vn` with **Read**. This fixes (2)
  permanently and keeps `secrets.GITHUB_TOKEN` as the only credential.
- *For (1)* — add a `DISPATCH_TOKEN` repo secret on this repository: a PAT with
  `repo` scope, which is what `repository_dispatch` to another repo requires.

Until both are done, the template must be bumped in each consumer by hand
(`npm install @springboard-english/springboard-erp-template@latest`). **This is a
prerequisite for the deploy automation proposed below** — an auto-deploy that
builds against a template the runner cannot install would fail on every run.

One useful finding while checking this: `.npmrc` is gitignored and **has never
been committed** in any of the three frontends (`git log --all -- .npmrc` is
empty everywhere). The warning in `erp-hrm/AGENTS.md` that it is "tracked in git
[with] a live GitHub PAT" is **stale and should be corrected**.

## 2. Options

### Option A — GitHub Actions + Workload Identity Federation → GCS ✅ recommended

Mirror the existing `publish-gpr.yml` shape. On push to `main`: install, lint,
typecheck, test, build, then run the same two `gcloud storage` commands.

Authenticate with `google-github-actions/auth` using **Workload Identity
Federation** — no service-account JSON key in GitHub secrets. GitHub's OIDC token
is exchanged for short-lived GCP credentials, scoped to one bucket, and the pool
can be restricted to a specific repo and branch.

- **Pros:** no new platform; matches the existing workflows; keeps the proven
  deploy script verbatim; no long-lived credentials; the gate (`tsc` + `eslint` +
  `vitest`) comes free; deploys become traceable to a commit SHA.
- **Cons:** one-time WIF setup per repo (pool, provider, service account,
  bindings) — perhaps an hour for the first, minutes for the rest.
- **Cost:** zero. Well inside the Actions free tier for private repos at this
  volume.

### Option B — Cloud Build triggers on the frontend repos

Use the same mechanism as the API: a Cloud Build trigger per repo on push to
`main`, with a `cloudbuild.yaml` that builds and rsyncs.

- **Pros:** one CI system for the whole org; credentials never leave GCP; the
  `production`-branch **manual approval gate** already used by the API applies
  identically, which is the cleanest path to a gated frontend production deploy.
- **Cons:** needs the Cloud Build ↔ GitHub app installed on three more repos;
  Actions would still be running for template updates, so it is *two* CI systems
  either way; slower feedback for a pure-frontend PR; per-build cost, small but
  nonzero.
- **Verdict:** a genuinely reasonable alternative, and the better answer *if*
  gated production frontend deploys are a hard requirement. Otherwise Option A
  wins on the fact that Actions is already there.

### Option C — Firebase Hosting / Cloud Run static

Replatform off raw GCS buckets.

- **Pros:** Firebase Hosting gives atomic deploys, instant rollback, preview
  channels per PR, CDN, and correct SPA rewrites for free — a real upgrade over
  rsync-into-a-bucket, which is *non-atomic* (a user can load a new `index.html`
  and a deleted chunk mid-rsync).
- **Cons:** a migration. New DNS, new hosting config, and the `/crm` and `/hrm`
  path-prefix layouts need reworking. Out of proportion to "add auto deploy".
- **Verdict:** **not now, but worth revisiting.** The non-atomic-deploy problem
  is real and will eventually bite. Note it and move on.

### Option D — Vercel / Netlify

- **Verdict:** **no.** It would split the stack across another vendor, move the
  frontends off GCP where everything else lives, and add a bill for something
  Options A and B do for free.

## 3. Recommendation

**Option A**, rolled out in three steps.

### Step 1 — CI gate first, deploy second (do this immediately)

Before automating any deploy, add a `ci.yml` to each frontend that runs on PRs
and pushes to `main`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://npm.pkg.github.com
          scope: "@Springboard-English"
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test --if-present    # erp-hrm has vitest; the others no-op
      - run: npm run build
```

**This is valuable on its own and carries no deployment risk.** It also
immediately improves the `update-template.yml` bot PRs, which currently open
with nothing verifying that the new template version compiles against the app.

### Step 2 — Deploy on push to `main`, per repo

Add the `deploy` job gated behind `check`, with WIF auth, running the existing
`gcloud storage` commands. Set up one repo first — **`erp-crm` or `erp-hrm`, not
`lms`** — and let it run for a week before rolling to the rest.

Two changes to make while wiring it:

- **Move `VITE_BASE_URL` out of the `deploy` script** into a workflow env var, so
  a staging workflow can point at the dev API. The hardcoded production URL in
  `package.json` is the single thing blocking a preview environment.
- **Deploy `index.html` last** — the existing script already does this, and it
  matters more under automation. Keep the order.

### Step 3 — Match the API's promotion model

Once step 2 is stable, add a `production` branch to each frontend mirroring the
API's, with the deploy job keyed on branch: `main` → a staging bucket, `production`
→ the live bucket. This gives coordinated API+frontend releases, which is the
thing the current asymmetry (§1.5) makes hardest.

If a **manual approval gate** on production frontend deploys is required, this is
the point to reconsider Option B for the production job specifically — Cloud
Build's approval gate is already configured and understood for the API, whereas
in Actions this needs a GitHub Environment with required reviewers. Either works;
Cloud Build is less new machinery.

## 4. Summary

| | Now | After |
| --- | --- | --- |
| Trigger | `npm run deploy` on a laptop | push to `main` |
| Gate | none | lint + `tsc` + tests + build |
| Source | developer working tree | commit SHA |
| Credentials | ambient `gcloud` on laptops | short-lived WIF, per-repo scoped |
| Staging | none | `main` → staging, `production` → live |
| API parity | API auto, frontends manual | both automated |

**Sequencing:** step 1 is a pure win with no deployment risk and should go in
regardless of what is decided about steps 2 and 3. Do not let the larger question
block the CI gate.

**Known limitation, accepted for now:** rsync-to-bucket deploys are not atomic.
Option C fixes this properly; until then, the `no-store` on `index.html` plus
`max-age=3600` on hashed assets keeps the exposure to a few seconds per deploy.
