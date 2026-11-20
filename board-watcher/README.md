# debbie.codes Board watcher

A tiny Vercel project that watches the Vercel Board channel `debbie-codes` for **new tasks in state ready**, then notifies a downstream webhook once per new task. It does not claim, reply, or route on the Board itself. Another bot does that after it receives the webhook.

This folder is self-contained. Deploy it as its own Vercel project with **Root Directory** set to `board-watcher`. It does not change the Nuxt site or Netlify config.

## Plain words

**Board** is Vercel's team message board for people and agents. Threads live in channels. A **task** is a thread the board tracks with a state label (`board.task=ready`, `claimed`, and so on).

A **watcher** is a durable `vb tail` that Vercel runs for you. You declare a `tail` filter and a `run` function in code. On deploy, Vercel's Board service matches events against that filter and wakes this project's `/api/board` route only when something matches. You do not poll.

A **webhook** here is a normal HTTPS POST to a URL you control. When a new ready task appears, this project sends JSON about that task to `BOARD_WATCHER_WEBHOOK_URL` so a bot elsewhere can pick it up.

## Why

Agents and people post work into Board channel `debbie-codes`. This watcher only cares when a **new** ready task root lands. Replies, label edits, claims, and completions must not wake the downstream bot.

## What the docs said vs what this builds

From `@vercel/board` (`docs/01-board/06-watchers.md`, `11-tasks.md`, `01-mounting.md`, `10-local.md`):

| Docs | This project |
| --- | --- |
| `board({ watch: { <id>: { tail, run } } })` and export `GET`/`POST` as `team.fetch` | `app/api/board/[[...path]]/route.ts` |
| Tail filters: channel + `--label board.task=ready` | `tail: 'debbie-codes --label board.task=ready'` |
| Act once inside `run` after the tail matches | `isNewReadyTask()` accepts only `task.created` on a ready root |
| `team` option for another team's board | `team: 'dobriendev-3232s-projects'` |
| `local({ memory: true })` for tests | `tests/watcher-local.test.ts` |

Filtering is two layers, as the docs require:

1. **Board service filter** (`tail`): only wake this deployment for channel `debbie-codes` with `board.task=ready`.
2. **`run` check**: only POST the webhook for `task.created` on a ready root. Replies, `labels.changed`, claims, and other task events return early.

Why `task.created` instead of the docs' `message.posted` example: that example is for a channel-only tail. With `--label board.task=ready`, create emits `message.posted` before the ready label exists, so the Board-side filter does not deliver that post. The event that enters the ready view is `task.created`. Confirmed with `local({ memory: true })`.

## Setup

1. Create a Vercel project for this folder only (Root Directory: `board-watcher`).
2. Link it to the team/scope that owns Board `dobriendev-3232s-projects` so the deployment's OIDC token can register watchers.
3. Grant the project access to the team's Board (first use fails with `no_board` until someone on the team grants it).
4. Set the two env vars below in the Vercel project.
5. Deploy. On first use / wake, the package registers the watcher with Vercel's API.

Local install and tests:

```bash
cd board-watcher
npm install
npm test
```

Optional local Next.js process (watchers on Vercel's board run as in-process tails off Vercel; see the watchers doc):

```bash
npm run dev
```

Try the same filter in a terminal first (docs recommendation):

```bash
npx vb tail debbie-codes --label board.task=ready --json --scope dobriendev-3232s-projects
```

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `BOARD_WATCHER_WEBHOOK_URL` | yes | Absolute HTTPS URL that receives the POST |
| `BOARD_WATCHER_WEBHOOK_KEY` | yes | Shared secret sent to the webhook |

### Auth header (exact)

```http
Authorization: Bearer <BOARD_WATCHER_WEBHOOK_KEY>
```

Header name: `Authorization`  
Scheme: `Bearer`  
Value: the raw key from `BOARD_WATCHER_WEBHOOK_KEY` (no extra prefix beyond `Bearer `)

Neither value is hardcoded or logged.

### POST body

```json
{
  "taskId": "812",
  "channel": "debbie-codes",
  "text": "fix the footer on mobile",
  "labels": {
    "board.task": "ready",
    "topic": "site"
  }
}
```

## How to verify (end-to-end manual check)

1. Deploy this project to Vercel with Root Directory `board-watcher`.
2. Set `BOARD_WATCHER_WEBHOOK_URL` and `BOARD_WATCHER_WEBHOOK_KEY` on that project. Point the URL at something you can observe (for example a requestbin, or your bot's ingest route that logs receipt without printing the key).
3. Redeploy or hit the board route once so watchers register.
4. Create a **new ready task** (one wake expected):

   ```bash
   npx vb tasks create debbie-codes "manual check: board watcher" --label topic=manual --scope dobriendev-3232s-projects
   ```

   Expect exactly one webhook POST with that task's id, channel, text, and labels. The `Authorization` header must be `Bearer` plus your key.

5. **Reply** in that thread (no wake expected):

   ```bash
   npx vb reply <taskId> "just a reply" --scope dobriendev-3232s-projects
   ```

6. **Change a label** (no wake expected):

   ```bash
   npx vb label <taskId> topic=manual-2 --scope dobriendev-3232s-projects
   ```

7. Optional: claim the task (`npx vb tasks claim <taskId> …`). Still no webhook.

Automated proof of the same filter lives in `npm test` (unit tests plus a `local({ memory: true })` harness).

## Project layout

```text
board-watcher/
  app/api/board/[[...path]]/route.ts   # exports GET/POST = team.fetch
  lib/board.ts                         # board() + watcher config
  lib/constants.ts                     # team, channel, tail
  lib/is-new-ready-task.ts             # event filter for one wake
  lib/notify-webhook.ts                # POST + Authorization header
  tests/                               # unit + local harness
  README.md
```

## Docs left unclear

- The watchers doc's "new thread" example (`message.posted` + `re === null`) does not apply as-is when the tail includes `--label board.task=ready`, because create sets that label after the post. The matching enter-view event is `task.created` (proven on `local()`).
- Whether a later `task.ready` (a waiting task becoming ready after a dependency completes) should also wake the bot. This project only wakes on `task.created` for a ready root, which matches "new tasks" and the manual create check.
- Exact grant / project linking UI steps to allow a deployment to register watchers on another team's Board (`dobriendev-3232s-projects`) when the Vercel project lives elsewhere. The package says the deployment's OIDC token registers watchers; someone on the team must grant the project the board.
- Watcher id character rules differ slightly between sections (`_` allowed in one place; profile-style ids elsewhere). This project uses `ready-tasks`.
