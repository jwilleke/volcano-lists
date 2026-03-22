# Contributing

Guidelines for developers and AI agents working on volcano-lists. All contributions must follow [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md).

## Before You Start

- Read [AGENTS.md](./AGENTS.md) for project context, architecture, and data schema
- Review [CODE_STANDARDS.md](./CODE_STANDARDS.md) for coding guidelines
- Check [SECURITY.md](./SECURITY.md) for security practices
- See [SETUP.md](./SETUP.md) for environment setup

## Development Workflow

### Read Project Context First

Before starting work, read `AGENTS.md` and `docs/project_log.md` to understand current status, recent work, and next steps.

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
git checkout -b fix/bug-description
```

**Branch naming:** `type/description`

### Make Changes

Follow [CODE_STANDARDS.md](./CODE_STANDARDS.md) for all code conventions.

### Linting and Formatting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format with Prettier
```

### Testing

```bash
npm run typecheck   # Verify TypeScript compiles
npm run lint        # Check code + markdown quality
npm run dev         # Manually verify search works
```

## Commit Guidelines

**All commit messages must follow the format in [CODE_STANDARDS.md — Git Commit Messages](./CODE_STANDARDS.md#git-commit-messages).**

- Conventional commits format (type, scope, description)
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Pre-commit hooks enforce linting standards

## Pull Requests

### Before Creating a PR

- Update branch: `git fetch origin && git rebase origin/main`
- Run checks: `npm run lint && npm run typecheck && npm run build`
- Update [AGENTS.md](./AGENTS.md) if making significant changes
- Update [docs/project_log.md](docs/project_log.md) with session work

### PR Checklist

- [ ] Code follows [CODE_STANDARDS.md](./CODE_STANDARDS.md)
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] No hardcoded secrets
- [ ] Commit messages follow conventions
- [ ] AGENTS.md updated if applicable
- [ ] project_log.md updated

## Code Review Process

- Be respectful and constructive
- Review promptly
- All CI checks must pass before merging
