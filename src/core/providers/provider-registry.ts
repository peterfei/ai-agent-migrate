// ============================================
// Provider Registry 实现
// ============================================

import { ProviderAdapter } from './provider-adapter';

/**
 * Provider Registry
 * 管理所有 LLM 提供商适配器
 */
export class ProviderRegistry {
  private adapters: Map<string, ProviderAdapter> = new Map();

  /**
   * 注册适配器
   * @param name 适配器名称
   * @param adapter 适配器实例
   */
  register(name: string, adapter: ProviderAdapter): void {
    this.adapters.set(name, adapter);
  }

  /**
   * 解析适配器
   * @param name 适配器名称
   * @returns 适配器实例
   * @throws 如果适配器不存在
   */
  resolve(name: string): ProviderAdapter {
    const adapter = this.adapters.get(name);
    if (!adapter) {
      const available = Array.from(this.adapters.keys()).join(', ');
      throw new Error(
        `Provider "${name}" not found. Available providers: ${available || 'none'}`
      );
    }
    return adapter;
  }

  /**
   * 检查适配器是否存在
   * @param name 适配器名称
   */
  has(name: string): boolean {
    return this.adapters.has(name);
  }

  /**
   * 获取所有已注册的适配器名称
   */
  getRegisteredNames(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * 注销适配器
   * @param name 适配器名称
   */
  unregister(name: string): boolean {
    return this.adapters.delete(name);
  }

  /**
   * 清空所有适配器
   */
  clear(): void {
    this.adapters.clear();
  }

  /**
   * 获取适配器数量
   */
  size(): number {
    return this.adapters.size;
  }
}
