# Endform POC

Running the Playwright suite on [Endform](https://endform.dev) — a managed,
distributed Playwright runner that fans every test out to its own isolated
cloud VM — so we can compare wall-clock time and flaky-test analytics against
the existing GitHub Actions sharded run.

Endform uses the **existing `playwright.config.ts` unchanged**. The only
product code change is a conditional `webServer` (skipped when a base URL is
provided or when running on Endform), so tests hit a deployed site instead of a
local dev server.

## One-time setup (interactive — done by Debbie)

1. **Create an Endform account / log in locally**

   ```bash
   npx endform@latest login
   ```

2. **Install the Endform GitHub App and connect this repo** (enables OIDC auth
   in CI — no secret token needed). Do this from the Endform dashboard →
   "Connect GitHub". See
   <https://endform.dev/docs/guides/getting-started/github-actions/existing/remote>.

   The CI job already requests the required `id-token: write` permission.

## Run it locally against a deployed URL

Point at any deployed site (production, or a specific Netlify preview) and run:

```bash
# production
BASE_URL=https://debbie.codes npx endform@latest test

# a specific PR preview
BASE_URL=https://deploy-preview-570--debbiecodes.netlify.app npx endform@latest test
```

`endform test` accepts the same flags as `playwright test`.

## Run it in CI

`.github/workflows/endform-tests.yml` runs on every PR. It:

1. Resolves the Netlify deploy-preview URL (polls the Netlify commit status —
   same mechanism as `preview-tests.yml`).
2. Runs `npx endform test` against that preview on Endform's cloud runners.

Results appear in the [Endform dashboard](https://endform.dev/app).

> The Endform CI job will fail until the GitHub App is installed + repo
> connected (step 2 above). That's expected — the workflow is committed and
> ready; it goes green once auth is wired.

## The comparison

| Runner | Where | Parallelism | Wall-clock (baseline) |
| --- | --- | --- | --- |
| GitHub Actions (`preview-tests.yml`) | GH-hosted | 4 shards | ~3m35s total (resolve ~1m18s + shards ~1m20–1m46s + merge ~26s) |
| Endform (`endform-tests.yml`) | Endform cloud | 1 test / VM | _to be recorded_ |

Both target the **same Netlify preview URL**, so it's an apples-to-apples
comparison of the runner, not the app.
