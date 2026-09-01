# Debbie O'Brien

This is my website which I built in Nuxt 3. I use it as my playground for trying out new stuff and having fun. Feel free to have a look around and copy whatever you like as the code is open source so if it helps you then great. All content is written in markdown using Nuxt Content v2 and makes it very easy to add new posts, videos etc. Site is a static site meaning it can be hosted for free on any hosting service such as Netlify.

After cloning it make sure you run yarn or npm install to install everything and then start the dev servers.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://127.0.0.1:8000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Agent review loop (pstack)

Install [pstack](https://cursor.com/marketplace/cursor/pstack) in Cursor before asking an agent to babysit or merge Wave A PRs:

1. In Cursor chat, run `/add-plugin pstack`
2. Run `/setup-pstack` and pick models
3. On a Wave A PR: `/poteto-mode babysit this PR, then ship it if CI is green`

Wave A PRs are agent-mergeable. Wave B PRs are human-merge only.

