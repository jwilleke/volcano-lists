# Volcano Lists

A searchable TypeScript CLI application for exploring Global Volcanism Program (GVP) volcano data — Holocene and Pleistocene epochs.

**Data source:** [Smithsonian Global Volcanism Program](https://volcano.si.edu/)

## Quick Start

```bash
git clone <repository-url>
cd volcano-lists
npm install

# Import XLS data into JSON
npm run import

# Run the interactive search CLI
npm run dev
```

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Usage

The CLI provides interactive search and filtering across 2,600+ volcanoes:

```text
volcano> search Vesuvius
volcano> country Japan
volcano> type Stratovolcano
volcano> elevation 4000 9000
volcano> epoch H
volcano> list countries
volcano> stats
volcano> clear
```

**Available commands:**

- **`search <text>`** — Free-text search across all fields
- **`country <name>`** — Filter by country
- **`region <name>`** — Filter by volcanic region
- **`type <name>`** — Filter by primary volcano type
- **`rock <name>`** — Filter by dominant rock type
- **`tectonic <name>`** — Filter by tectonic setting
- **`epoch <H|P>`** — Filter by Holocene or Pleistocene
- **`elevation <min> <max>`** — Filter by elevation range (meters)
- **`lat <min> <max>`** — Filter by latitude range
- **`lon <min> <max>`** — Filter by longitude range
- **`list <field>`** — List distinct values (countries, regions, types, rocks, tectonics)
- **`stats`** — Show dataset statistics
- **`clear`** — Clear all active filters

## Updating Data

- Download new Holocene/Pleistocene XLS files from <https://volcano.si.edu/>
- Place them in `data/` (filenames must contain "Holocene" or "Pleistocene")
- Run `npm run import` to regenerate `data/volcanoes.json`

## Documentation

- **[AGENTS.md](AGENTS.md)** — Project context, architecture, and data schema
- **[SETUP.md](SETUP.md)** — Environment setup and installation
- **[CODE_STANDARDS.md](CODE_STANDARDS.md)** — Code quality and style guidelines
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Project structure and patterns
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Development workflow
- **[SECURITY.md](SECURITY.md)** — Security guidelines
- **[DOCUMENTATION.md](DOCUMENTATION.md)** — Documentation navigation guide

## Development Scripts

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

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md#project-structure) for the complete project structure.

## Next Steps

See [docs/project_log.md](docs/project_log.md) for current status and session history.
