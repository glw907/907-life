// Regenerate the committed content manifest from the corpus on disk. Run with `npm run cairn:manifest`.
// It reads the markdown with fs, builds the manifest with the engine builder, and writes the canonical
// file the build verifies against. Node 24 runs the TypeScript adapter natively.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { serializeManifest, parseManifest, parseSiteConfig } from '@glw907/cairn-cms';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libUrl = pathToFileURL(join(root, 'src/lib') + '/').href;

const RAW_QUERY = '?raw';
const rawScheme = 'cairn-raw:';

// The site's cairn.config.ts and its siblings import each other with SvelteKit idiom: a `.js`
// specifier or none (Vite rewrites both), the `$lib` alias, and Vite's `?raw` query. Node's native
// type stripping resolves these literally, so it needs hooks. The resolve hook maps `$lib/`, rewrites
// a relative specifier to its `.ts` sibling, and flags a `?raw` import with a private scheme. The load
// hook turns a `?raw` URL into a module whose default export is the file text.
registerHooks({
  resolve(specifier, context, nextResolve) {
    let spec = specifier;
    let parent = context.parentURL;
    if (spec === '$lib' || spec.startsWith('$lib/')) {
      spec = './' + spec.slice('$lib'.length).replace(/^\//, '');
      parent = libUrl;
    }
    if (spec.endsWith(RAW_QUERY) && parent) {
      const target = new URL(spec.slice(0, -RAW_QUERY.length), parent);
      return { url: rawScheme + target.href, format: 'module', shortCircuit: true };
    }
    if (spec.startsWith('.') && parent) {
      const stem = spec.endsWith('.js') ? spec.slice(0, -3) : spec;
      const asTs = new URL(stem + '.ts', parent);
      const literal = new URL(spec, parent);
      if (existsSync(asTs) && !existsSync(literal)) {
        return nextResolve(stem + '.ts', { ...context, parentURL: parent });
      }
    }
    return nextResolve(spec, { ...context, parentURL: parent });
  },
  load(url, context, nextLoad) {
    if (url.startsWith(rawScheme)) {
      const file = fileURLToPath(url.slice(rawScheme.length));
      const text = readFileSync(file, 'utf8');
      return { format: 'module', source: `export default ${JSON.stringify(text)};`, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

// The /delivery barrel re-exports a .svelte component, which plain Node cannot load, so reach the
// builder through the resolved dist path. Resolve the package main, then swap to the manifest module.
const distMain = import.meta.resolve('@glw907/cairn-cms');
const { buildSiteManifest } = await import(new URL('./delivery/manifest.js', distMain).href);

const { cairn } = await import(join(root, 'src/lib/cairn.config.ts'));
const config = parseSiteConfig(readFileSync(join(root, 'src/lib/site.config.yaml'), 'utf8'));

function globOf(dir, prefix) {
  const out = {};
  for (const name of readdirSync(join(root, dir)).filter((n) => n.endsWith('.md'))) {
    out[`${prefix}/${name}`] = readFileSync(join(root, dir, name), 'utf8');
  }
  return out;
}

const globs = { posts: globOf('src/content/posts', '/src/content/posts') };
const manifest = buildSiteManifest(cairn, config, globs);
const out = join(root, 'src/content/.cairn/index.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, serializeManifest(manifest));
parseManifest(readFileSync(out, 'utf8')); // sanity: the file round-trips
console.log(`wrote ${out} with ${manifest.entries.length} entries`);
