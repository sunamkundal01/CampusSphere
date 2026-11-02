import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const cache = new Map();

// Load the project's ES-module .js files without changing its package type.
export function load(entry) {
  if (cache.has(entry)) return cache.get(entry);
  const result = buildSync({
    absWorkingDir: root,
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    external: ['next/server', 'convex', 'convex/*'],
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports);
  cache.set(entry, module.exports);
  return module.exports;
}
