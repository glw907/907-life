# Getting Started: Building 907.life with Claude Code in VSCodium

A quick guide to executing the implementation plan.

---

## Before You Begin

### What's Ready
- ✅ VSCodium installed
- ✅ Claude Code extension installed
- ✅ Project directory: `~/Projects/907-life`
- ✅ CLAUDE.md and IMPLEMENTATION_PLAN.md in place

### What Happens in Phase 1
- Extensions will be installed
- Hugo will be installed
- Cloudflare account created
- Repository initialized

---

## Opening the Project

```bash
codium ~/Projects/907-life
```

Or from anywhere:
```bash
cd ~/Projects/907-life && codium .
```

---

## VSCodium Layout for Implementation

### Recommended Setup

1. **Open the plan** for reference:
   - `Ctrl+P` → type `IMPLEMENTATION_PLAN.md` → Enter

2. **Open the terminal**:
   - `` Ctrl+` `` (backtick) or View → Terminal

3. **Split view** (optional):
   - Drag IMPLEMENTATION_PLAN.md tab to the right to split editor

**Result:**
```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  File you're         │  IMPLEMENTATION_     │
│  working on          │  PLAN.md             │
│                      │                      │
├──────────────────────┴──────────────────────┤
│  Terminal (Claude Code)                     │
│  $                                          │
└─────────────────────────────────────────────┘
```

---

## Starting Claude Code

In the VSCodium terminal:

```bash
claude
```

Claude Code will:
- Automatically read CLAUDE.md for project context
- Have access to all project files
- Be able to create and edit files (you'll see changes in VSCodium)

---

## Working Through the Plan

### Phase-by-Phase Approach

1. **Start a phase** by telling Claude Code:
   ```
   Let's start Phase 1: Environment Setup. Please follow IMPLEMENTATION_PLAN.md.
   ```

2. **Stay engaged** — review what Claude Code does, approve commands

3. **Check the completion checklist** at the end of each phase

4. **Update CLAUDE.md** — remind Claude Code at the end of each phase:
   ```
   Please update CLAUDE.md with what we learned in this phase.
   ```

5. **Commit before moving on**:
   ```
   Please commit our Phase 1 progress.
   ```

### Best Practices

| Practice | Why |
|----------|-----|
| **One phase at a time** | Keeps changes manageable, easier to troubleshoot |
| **Review before approving** | Understand what commands will do |
| **Test at phase end** | Catch issues before building on top of them |
| **Commit between phases** | Clean checkpoints to roll back if needed |
| **Keep the plan visible** | Reference while working |

---

## Communicating with Claude Code

### Starting a Phase
```
Let's work on Phase 2: Hugo Project Foundation.
Please follow the tasks in IMPLEMENTATION_PLAN.md.
```

### If Something Goes Wrong
```
That didn't work. Here's the error: [paste error]
Please troubleshoot. Remember to search the web if needed (Ubuntu 24.04).
```

### Checking Progress
```
Let's review the Phase 3 completion checklist. What's done and what's remaining?
```

### Switching to Opus (When Needed)
If you hit complex issues, exit Claude Code and restart with Opus:
```bash
claude --model opus
```

Use Opus for: architectural decisions, significant replanning, complex debugging.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `` Ctrl+` `` | Toggle terminal |
| `Ctrl+P` | Quick open file |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+S` | Save file |
| `Ctrl+Shift+E` | Focus file explorer |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+\` | Split editor |

---

## Quick Reference

### Project Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code context (reads automatically) |
| `IMPLEMENTATION_PLAN.md` | Step-by-step build guide |
| `GETTING_STARTED.md` | This file |

### Key Commands
```bash
# Open project
codium ~/Projects/907-life

# Start Claude Code (Sonnet - default for implementation)
claude

# Start Claude Code with Opus (for complex decisions)
claude --model opus

# Check Hugo (after Phase 1)
hugo version

# Preview site (after Phase 2+)
hugo server -D
```

---

## Typical Session Flow

```
1. Open VSCodium           →  codium ~/Projects/907-life
2. Open terminal           →  Ctrl+`
3. Open plan (side panel)  →  Ctrl+P → IMPLEMENTATION_PLAN.md
4. Start Claude Code       →  claude
5. Begin phase             →  "Let's start Phase X..."
6. Work through tasks      →  Review, approve, test
7. Complete checklist      →  Verify all items done
8. Update CLAUDE.md        →  "Update CLAUDE.md with this phase"
9. Commit                  →  "Commit our Phase X progress"
10. Next phase or stop     →  Continue or exit
```

---

## Ready to Start?

1. Open the project:
   ```bash
   codium ~/Projects/907-life
   ```

2. Set up your layout (plan + terminal)

3. Start Claude Code and begin Phase 1:
   ```
   Let's start Phase 1: Environment Setup. Please follow IMPLEMENTATION_PLAN.md.
   ```

Good luck! 🚀
