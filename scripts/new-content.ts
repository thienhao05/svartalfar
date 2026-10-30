import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [kind, rawName] = process.argv.slice(2);
if (kind !== 'knowledge' || !rawName) {
  console.error('Usage: pnpm knowledge:new <slug-or-path>   e.g. linux/file-permissions');
  process.exit(1);
}

const slug = rawName
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd')
  .toLowerCase()
  .replace(/[^a-z0-9/]+/g, '-')
  .replace(/^-+|-+$/g, '');
const target = join('src/content', kind, `${slug}.md`);
if (existsSync(target)) {
  console.error(`Already exists: ${target}`);
  process.exit(1);
}

const title = slug.split('/').pop()!.replace(/-/g, ' ');
const body = readFileSync(join('scripts/templates', `${kind}.md`), 'utf8')
  .replace('<%= title %>', JSON.stringify(title))
  .replace('<%= date %>', new Date().toISOString().slice(0, 10));
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, body);
console.log(`Created ${target} (draft: true)`);
