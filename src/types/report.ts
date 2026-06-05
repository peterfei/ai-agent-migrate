// ============================================
// 报告类型 (src/types/report.ts)
// ============================================

/**
 * 文件差异
 */
export interface FileDiff {
  filePath: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  changes?: string;
}

/**
 * 报告格式
 */
export type ReportFormat = 'json' | 'markdown' | 'html' | 'terminal';

/**
 * 报告元数据
 */
export interface ReportMetadata {
  generatedAt: Date;
  version: string;
  format: ReportFormat;
}
