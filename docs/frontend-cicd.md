# Frontend CI/CD — what was built, and why

**Scope:** `lms.springboard.vn`, `erp-crm`, `erp-hrm` (and this template repo).
**Assessed:** 2026-08-03. **Implemented:** 2026-08-05 (Cloud Build, §2).
**Home for this doc:** the template repo, because it owns the only cross-repo
automation we have. The pipelines it describes live in each frontend repo.

> This started as a decision document recommending GitHub Actions. **We shipped
> Cloud Build instead** — §3 records why the recommendation flipped. The options
> analysis is kept because the reasoning still matters when this is revisited.

---

## 1. What is deployed now

Each frontend has a `cloudbuild.yaml` and a Cloud Build trigger on `^main$`:

| repo | trigger | bucket | served at |
| --- | --- | --- | --- |
| `erp-hrm` | `erp-hrm-main-deploy` | `gs://springboard_erp-hrm/hrm` | `erp.springboard.vn/hrm` |
| `erp-crm` | `erp-crm-main-deploy` | `gs://springboard_erp-crm/crm` | `erp.springboard.vn/crm` |
| `lms.springboard.vn` | `lms-springboard-vn-main-deploy` | `gs://lms.springboard.vn` | `lms.springboard.vn` |

All three run as `build-791@` — the same service account as the API triggers —
with `roles/storage.objectAdmin` scoped to their bucket and
`secretmanager.secretAccessor` on one secret. Push to `main` deploys. There is no
approval gate, on the reasoning that a bad frontend is one `rollback.sh` away
(§4); the API's gated `production` model was not copied.

**Serving is unchanged and stays cheap:** Cloudflare in front of raw GCS. No
load balancer, no Cloud CDN, no Cloud Run.

### The pipeline

`Install` → `Build` → `Publish assets` → `Release`.

Two things it asserts about the *artefact*, rather than trusting that setting an
input was enough. Both exist because of specific incidents:

- **The Google client ID is in the built bundle.** Vite inlines `VITE_*` at build
  time, so a missing variable does not fail the build — it compiles to
  `undefined` and ships a login button that cannot work. That took Google sign-in
  down across all three apps on 2026-08-04, because `.env.local` is untracked and
  lived only on the deploying laptop.
- **`index.html` references the base path it is about to be published under.** A
  bundle built for `/` and served at `/crm` uploads happily and then 404s every
  chunk. That happened on the CRM pipeline's first run (2026-08-05) and was
  rolled back within minutes.

The second one is worth internalising: **the three apps resolve their base path
three different ways**, which is exactly what makes copying one pipeline to
another unsafe.

| app | how the base is set |
| --- | --- |
| `erp-hrm` | hardcoded in `package.json`: `vite build --base=/hrm/` |
| `erp-crm` | `VITE_ROUTER_BASE_URL`, read by `vite.config.ts` via `loadEnv` |
| `lms` | root; neither is needed |

`_ASSET_BASE` states it once per app and the guard checks the emitted HTML.

### Credentials

Only **one real secret**: `github_packages_token`, in Secret Manager, which npm
needs because the template package is private to the org.

The Google client IDs are plain substitutions in `cloudbuild.yaml`. An OAuth
*client* ID is public by construction — it ships inside the bundle and is
readable in devtools — so putting it in Secret Manager implied a
confidentiality it never had while hiding the value most worth eyeballing in
review. The client *secret* is a different thing and this flow does not use it.

Note this also sidesteps §5's GitHub Packages problem entirely: the build authenticates
with a PAT rather than a repo's `secrets.GITHUB_TOKEN`, so the "cannot read a
package published by a different repository" restriction never applies.

## 2. Versioning and rollback

**Every asset vite emits is content-hashed** (`index-DwzC4uPz.js`); only
`index.html` and `favicon.ico` are not. So two builds collide on one file. Keep
the assets and every past `index.html` still resolves — which makes a release a
~1.3 KB pointer and a rollback a single copy:

```
<base>/index.html                 live pointer, no-store
<base>/assets/<name>-<hash>.js    immutable, never deleted
<base>/releases/<sha>/index.html  archived pointer, one per build
```

```bash
./scripts/rollback.sh              # list releases, ordered by upload time
./scripts/rollback.sh <commit-sha> # promote one
```

No rebuild. `index.html` is served `no-store`, so it is live on the next load.

**`--delete-unmatched-destination-objects` is gone**, from the pipeline *and*
from `npm run deploy`. §5 below praises that flag for "keeping the bucket clean";
that judgement was wrong. Deleting the previous build's chunks is precisely what
makes rollback impossible, and it would also have deleted the `releases/` archive
on the next deploy. Assets are now uploaded **first and additively** and
`index.html` promoted **last**, so no served `index.html` ever references a chunk
that is not there — in either direction.

Assets therefore accumulate in the prefix. That accumulation **is** the
versioning, and it is cheaper than it looks: content-hashed names dedupe across
builds, so a rebuild of unchanged code adds nothing and a typical change adds
only the chunks that changed. Buckets sit in the low megabytes; a few hundred
builds lands in the tens of MB. If it ever needs bounding, an age-based lifecycle
rule on `assets/` is the lever — and it sets the rollback horizon to that age.

Assets also moved to `max-age=31536000, immutable`, safe because the names are
content-addressed; they were previously re-fetched hourly for no reason.

## 3. Why Cloud Build, when §5 recommended Actions

The original recommendation (Option A, below) rested on "Actions is already
there and already trusted across repo boundaries". Two things changed that:

1. **The Actions cross-repo chain was verified broken** (§5) and needs two admin
   fixes to work. "Already there" was doing a lot of work in that argument.
2. **Cloud Build needed no new credential model.** WIF setup per repo was Option
   A's stated cost; Cloud Build reused the API's existing service account and
   GitHub App. The one-time cost turned out to be granting two IAM roles.

The Option B objection — "two CI systems either way" — is still true, and still
true under Actions, since template updates run there regardless.

**What this decision did not deliver:** Option A bundled the CI gate (`lint`,
`tsc`, `vitest`) into the same workflow. The Cloud Build pipeline **only builds
and publishes** — a compile error fails the build, but lint and test failures do
not. §5's Step 1 stands unimplemented, and is the largest remaining gap (§4).

## 4. Still open

- **No CI gate.** Nothing runs `eslint` or `vitest` before a deploy. `erp-hrm`
  has a `test` script CI never executes. This is worth doing on its own and
  carries no deployment risk — as a Cloud Build step, or in Actions on PRs where
  feedback is faster.
- **No staging.** `VITE_BASE_URL` is pinned to production in `_API_URL`, so a
  frontend cannot be previewed against the dev API even though the API has one.
- **No preview channels.** The one thing Firebase (Option C) still offers that
  this does not. Cheaper as a fourth pipeline step publishing to
  `<base>/previews/<pr>/` than as a replatform.
- **No gated production deploy.** Deliberate, given rollback. Revisit if a
  frontend change ever needs to ship in lockstep with a gated API release.

---

## 5. Original assessment (2026-08-03) — retained for context

> Everything below is the state *before* implementation. Where it conflicts with
> §1–§3, §1–§3 win. Two judgements in it are now known to be wrong and are
> flagged inline.

### The API is fully automated

Per `api.springboard.vn/CLAUDE.md`:

- **`main` → Cloud Build trigger → auto-deploy** to the dev/staging Cloud Run
  service. Merging to `main` is shipping.
- **`production` → Cloud Build trigger → gated on manual approval** → production
  Cloud Run service.
- `cloudbuild.integration.yaml` runs the integration suite in CI.

### The frontends were not automated at all

All three deployed by a developer running `npm run deploy` on their own machine,
with hashed assets cached for an hour and `index.html` served `no-store`.

> **Wrong judgement, corrected 2026-08-05.** The original text called the script
> "good" and credited `--delete-unmatched-destination-objects` with "keeping the
> bucket clean". Deleting old chunks is what made rollback impossible; see §2.
> The two-step split (assets, then `index.html`) *was* right and is kept.

### What that cost us

1. **No gate.** Nothing runs `tsc`, `eslint`, or `vitest` before a deploy.
   *(Still true — §4.)*
2. **Deploys from unknown source state** — the developer's working tree, with no
   link between a deployed bundle and a commit. *(Fixed: builds are triggered by
   commit, and the SHA is inlined into the bundle for `BuildTag`.)*
3. **Requires ambient `gcloud` credentials** with production bucket write access
   on individual laptops. *(Fixed for the automated path.)*
4. **No staging.** *(Still true — §4.)*
5. **Asymmetric with the API.** *(Fixed.)*

### What we had to build on

GitHub Actions is already in use across repo boundaries: `publish-gpr.yml`
publishes the template and dispatches to all three consumers, which run
`update-template.yml` to open a bump PR.

### …except that chain does not work (verified 2026-08-03)

Cutting the v1.8.2 release to exercise it end to end disproved both halves:

1. **The dispatch never fires.** `secrets.DISPATCH_TOKEN` is unset, so `gh api`
   exits immediately. The step was written as `gh api ... || echo "Warning: ..."`,
   so it swallowed the error and **reported success while notifying nobody** —
   which is why it went unnoticed for months. That `|| echo` has been replaced
   with an explicit failure.
2. **Even when dispatched, the consumer install fails** with
   `403 Permission installation not allowed to Read organization package`. A
   repo's own `secrets.GITHUB_TOKEN` cannot read a package published by a
   *different* repository — a GitHub Packages restriction, not a misconfiguration.

**Two fixes, both needing admin rights:**

- On the package page (Packages → springboard-erp-template → Package settings →
  Manage Actions access), add `erp-crm`, `erp-hrm` and `lms.springboard.vn` with
  **Read**.
- Add a `DISPATCH_TOKEN` repo secret: a PAT with `repo` scope.

Until then the template must be bumped in each consumer by hand. *(This was
listed as a prerequisite for deploy automation. It is not, as it turned out —
the Cloud Build pipeline authenticates to npm with a PAT from Secret Manager and
never hits this restriction. It remains a prerequisite for the **template bump
PRs** to work.)*

> **Resolved by deletion, 2026-08-11 (template 1.11.0).** Neither fix was ever
> applied, so the chain stayed broken for its entire life — and its one visible
> effect was that **every release run went red on a release that had published
> perfectly well**, which trains people to ignore the only signal that would
> tell them a publish had genuinely failed. Since we do not want a PR per
> dependency bump either, the `Notify consumer repos` step and all three
> `update-template.yml` workflows are gone rather than repaired. Consumers now
> take a template with `npm install …@latest`, committed alongside the change
> that needs it. Restoring the chain means re-adding both halves *and* doing the
> two admin fixes above — do not restore just the dispatch step.

One useful finding: `.npmrc` is gitignored and **has never been committed** in
any of the three frontends. The warning in `erp-hrm/AGENTS.md` that it is
"tracked in git [with] a live GitHub PAT" was stale and has been corrected.

### Options considered

**Option A — GitHub Actions + Workload Identity Federation → GCS.** Originally
recommended. Mirror `publish-gpr.yml`; authenticate with short-lived WIF
credentials, no service-account JSON in GitHub secrets. Pros: no new platform,
gate comes free, deploys traceable to a SHA. Cons: one-time WIF setup per repo.
**Not chosen — see §3.**

**Option B — Cloud Build triggers.** ✅ **Chosen.** Same mechanism as the API;
credentials never leave GCP; the API's manual approval gate would apply
identically if wanted. Cons: needs the Cloud Build GitHub App on three more
repos; still two CI systems, since Actions runs template updates either way.

**Option C — Firebase Hosting / Cloud Run static.** Replatform off raw GCS.
Offers atomic deploys, instant rollback, preview channels per PR, CDN, and SPA
rewrites.

> **Verdict revised 2026-08-05.** The original read "not now, but worth
> revisiting — the non-atomic-deploy problem is real and will eventually bite."
> **That problem is now fixed** (§2): assets go up first and additively, the
> pointer last, nothing is deleted. Of Firebase's five draws, atomic deploys and
> rollback are matched, CDN and SPA rewrites we already have (Cloudflare, and the
> bucket's `notFoundPage=index.html`). **Only preview channels remain**, and
> those are cheaper as a pipeline step than as a migration — which would mean new
> DNS, moving off Cloudflare, and reworking the `/crm` + `/hrm` prefix layout.
> **Recommendation is now: do not migrate.**

**Option D — Vercel / Netlify.** No. Splits the stack across another vendor and
adds a bill for what B does for free.
