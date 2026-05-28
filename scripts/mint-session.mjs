// Dev-only: mint a valid better-auth session cookie for smoke-testing the /admin guard
// without the email loop. Inserts a session row into the LOCAL D1 (the one `wrangler dev`
// uses) for an owner user, then prints the signed `better-auth.session_token` cookie.
//
// Usage (from the site repo, with `wrangler dev` having created the local D1 at least once):
//   node scripts/mint-session.mjs            # picks the first owner; prints a Cookie header line
//   node scripts/mint-session.mjs editor     # picks the first editor instead of an owner
//   CK=$(node scripts/mint-session.mjs | tail -1); curl -H "$CK" http://localhost:8787/admin
//
// Why this exists: Pass AUTH replaced the hand-rolled HMAC session with better-auth (D1 +
// signed cookies). better-auth stores magic-link tokens hashed, so the email round-trip is not
// locally replayable; the session cookie, though, is a standard signed cookie we forge from
// AUTH_SECRET. The cookie format (better-call signCookieValue) is
//   encodeURIComponent( token + "." + base64( HMAC-SHA256(AUTH_SECRET, token) ) )
// and better-auth looks the session up by the raw token in the `session` table, so we insert a
// row with a known token and sign that token. See cairn-cms/docs/admin-smoke-test.md.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { webcrypto as crypto } from 'node:crypto';

const root = new URL('../', import.meta.url);

function readDevVar(name) {
  const vars = readFileSync(new URL('.dev.vars', root), 'utf8');
  return vars
    .match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, '');
}

function readD1Name() {
  const toml = readFileSync(new URL('wrangler.toml', root), 'utf8');
  const name = toml.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1];
  if (!name) throw new Error('No d1 database_name found in wrangler.toml');
  return name;
}

function d1(dbName, sql) {
  const out = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', dbName, '--local', '--json', '--command', sql],
    { cwd: root.pathname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  // wrangler may print a non-JSON notice (e.g. the agent-skills prompt) before the JSON array.
  return JSON.parse(out.slice(out.indexOf('[')));
}

const role = process.argv[2] === 'editor' ? 'editor' : 'owner';
const secret = readDevVar('AUTH_SECRET');
if (!secret) throw new Error('AUTH_SECRET not found in .dev.vars');
const dbName = readD1Name();

const users = d1(dbName, `SELECT id, email FROM user WHERE role = '${role}' ORDER BY created_at LIMIT 1;`);
const user = users?.[0]?.results?.[0];
if (!user) {
  throw new Error(
    `No ${role} user in the local D1 (${dbName}). Run \`wrangler dev\` once to apply migrations, ` +
      `then seed one, e.g.\n  npx wrangler d1 execute ${dbName} --local --command "INSERT INTO user ` +
      `(id, name, email, email_verified, role) VALUES ('dev-owner','Dev Owner','you@example.com',1,'${role}');"`,
  );
}

const token = `smoke${Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')}`;
const now = Date.now();
d1(
  dbName,
  `INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) ` +
    `VALUES ('${token}','${token}','${user.id}',${now + 3600_000},${now},${now});`,
);

const enc = new TextEncoder();
const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const sig = await crypto.subtle.sign('HMAC', key, enc.encode(token));
// better-call signs with standard base64, joins token.sig, then encodeURIComponent's the value.
const value = encodeURIComponent(`${token}.${Buffer.from(new Uint8Array(sig)).toString('base64')}`);

process.stderr.write(`Minted ${role} session for ${user.email} (expires in 1h) in ${dbName}.\n`);
process.stdout.write(`Cookie: better-auth.session_token=${value}\n`);
