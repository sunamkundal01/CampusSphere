import { convexTest } from 'convex-test';
import { load } from './load.mjs';

export const { api, internal } = load('convex/_generated/api.js');
const schema = load('convex/schema.js').default;
const files = ['_generated/server', 'user', 'userProfiles', 'fileStorage', 'notes', 'pyqStorage', 'myActions'];
const modules = Object.fromEntries(files.map(name => [
  `../convex/${name}.js`, async () => load(`convex/${name}.js`),
]));

// Each test gets a fresh in-memory backend. No deployment or API keys are used.
export function backend() {
  return convexTest(schema, modules);
}

export async function seed(t, table, records) {
  return t.run(async ctx => {
    const ids = [];
    for (const record of records) ids.push(await ctx.db.insert(table, record));
    return ids;
  });
}

export function user(email, extra = {}) {
  return { email, userName: email.split('@')[0], imageURL: '', ...extra };
}
