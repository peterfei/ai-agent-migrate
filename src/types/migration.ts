// ============================================
// 迁移类型 (src/types/migration.ts)
// ============================================

/**
 * 文件状态
 */
export enum FileStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  INTERRUPTED = 'interrupted',
}

/**
 * 文件处理结果
 */
export interface FileResult {
  filePath: string;
  status: FileStatus;
  originalContent?: string;
  migratedContent?: string;
  diff?: string;
  error?: string;
  reason?: string;
  tokenUsage?: {
    input: number;
    output: number;
  };
}

/**
 * 迁移类型
 */
export type MigrationType =
  | 'vue2-to-vue3'
  | 'react-class-to-hooks'
  | 'js-to-ts'
  | 'cjs-to-esm'
  | 'angular-to-react'
  | 'jquery-to-vue'
  | 'python2-to-3'
  | 'java-to-kotlin';

/**
 * 项目画像
 */
export interface ProjectProfile {
  rootPath: string;
  framework?: string;
  language?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  fileCount: number;
  estimatedComplexity: 'low' | 'medium' | 'high';
}

/**
 * 迁移计划
 */
export interface MigrationPlan {
  migrationType: MigrationType;
  source: string;
  target: string;
  files: string[];
  estimatedTokens: number;
  estimatedCost: number;
  breakingChanges: string[];
  dependenciesToAdd: Record<string, string>;
  dependenciesToRemove: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * 迁移结果
 */
export interface MigrationResult {
  migrationType: MigrationType;
  status: 'completed' | 'completed_with_warnings' | 'failed' | 'interrupted';
  files: FileResult[];
  successCount: number;
  partialCount: number;
  failedCount: number;
  skippedCount: number;
  totalTokens: number;
  totalCost: number;
  duration: number;
  timestamp: Date;
  errorMessage?: string;
}

/**
 * 迁移报告
 */
export interface MigrationReport extends MigrationResult {
  projectPath: string;
  sessionId: string;
  backupPath?: string;
}
