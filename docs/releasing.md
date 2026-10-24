# Releasing

How a template version reaches the apps. The working rules are in `AGENTS.md`.

Releases are automated — **do not `npm publish` by hand.** The flow is driven by git tags:

1. Bump `version` in `package.json` (the published version is read from here) and commit it.
2. Create and push a matching tag, e.g. `git tag v1.8.0 && git push origin v1.8.0`.
3. Publish a GitHub Release for that tag (e.g. `gh release create v1.8.0 --generate-notes`, or the Releases UI). Publishing the release is what fires the pipeline — a pushed tag on its own does not.

The `release: published` event triggers `.github/workflows/publish-gpr.yml`, which runs `npm ci` → `npm run build` → `npx tsc` → `npm publish` to GitHub Packages. Keep the tag name and `package.json` version in sync.

**Consumers are bumped by hand, deliberately.** The pipeline used to end by
dispatching a `template-published` event to `erp-crm`, `erp-hrm` and
`lms.springboard.vn`, where an `update-template.yml` opened a version-bump PR.
That step and all three receiving workflows were **deleted in 1.11.0**: the
dispatch had never worked in its life (`DISPATCH_TOKEN` was never set, so every
release since the chain was written failed on that step and left a red run on a
release that had in fact published cleanly), and we do not want a PR per
dependency bump anyway. In a consumer, take a new template with:

```bash
npm install @springboard-english/springboard-erp-template@latest
```

then commit `package.json` and `package-lock.json` with the change that needs it.
