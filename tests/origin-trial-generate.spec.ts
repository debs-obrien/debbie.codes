import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { expect, test } from '@playwright/test';
import { DEFAULT_WEBMCP_OT_CHROME, DEFAULT_WEBMCP_OT_EDGE } from '../utils/origin-trial';

test('generated production home HTML includes both origin-trial meta tags', () => {
  test.setTimeout(600_000);
  // Endform runners already publish a preview; skip the local generate there.
  test.skip(process.env.ENDFORM === 'true', 'Endform does not run a local nuxt generate');

  const root = join(__dirname, '..');
  execFileSync('npm', ['run', 'generate'], {
    cwd: root,
    env: { ...process.env, CONTEXT: 'production' },
    stdio: 'pipe'
  });
  const candidates = [
    join(root, 'dist', 'index.html'),
    join(root, '.output', 'public', 'index.html')
  ];
  const htmlPath = candidates.find(path => existsSync(path));
  expect(htmlPath, 'expected generated index.html').toBeTruthy();
  const html = readFileSync(htmlPath!, 'utf8');
  const metas = html.match(/http-equiv="origin-trial"/g) ?? [];
  expect(metas.length).toBeGreaterThanOrEqual(2);
  expect(html).toContain(DEFAULT_WEBMCP_OT_CHROME);
  expect(html).toContain(DEFAULT_WEBMCP_OT_EDGE);
});
