# Claude MCP Commands

Custom slash commands for Claude integration with volcano-lists.

## Available Commands

### `/context`

**File:** `commands/context.md`

Reads AGENTS.md and project_log.md to get current project state.

**When to use:** At the start of each session to understand what's been done and what needs attention.

### `/check-todos`

**File:** `commands/check-todos.md`

Displays actionable work items and priorities from AGENTS.md and project_log.md.

**When to use:** To decide what to work on in the current session.

### `/update-agents`

**File:** `commands/update-agents.md`

Reminds you to update AGENTS.md and project_log.md with your session's progress.

**When to use:** At the end of a session to document progress.

## Typical Workflow

- **Start session:** Use `/context` to understand project state
- **Check priorities:** Use `/check-todos` to pick what to work on
- **Work on tasks:** Follow CODE_STANDARDS.md
- **End session:** Use `/update-agents` to document progress

## See Also

- [AGENTS.md](../AGENTS.md) — Project context (init file)
- [CODE_STANDARDS.md](../CODE_STANDARDS.md) — Coding guidelines
- [docs/project_log.md](../docs/project_log.md) — Session history
