<div align="center">

# ai-agent-migrate

**AI-Driven Code Migration CLI Tool**

Support for Vue2→Vue3, React Class→Hooks, JS→TS, and more migration scenarios

[![NPM Version](https://img.shields.io/npm/v/ai-agent-migrate)](https://www.npmjs.com/package/ai-agent-migrate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node version](https://img.shields.io/node/v/ai-agent-migrate.svg)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-43%20passed-brightgreen)](https://github.com/peterfei/ai-agent-migrate)

[中文版本文档](README.md)

</div>

---

## Introduction

**ai-agent-migrate** is a standalone CLI code migration tool that leverages **AST + LLM hybrid strategy** for intelligent code migration.

- **AST-First**: 60-70% of work handled by AST parsers (fast, free, accurate)
- **LLM Fallback**: 30-40% of work handled by LLM for semantically complex transformations
- **Independent Tool**: Published to npm, no dependency on Claude Code
- **MIT Licensed**: Fully open source

## Supported Migrations

| Migration Type | Description | Status |
|---------------|-------------|--------|
| Vue 2 → Vue 3 | Options API → Composition API | 🚧 In MVP |
| React Class → Hooks | Class components → Hooks | 🚧 Planned |
| JavaScript → TypeScript | Add type annotations | 🚧 Planned |
| CommonJS → ESM | require → import/export | 🚧 Planned |
| Angular → React | Framework migration | 📋 Planned |
| jQuery → Vue 3 | Framework migration | 📋 Planned |
| Python 2 → 3 | Version upgrade | 📋 Planned |

## Core Features

### 🎯 Smart Hybrid Strategy
- **AST Parser**: Uses babel, jscodeshift, ts-morph for deterministic transformations
- **LLM Powered**: Handles semantically complex transformations
- **Cost Optimized**: AST is free, LLM called only when needed

### 🔒 Safe & Reliable
- **Auto Backup**: Creates tar.gz backup before migration
- **Dry Run Mode**: Preview changes without modifying files
- **Rollback Support**: One-click restore to pre-migration state
- **Permission Control**: Config files set to 600

### 🤖 Multiple LLM Providers

| Provider | Price | Recommendation |
|----------|-------|----------------|
| **DeepSeek** | ¥1/M tokens | ⭐ Recommended |
| Kimi/Moonshot | ¥12/M tokens | 🌟 China |
| GLM/Zhipu | ¥12/M tokens | 🌟 China |
| Claude | $3/M tokens | 🌍 International |
| OpenAI | $5/M tokens | 🌍 International |

### 📋 Complete Workflow
1. **init** - Initialize LLM configuration
2. **analyze** - Analyze project, recommend migration plans
3. **plan** - Generate migration plan (no execution)
4. **migrate** - Execute migration
5. **upgrade** - Upgrade dependencies
6. **report** - View migration report
7. **rollback** - Rollback migration

## Installation

```bash
# Global installation
npm install -g ai-agent-migrate

# Or using pnpm
pnpm add -g ai-agent-migrate

# Or using yarn
yarn global add ai-agent-migrate
```

## Quick Start

### 1. Initialize Configuration

```bash
ai-agent-migrate init
```

Select LLM provider and enter API Key interactively.

### 2. Analyze Project

```bash
ai-agent-migrate analyze ./your-project
```

The tool analyzes project structure and recommends suitable migration plans.

### 3. Generate Migration Plan

```bash
ai-agent-migrate plan vue2 vue3 ./your-project
```

Preview migration operations without modifying files.

### 4. Execute Migration

```bash
ai-agent-migrate migrate vue2 vue3 ./your-project
```

**⚠️ Important**: Auto backup created before execution, rollback anytime!

### 5. View Report

```bash
ai-agent-migrate report
```

View migration statistics, costs, issues, etc.

### 6. Rollback (if needed)

```bash
ai-agent-migrate rollback
```

One-click restore to pre-migration state.

## CLI Commands

```bash
# View help
ai-agent-migrate --help

# View version
ai-agent-migrate --version

# Common options
ai-agent-migrate -d               # --dry-run: Simulate run
ai-agent-migrate -y               # --yes: Skip confirmations
ai-agent-migrate -v               # --verbose: Detailed logs
ai-agent-migrate -f json          # --format: Output format
```

## Configuration File

Config location: `~/.ai-agent-migrate/config.json`

```json
{
  "llm": {
    "provider": "deepseek",
    "apiKey": "sk-xxxxx"
  },
  "budget": {
    "maxCost": 10.0,
    "currency": "CNY"
  },
  "maxConcurrency": 4,
  "maxFileSize": 1048576
}
```

## Environment Variables

```bash
# Override API Key in config
export AI_MIGRATE_API_KEY=sk-xxxxx

# Override Provider in config
export AI_MIGRATE_PROVIDER=deepseek
```

## Development

```bash
# Clone repository
git clone https://github.com/peterfei/ai-agent-migrate.git
cd ai-agent-migrate

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test

# Link to global (dev mode)
npm link

# Unlink
npm unlink -g ai-agent-migrate
```

## Project Architecture

```
ai-agent-migrate/
├── src/
│   ├── commands/          # CLI command implementations
│   ├── core/
│   │   ├── engine/        # Migration engine (AST + LLM)
│   │   ├── providers/     # LLM provider adapters
│   │   └── analyzer/      # Project analyzers
│   ├── migrations/        # Migration handlers
│   └── utils/             # Utility functions
├── templates/
│   ├── migration-rules/   # AST transformation rules
│   └── prompts/           # LLM prompt templates
└── tests/
    ├── unit/              # Unit tests
    └── fixtures/          # Test projects
```

## Tech Stack

- **Language**: TypeScript 5.x
- **CLI Framework**: Commander.js
- **AST Parsing**: @babel/parser, jscodeshift, ts-morph
- **LLM SDK**: @anthropic-ai/sdk, openai
- **Validation**: Zod
- **Testing**: Jest + ts-jest
- **Engine**: Node.js >= 18

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE)

---

<div align="center">

Made with ❤️ by [peterfei](https://github.com/peterfei)

</div>
