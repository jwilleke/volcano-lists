# Setup Guide

Step-by-step instructions to set up the volcano-lists project locally.

**First:** Read [GLOBAL-CODE-PREFERENCES.md](GLOBAL-CODE-PREFERENCES.md) for project principles.

## System Requirements

### Required

- **Node.js:** v18 or higher
  - Check: `node --version`
  - Download: <https://nodejs.org/>
- **npm:** v9 or higher
  - Check: `npm --version`
- **Git:** Latest version
  - Check: `git --version`

### Recommended

- VS Code with TypeScript support
- 4GB+ RAM
- 500MB+ disk space

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd volcano-lists
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Import Volcano Data

The XLS source files are in `data/`. Convert them to JSON:

```bash
npm run import
```

This parses the GVP spreadsheets and writes `data/volcanoes.json`.

## Step 4: Run the App

```bash
npm run dev
```

You should see:

```text
Loading volcano data...
Loaded 2661 volcanoes.
```

Type `help` for available commands, or try `search Vesuvius`.

## Verification

Run these commands to verify setup:

```bash
# Check Node version
node --version      # Should be v18+

# Check dependencies installed
npm list --depth=0

# Check TypeScript
npx tsc --version

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

All commands should complete without errors.

## Development Commands

```bash
npm run import           # Parse XLS files into data/volcanoes.json
npm run dev              # Run interactive CLI
npm run build            # Compile TypeScript to dist/
npm run start            # Run compiled app
npm run typecheck        # Type-check without emitting
npm run lint             # Check code + markdown quality
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
```

## Updating Volcano Data

- Download new Holocene/Pleistocene XLS files from <https://volcano.si.edu/>
- Place them in `data/` (filenames must contain "Holocene" or "Pleistocene")
- Run `npm run import`

## Troubleshooting

### npm install fails

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Node version issues

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 18
nvm install 18
nvm use 18
```

### "Data file not found" error

Run `npm run import` to generate `data/volcanoes.json` from the XLS source files.

### TypeScript errors

```bash
npm install
npx tsc --version
npm run typecheck
```

## Next Steps

After setup:

- Read [AGENTS.md](AGENTS.md) for project context and architecture
- Read [CODE_STANDARDS.md](CODE_STANDARDS.md) for coding guidelines
- Check [docs/project_log.md](docs/project_log.md) for current status
