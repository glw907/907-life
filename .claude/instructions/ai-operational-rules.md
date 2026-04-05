# AI Operational Rules

Rules specific to how Claude Code executes in this environment. These reflect actual
runtime behavior — not general best practices, but things that will silently break if
ignored.

---

## Bash Tool: Shell State

**The Bash tool does NOT load `~/.bashrc`.** Environment variables are empty by default.

Always source manually before using any env var:

```bash
# Correct
CF_TOKEN=$(bash -c 'source ~/.bashrc && echo -n $CLOUDFLARE_API_TOKEN')
RESEND_KEY=$(bash -c 'source ~/.bashrc && echo -n $RESEND_API_KEY')

# Wrong — silently pipes empty string
echo "$CLOUDFLARE_API_TOKEN" | npx wrangler secret put ...
```

**Working directory persists across Bash calls.** Track where you are and use absolute
paths when in doubt.

**Never run `node -e "..."` with CSS selectors** — dots in shell strings cause
interpretation issues. Write the script to a temp file with the Write tool, then run it.

---

## Deployment: Normal vs. Manual

**Normal deploy:** `git push origin main` → GitHub Actions builds and deploys.

**Never run `npx wrangler deploy` from the project root during normal workflow.** It
overwrites the Actions-managed deploy with a stale local `public/` build.

Manual deploy only for emergencies (Actions is broken):
```bash
hugo --minify && npx wrangler deploy
```

---

## Wrangler Secrets: Always Specify the Worker

`npx wrangler secret put` reads the local `wrangler.toml` to determine which Worker to
target. Running from the wrong directory sets the secret on the wrong Worker with no error.

**Use the `--name` flag to be explicit:**

```bash
npx wrangler secret put SECRET_NAME --name YOUR-WORKER-NAME
```

---

## Git Safety Rules

- **Always stage specific files:** `git add path/to/file` — never `git add -A` or `git add .`
  (can accidentally stage `.env` files or unrelated changes)
- **Never amend commits** unless the user explicitly asks. After a pre-commit hook failure,
  create a NEW commit — `--amend` would modify the previous commit.
- **Never force push to `main`** without explicit user instruction.
- **Never skip hooks** (`--no-verify`) without explicit instruction.

---

## GitHub CLI

`gh issue view <number>` may fail in some configurations. Use instead:

```bash
gh issue list --search "keyword"      # find and read issues
gh issue comment NUMBER --body "..."  # add comment
gh issue close NUMBER --comment "..." # close with comment
```

---

## Secrets Location

All local dev secrets in `~/.bashrc`. Worker runtime secrets via `npx wrangler secret put`.
Never commit secrets or `.env` files.
