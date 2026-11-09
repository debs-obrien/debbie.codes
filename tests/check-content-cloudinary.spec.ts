import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from './fixtures';

const SCRIPT = join(process.cwd(), 'scripts/check-content.mjs');

test.describe('check-content Cloudinary guard', () => {
  test('rejects body Cloudinary links and allows fence literals', () => {
    test.skip(!existsSync(SCRIPT), 'scripts/check-content.mjs not staged on this runner');

    const dir = mkdtempSync(join(tmpdir(), 'check-content-'));
    try {
      mkdirSync(join(dir, 'content/blog'), { recursive: true });
      mkdirSync(join(dir, 'content/videos'), { recursive: true });
      mkdirSync(join(dir, 'utils'), { recursive: true });
      writeFileSync(join(dir, 'utils/videos.ts'), 'export const HIDDEN_YOUTUBE_VIDEO_IDS = []\n');

      writeFileSync(join(dir, 'content/blog/ok.md'), `---
title: ok
date: 2024-01-01
description: d
tags: [a]
published: true
---

\`\`\`js
baseURL: 'https://res.cloudinary.com/your-account-name/image/upload/'
\`\`\`

Hello.
`);

      // Fence-only must pass
      execFileSync(process.execPath, [SCRIPT, dir], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      writeFileSync(join(dir, 'content/blog/bad.md'), `---
title: bad
date: 2024-01-01
description: d
tags: [a]
published: true
provider: cloudinary
---

![x](https://res.cloudinary.com/debsobrien/image/upload/v1/debbie.codes/x)
`);

      let failed = false;
      try {
        execFileSync(process.execPath, [SCRIPT, dir], {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }
      catch (err: any) {
        failed = true;
        const out = `${err.stdout || ''}${err.stderr || ''}`;
        expect(out).toMatch(/res\.cloudinary\.com|provider: cloudinary/);
      }
      expect(failed).toBe(true);
    }
    finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
