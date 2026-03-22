# Documentation Navigation Guide

This guide helps you find the right documentation. We follow the DRY principle — each topic has one authoritative source.

## Start Here

Read [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md) first — contains overarching principles for code, documentation, and interactions.

## Source of Truth by Topic

| Topic | Source of Truth | Related Docs |
| --- | --- | --- |
| Project context & architecture | AGENTS.md | README.md, ARCHITECTURE.md |
| File structure | ARCHITECTURE.md | README.md |
| Code formatting & linting | CODE_STANDARDS.md | CONTRIBUTING.md |
| Naming conventions | CODE_STANDARDS.md | ARCHITECTURE.md |
| Commit messages | CODE_STANDARDS.md | CONTRIBUTING.md |
| Testing | CODE_STANDARDS.md | CONTRIBUTING.md |
| Security & dependencies | SECURITY.md | CODE_STANDARDS.md |
| CI/CD workflows | .github/workflows/README.md | SECURITY.md |
| Setup & installation | SETUP.md | README.md |
| Data schema & import | AGENTS.md | ARCHITECTURE.md |
| Session history | docs/project_log.md | AGENTS.md |

## Quick Links by Role

### New Developer

- Read [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md) for project principles
- Read [SETUP.md](./SETUP.md) for installation
- Read [AGENTS.md](./AGENTS.md) for project context and data schema
- Read [CODE_STANDARDS.md](./CODE_STANDARDS.md) for coding rules
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow

### AI Agent (Claude / Gemini)

- **CRITICAL:** Read [AGENTS.md](./AGENTS.md) first (serves as init file)
- Read [docs/project_log.md](docs/project_log.md) for recent work
- Follow [CODE_STANDARDS.md](./CODE_STANDARDS.md) for all code changes
- Update project_log.md after each session

## Development Documentation

- **Code standards & conventions:** [CODE_STANDARDS.md](./CODE_STANDARDS.md)
- **Project structure:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Contribution workflow:** [CONTRIBUTING.md](./CONTRIBUTING.md)

## DRY Principles Applied

- Naming conventions defined once in CODE_STANDARDS.md, referenced elsewhere
- File structure defined once in ARCHITECTURE.md, referenced in README.md
- Security guidance defined in SECURITY.md, referenced in workflows and standards
- Project status single source in AGENTS.md, referenced by all docs
- Data schema defined once in AGENTS.md, referenced in ARCHITECTURE.md

Each topic has one source of truth, preventing conflicting or outdated guidance.

## Contributing to Documentation

When updating documentation:

- Identify the authoritative source for that topic (see table above)
- Update only that source document
- Add cross-references from related documents
- Never duplicate content across files
- Update this guide if you introduce a new topic
