# Code Standards

Coding standards and best practices for volcano-lists. All standards follow [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md).

Related documents:

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Project structure and patterns
- [SECURITY.md](./SECURITY.md) — Security guidelines and dependency management
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Development workflow

## Overview

We follow the DRY (Don't Repeat Yourself) principle — every piece of knowledge should have a single, unambiguous, authoritative representation.

## Language & Environment

- **Language:** English (US) for all code and documentation
- **Runtime:** Node.js with TypeScript
- **Target:** ES2020

## TypeScript Configuration

We use strict TypeScript settings (`strict: true`). Key settings:

- Strict null checks enabled
- No implicit `any` types
- No unused variables or parameters
- No implicit returns

See `tsconfig.json` for full configuration.

## Code Formatting

### Prettier

Key settings:

- Single quotes for strings
- 2-space indentation
- 100-character line width
- Trailing commas disabled
- Unix line endings (LF)

```bash
npm run format
```

### EditorConfig

EditorConfig settings (`.editorconfig`) ensure consistent editor behavior across tools.

## Linting

### ESLint

Key rules:

- Prefer `const` over `let` and `var`
- Unused variables must be prefixed with `_`
- Single quotes required
- Semicolons required
- Proper async/await usage

```bash
npm run lint          # Code + markdown linting
npm run lint:code     # ESLint only
npm run lint:fix      # Auto-fix both
```

### Markdownlint

Configuration: `.markdownlint.json`

Key rules:

- Consistent heading style
- 2-space indentation for lists
- **No bold text as headings (MD036)** — use proper heading syntax (`##`, `###`) instead
- Blank lines around lists and code blocks

```bash
npm run lint:md       # Check all markdown files
npm run lint:md:fix   # Auto-fix markdown issues
```

## Naming Conventions

- **Files:** kebab-case (e.g., `search.ts`, `import.ts`)
- **Interfaces:** PascalCase (e.g., `Volcano`, `SearchFilters`)
- **Functions/Variables:** camelCase (e.g., `loadVolcanoes`, `matchesText`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DATA_DIR`, `HOLOCENE_HEADERS`)

## Code Organization

### Function Length

- Keep functions focused and single-purpose
- Prefer functions under 50 lines
- Extract complex logic into separate functions

### Comments

- Avoid obvious comments
- Explain *why*, not *what*
- Use JSDoc for public APIs and complex functions

## Error Handling

- Always handle promise rejections
- Provide meaningful error messages
- Exit with informative messages when data files are missing

## Testing

- Write tests for all public functions
- Test behavior, not implementation details
- Aim for >80% code coverage

## Git Commit Messages

Follow conventional commits format:

```text
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Example:**

```text
feat(search): add elevation range filtering

Adds min/max elevation parameters to SearchFilters
and applies them during volcano search.
```

## Pre-commit Hooks

Husky runs linting before commits. Commits with linting errors will be rejected.

The pre-commit hook runs:

- ESLint on TypeScript files
- Markdownlint on all markdown files

## Package Standards

Keep dependencies minimal. Current runtime dependency: `xlsx` only.

For dependency security, see [SECURITY.md](./SECURITY.md#dependency-management).

## Performance Considerations

- Dataset is small (~2,700 records) — linear scan is fast enough
- Avoid unnecessary object allocation in hot search paths
- Profile before optimizing

## Review Checklist

Before submitting code for review:

- [ ] Code passes linting (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Markdown files pass linting
- [ ] Commit message follows [conventions](#git-commit-messages)
- [ ] No hardcoded secrets or credentials
