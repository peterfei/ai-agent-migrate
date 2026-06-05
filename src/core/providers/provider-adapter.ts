// ============================================
// Provider Adapter 接口定义
// ============================================

/**
 * LLM 代码迁移结果
 */
export interface MigrateCodeResult {
  migratedCode: string;
  tokenUsage: {
    input: number;
    output: number;
  };
  cost: number;
}

/**
 * LLM 代码审查结果
 */
export interface ReviewCodeResult {
  approved: boolean;
  issues: string[];
  suggestions: string[];
}

/**
 * Provider Adapter 接口
 * 所有 LLM 提供商必须实现此接口
 */
export interface ProviderAdapter {
  /**
   * 迁移代码
   * @param filePath 文件路径
   * @param originalCode 原始代码
   * @param migrationType 迁移类型
   * @param context 额外上下文信息
   * @param partialResult AST 部分结果（可选）
   */
  migrateCode(
    filePath: string,
    originalCode: string,
    migrationType: string,
    context?: Record<string, any>,
    partialResult?: string
  ): Promise<MigrateCodeResult>;

  /**
   * 审查代码
   * @param originalCode 原始代码
   * @param migratedCode 迁移后的代码
   */
  reviewCode(
    originalCode: string,
    migratedCode: string
  ): Promise<ReviewCodeResult>;

  /**
   * 验证 API Key
   * @param apiKey API 密钥
   */
  validateKey(apiKey: string): Promise<boolean>;

  /**
   * 获取适配器名称
   */
  getName(): string;
}
