#!/usr/bin/env node
/**
 * Runs tsc. Works in monorepo (Yarn PnP) and standalone (npm).
 * Tries: yarn exec tsc → npx tsc → tsc
 */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function run(cmd) {
  const r = spawnSync(cmd, { cwd: root, stdio: 'inherit', shell: true });
  return r.status === 0;
}

// 1. yarn exec tsc (works with Yarn PnP)
if (run('yarn exec tsc')) process.exit(0);

// 2. npx tsc (works when node_modules exists)
if (run('npx tsc')) process.exit(0);

// 3. tsc from PATH (standalone with npm install)
if (run('tsc')) process.exit(0);

console.error('dnc-ui build: Could not run TypeScript compiler. Run "npm install" or "yarn install" first.');
process.exit(1);
