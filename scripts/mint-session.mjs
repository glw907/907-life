// Dev-only: mint a valid cairn-cms admin session cookie for smoke-testing the /admin guard
// without the magic-link email loop. Inserts a session row into the D1 auth store for a seeded
// editor, then prints the Cookie header to send with it.
//
// Usage (from the site repo):
//   node scripts/mint-session.mjs                  # local D1, first owner
//   node scripts/mint-session.mjs editor           # local D1, first editor
//   node scripts/mint-session.mjs owner --remote   # the deployed https Worker's D1
//   CK=$(node scripts/mint-session.mjs | tail -1); curl -H "$CK" http://localhost:8787/admin
//
// Why this exists: cairn-cms's own auth is self-owned on D1 (no better-auth, no signed
// cookie, no AUTH_SECRET). A session is a plain row: `session(id, email, expires_at,
// created_at)`. The cookie value is that opaque `id` itself, so minting one is an INSERT, not
// a signature. See cairn-cms/docs/internal/admin-smoke-test.md for the full manual procedure
// and the custom-domain caveat (this site's `wrangler.toml` declares a `custom_domain` route,
// so `wrangler dev` resolves every request to the production https origin regardless of the
// local host; smoke the deployed Worker with `--remote` rather than local http).
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { webcrypto as crypto } from 'node:crypto';

const root = new URL('../', import.meta.url);

function readD1Name() {
  const toml = readFileSync(new URL('wrangler.toml', root), 'utf8');
  const name = toml.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1];
  if (!name) throw new Error('No d1 database_name found in wrangler.toml');
  return name;
}

function d1(dbName, sql, remote) {
  const out = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', dbName, remote ? '--remote' : '--local', '--json', '--command', sql],
    { cwd: root.pathname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  // wrangler may print a non-JSON notice (e.g. the agent-skills prompt) before the JSON array.
  return JSON.parse(out.slice(out.indexOf('[')));
}

const args = process.argv.slice(2);
const remote = args.includes('--remote');
const role = args.includes('editor') ? 'editor' : 'owner';
const dbName = readD1Name();

const editors = d1(dbName, `SELECT email, role FROM editor WHERE role = '${role}' ORDER BY created_at LIMIT 1;`, remote);
const editor = editors?.[0]?.results?.[0];
if (!editor) {
  throw new Error(
    `No editor with role '${role}' in the D1 (${dbName}${remote ? ', --remote' : ', --local'}). Seed one, e.g.\n` +
      `  npx wrangler d1 execute ${dbName} ${remote ? '--remote' : '--local'} --command "INSERT INTO editor ` +
      `(email, display_name, role, created_at) VALUES ('you@example.com', 'Dev Owner', '${role}', 0);"`,
  );
}

const id = `smoke${Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')}`;
const now = Date.now();
d1(
  dbName,
  `INSERT INTO session (id, email, expires_at, created_at) VALUES ('${id}','${editor.email}',${now + 3600_000},${now});`,
  remote,
);

// __Host- requires Secure, so it only applies to the deployed https Worker; a local
// `wrangler dev` request over http drops the prefix.
const cookieName = remote ? '__Host-cairn_session' : 'cairn_session';

process.stderr.write(`Minted ${role} session for ${editor.email} (expires in 1h) in ${dbName}${remote ? ' (remote)' : ' (local)'}.\n`);
process.stderr.write(`Clean up with: npx wrangler d1 execute ${dbName} ${remote ? '--remote' : '--local'} --command "DELETE FROM session WHERE id = '${id}';"\n`);
process.stdout.write(`Cookie: ${cookieName}=${id}\n`);
