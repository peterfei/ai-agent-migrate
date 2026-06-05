// ============================================
// Logger 实现 (TDD: Green 阶段 - MVP 版本)
// ============================================

/**
 * Logger 工具类
 * 提供日志输出（MVP 版本简化实现）
 */
export class Logger {
  /**
   * 成功消息
   */
  static success(message: string): void {
    console.log(`✓ ${message}`);
  }

  /**
   * 错误消息
   */
  static error(message: string): void {
    console.log(`✗ ${message}`);
  }

  /**
   * 警告消息
   */
  static warn(message: string): void {
    console.log(`⚠ ${message}`);
  }

  /**
   * 信息消息
   */
  static info(message: string): void {
    console.log(`ℹ ${message}`);
  }

  /**
   * 调试消息
   */
  static debug(message: string, enabled = true): void {
    if (enabled) {
      console.log(`🔍 ${message}`);
    }
  }

  /**
   * 显示应用横幅
   */
  static banner(): void {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                   ai-agent-migrate                         ║');
    console.log('║    AI-driven code migration with AST + LLM hybrid strategy ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
  }

  /**
   * 表格输出
   */
  static table(data: any[]): void {
    console.table(data);
  }

  /**
   * 换行
   */
  static newline(): void {
    console.log('');
  }

  /**
   * 分隔线
   */
  static separator(): void {
    console.log('────────────────────────────────────────────────────────────────');
  }
}
