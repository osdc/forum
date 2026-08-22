# OSDForum

> **Work in Progress**: A community forum platform built for members of the **OSDC (Open Source Developers Club)**.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

## Frontend Linting

The frontend uses [Biome](https://biomejs.dev/) for linting and formatting.

Run checks:

```bash
cd frontend
npm run ci
```

Automatically fix formatting and safe lint issues:

```bash
cd frontend
npm run fix
```

## Git Hooks

Git hooks are automated using [Lefthook](https://lefthook.dev/) to ensure code quality before commits and pushes.

`Pre-Commit:` Runs Biome to check code formatting and catch linting errors.

`Pre-Push:` Runs the Vite build process (vite build) to verify there are no compilation errors.

`Post-Merge:` Syncs Lefthook configuration (npx lefthook install) and automatically installs updated project dependencies.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification using [Commitlint](https://commitlint.js.org/).

Example format:

```bash
git commit -m "feat: add OAuth login support"
git commit -m "fix(ui): resolve navbar overflow on mobile"
```

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
