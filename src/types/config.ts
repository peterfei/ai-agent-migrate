// ============================================
// 配置类型 (src/types/config.ts)
// ============================================

import { z } from 'zod';

/**
 * 支持的 LLM 供应商
 */
export const LLMProvider = {
  CLAUDE: 'claude',
  OPENAI: 'openai',
  DEEPSEEK: 'deepseek',
  KIMI: 'kimi',
  GLM: 'glm',
} as const;

export type LLMProviderType = (typeof LLMProvider)[keyof typeof LLMProvider];

/**
 * 信任级别
 */
export const TrustLevel = {
  FULL: 'full',
  STANDARD: 'standard',
  STRICT: 'strict',
} as const;

export type TrustLevelType = (typeof TrustLevel)[keyof typeof TrustLevel];

/**
 * LLM 配置
 */
export interface LLMConfig {
  provider: LLMProviderType;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
}

/**
 * 预算配置
 */
export interface BudgetConfig {
  tokens?: number;
  cost?: number;
}

/**
 * 上下文窗口限制配置
 */
export interface ModelContextLimits {
  [provider: string]: {
    [model: string]: number;
  };
}

/**
 * 迁移信任级别配置
 */
export interface TrustLevelConfig {
  global?: TrustLevelType;
  perMigration?: {
    [migrationType: string]: TrustLevelType;
  };
}

/**
 * 用户配置
 */
export interface MigrateConfig {
  llm: LLMConfig;
  budget?: BudgetConfig;
  modelContextLimits?: ModelContextLimits;
  trustLevel?: TrustLevelConfig;
  maxConcurrency?: number;
  maxFileSize?: number;
}

/**
 * 配置 Schema 验证
 */
export const MigrateConfigSchema = z.object({
  llm: z.object({
    provider: z.enum(['claude', 'openai', 'deepseek', 'kimi', 'glm']),
    apiKey: z.string().min(1),
    model: z.string().optional(),
    baseUrl: z.string().optional(),
    maxRetries: z.number().int().min(0).max(10).optional(),
    timeout: z.number().int().min(1).max(300).optional(),
  }),
  budget: z.object({
    tokens: z.number().int().positive().optional(),
    cost: z.number().positive().optional(),
  }).optional(),
  modelContextLimits: z.record(z.record(z.number().int().positive())).optional(),
  trustLevel: z.object({
    global: z.enum(['full', 'standard', 'standard']).optional(),
    perMigration: z.record(z.enum(['full', 'standard', 'strict'])).optional(),
  }).optional(),
  maxConcurrency: z.number().int().min(1).max(20).optional(),
  maxFileSize: z.number().int().positive().optional(),
});

export type ValidatedMigrateConfig = z.infer<typeof MigrateConfigSchema>;
