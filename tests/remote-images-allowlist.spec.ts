import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NETLIFY_REMOTE_IMAGE_HOSTS } from '../utils/remote-images';
import { expect, test } from './fixtures';

test('NETLIFY_REMOTE_IMAGE_HOSTS matches netlify.toml remote_images', () => {
  const tomlPath = join(process.cwd(), 'netlify.toml');
  // Endform runners only stage the test bundle — no repo checkout / netlify.toml.
  test.skip(
    process.env.ENDFORM === 'true' || !existsSync(tomlPath),
    'netlify.toml is not available on Endform runners (no repo checkout)'
  );

  const toml = readFileSync(tomlPath, 'utf8');
  const block = toml.match(/remote_images\s*=\s*\[([\s\S]*?)\]/);
  expect(block, 'remote_images array in netlify.toml').toBeTruthy();
  const fromToml = [...block![1].matchAll(/"([^"]+)"/g)].map(m => m[1]).sort();
  const fromModule = [...NETLIFY_REMOTE_IMAGE_HOSTS].sort();
  expect(fromModule).toEqual(fromToml);
});
