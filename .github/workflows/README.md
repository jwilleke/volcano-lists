# GitHub Actions Workflows

CI/CD pipeline definitions for volcano-lists.

**Related documentation:**

- [SECURITY.md](../../SECURITY.md) — Secret management and security
- [CODE_STANDARDS.md](../../CODE_STANDARDS.md) — Code quality standards enforced by CI
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Development workflow

## Available Workflows

### `ci.yml` — Continuous Integration

**Triggered on:** Push to `main`, Pull Requests to `main`

**What it does:**

- **Lint and Type-check** (Node 18.x and 20.x)
  - Installs dependencies
  - Runs ESLint for code quality
  - Type-checks with TypeScript
  - Builds the project
- **Security Audit**
  - Audits npm dependencies for vulnerabilities

### `deploy.yml` — Deployment Pipeline

**Triggered on:** Push to `main` or manual `workflow_dispatch`

**What it does:**

- Builds the project
- Placeholder for deployment steps (configure for your platform)

## Setting Up Secrets

For deployment workflows, configure GitHub repository secrets:

- Go to **Settings → Secrets and variables → Actions**
- Click **New repository secret**

See [SECURITY.md](../../SECURITY.md) for secret management guidelines.

## Troubleshooting

### Workflow not triggering

- Verify branch name matches (check for typos)
- Check `.yml` file syntax
- Ensure workflow file is in `.github/workflows/`

### npm audit failing

Update audit level in `ci.yml`:

```yaml
- name: Audit npm dependencies
  run: npm audit --audit-level=low
```

## See Also

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SECURITY.md](../../SECURITY.md)
- [CODE_STANDARDS.md](../../CODE_STANDARDS.md)
