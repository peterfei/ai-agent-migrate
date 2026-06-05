<div align="center">

# ai-agent-migrate

**AI 驱动的代码迁移 CLI 工具**

支持 Vue2→Vue3、React Class→Hooks、JS→TS 等迁移场景

[![NPM Version](https://img.shields.io/npm/v/ai-agent-migrate)](https://www.npmjs.com/package/ai-agent-migrate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node version](https://img.shields.io/node/v/ai-agent-migrate.svg)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-43%20passed-brightgreen)](https://github.com/peterfei/ai-agent-migrate)

[English Version](README_EN.md)

</div>

---

## 项目简介

**ai-agent-migrate** 是一个独立的 CLI 代码迁移工具，通过 **AST + LLM 混合驱动**实现智能代码迁移。

- **AST 优先**：60-70% 的工作量通过 AST 解析器处理（快速、免费、准确）
- **LLM 兜底**：30-40% 的工作量通过 LLM 处理语义复杂的转换
- **不依赖 Claude Code**：独立发布到 npm，开箱即用
- **MIT 许可**：完全开源，可自由使用

## 支持的迁移场景

| 迁移类型 | 说明 | 状态 |
|---------|------|------|
| Vue 2 → Vue 3 | Options API → Composition API | 🚧 MVP 开发中 |
| React Class → Hooks | 类组件 → Hooks 组件 | 🚧 计划中 |
| JavaScript → TypeScript | JS 代码添加类型注解 | 🚧 计划中 |
| CommonJS → ESM | require → import/export | 🚧 计划中 |
| Angular → React | 框架迁移 | 📋 已规划 |
| jQuery → Vue 3 | 框架迁移 | 📋 已规划 |
| Python 2 → 3 | 版本升级 | 📋 已规划 |

## 核心特性

### 🎯 智能混合策略
- **AST 解析器**：使用 babel、jscodeshift、ts-morph 处理确定性转换
- **LLM 驱动**：处理需要语义理解的复杂转换
- **成本优化**：AST 处理免费，LLM 按需调用

### 🔒 安全可靠
- **自动备份**：迁移前自动创建 tar.gz 备份
- **Dry Run 模式**：预览变更，不修改文件
- **Rollback 支持**：一键回滚到迁移前状态
- **权限控制**：配置文件权限设置为 600

### 🤖 多 LLM 提供商支持

| 提供商 | 价格 | 推荐度 |
|--------|------|--------|
| **DeepSeek** | ¥1/百万tokens | ⭐ 推荐 |
| Kimi/Moonshot | ¥12/百万tokens | 🌟 国内 |
| GLM/智谱 | ¥12/百万tokens | 🌟 国内 |
| Claude | $3/百万tokens | 🌍 国际 |
| OpenAI | $5/百万tokens | 🌍 国际 |

### 📋 完整的工作流
1. **init** - 初始化 LLM 配置
2. **analyze** - 分析项目，推荐迁移方案
3. **plan** - 生成迁移计划（不执行）
4. **migrate** - 执行迁移
5. **upgrade** - 升级依赖
6. **report** - 查看迁移报告
7. **rollback** - 回滚迁移

## 安装

```bash
# 全局安装
npm install -g ai-agent-migrate

# 或使用 pnpm
pnpm add -g ai-agent-migrate

# 或使用 yarn
yarn global add ai-agent-migrate
```

## 快速开始

### 1. 初始化配置

```bash
ai-agent-migrate init
```

交互式选择 LLM 提供商并输入 API Key。

### 2. 分析项目

```bash
ai-agent-migrate analyze ./your-project
```

工具会分析项目结构，推荐合适的迁移方案。

### 3. 生成迁移计划

```bash
ai-agent-migrate plan vue2 vue3 ./your-project
```

查看将要执行的迁移操作，但不实际修改文件。

### 4. 执行迁移

```bash
ai-agent-migrate migrate vue2 vue3 ./your-project
```

**⚠️ 重要**：执行前会自动创建备份，可以随时回滚！

### 5. 查看报告

```bash
ai-agent-migrate report
```

查看迁移统计、成本、问题等信息。

### 6. 回滚（如需要）

```bash
ai-agent-migrate rollback
```

一键恢复到迁移前的状态。

## CLI 命令

```bash
# 查看帮助
ai-agent-migrate --help

# 查看版本
ai-agent-migrate --version

# 通用选项
ai-agent-migrate -d               # --dry-run: 模拟运行
ai-agent-migrate -y               # --yes: 跳过确认
ai-agent-migrate -v               # --verbose: 详细日志
ai-agent-migrate -f json          # --format: 输出格式
```

## 配置文件

配置文件位置：`~/.ai-agent-migrate/config.json`

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

## 环境变量

```bash
# 覆盖配置文件中的 API Key
export AI_MIGRATE_API_KEY=sk-xxxxx

# 覆盖配置文件中的 Provider
export AI_MIGRATE_PROVIDER=deepseek
```

## 开发

```bash
# 克隆仓库
git clone https://github.com/peterfei/ai-agent-migrate.git
cd ai-agent-migrate

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test

# 链接到全局（开发模式）
npm link

# 取消链接
npm unlink -g ai-agent-migrate
```

## 项目架构

```
ai-agent-migrate/
├── src/
│   ├── commands/          # CLI 命令实现
│   ├── core/
│   │   ├── engine/        # 迁移引擎（AST + LLM）
│   │   ├── providers/     # LLM 提供商适配器
│   │   └── analyzer/      # 项目分析器
│   ├── migrations/        # 迁移处理器
│   └── utils/             # 工具函数
├── templates/
│   ├── migration-rules/   # AST 转换规则
│   └── prompts/           # LLM 提示词模板
└── tests/
    ├── unit/              # 单元测试
    └── fixtures/          # 测试项目
```

## 技术栈

- **语言**: TypeScript 5.x
- **CLI 框架**: Commander.js
- **AST 解析**: @babel/parser, jscodeshift, ts-morph
- **LLM SDK**: @anthropic-ai/sdk, openai
- **验证**: Zod
- **测试**: Jest + ts-jest
- **引擎**: Node.js >= 18

## 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 开源协议

[MIT](LICENSE)

---

<div align="center">

Made with ❤️ by [peterfei](https://github.com/peterfei)

</div>
