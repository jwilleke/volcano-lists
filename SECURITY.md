# Security Guidelines

Security practices for the volcano-lists project. All contributors must follow these guidelines. **Security practices are governed by [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md) which emphasizes: "NEVER put unencrypted 'Secrets' in Git".**

## Scope

This is a read-only CLI tool that processes public volcano data. It has:

- **No** authentication or user accounts
- **No** network requests at runtime
- **No** database or persistent storage beyond JSON files
- **No** user-submitted data beyond local CLI input

Security concerns are primarily around dependency management and secret hygiene.

## Secret Management

### Never Commit Secrets

**Critical Rule:** Never commit passwords, API keys, tokens, or other secrets to version control.

### How to Handle Secrets

- Copy `.env.example` to `.env` for local configuration
- Never commit `.env` (it's in `.gitignore`)
- Use GitHub repository secrets for CI/CD workflows

## Dependency Management

### Regular Audits

```bash
# Check for vulnerabilities
npm audit

# Check only production dependencies
npm audit --production

# Get detailed report
npm audit --json
```

### Updating Dependencies

- **Regular updates:** `npm update && npm outdated`
- **Patch security issues immediately:** `npm audit fix`
- **Major version updates:** Test thoroughly, check changelogs

### Automated Security Checks

The CI workflow runs `npm audit` on every pull request. See [.github/workflows/README.md](.github/workflows/README.md).

## Code Security

### TypeScript Strict Mode

All code uses `strict: true` in `tsconfig.json`:

- Catches null/undefined errors at compile time
- Requires explicit types
- Prevents implicit `any`

### Input Handling

CLI input is used only for local search queries against in-memory data. No input is passed to shell commands, SQL queries, or external services.

## Data Integrity

- XLS source files from GVP are committed to `data/` for reproducibility
- `data/volcanoes.json` is generated and gitignored
- The importer validates numeric fields and skips malformed rows

## Security Checklist

Before merging:

- [ ] No hardcoded secrets in code
- [ ] Dependencies audited (`npm audit`)
- [ ] TypeScript compiles without errors
- [ ] Linting passes (`npm run lint`)

## Tools

- **npm audit** — Check for known vulnerabilities
- **GitHub Dependabot** — Automated dependency updates
- **Husky pre-commit hooks** — Enforce linting before commits

## Related Documents

- [CODE_STANDARDS.md](./CODE_STANDARDS.md) — Code quality standards
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guidelines
- [.github/workflows/README.md](.github/workflows/README.md) — CI/CD pipeline documentation
