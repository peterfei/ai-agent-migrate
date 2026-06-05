// ============================================
// Provider Adapter 测试 (TDD: Red 阶段)
// ============================================

import { ProviderAdapter, MigrateCodeResult, ReviewCodeResult } from '../../src/core/providers/provider-adapter';

// Mock Adapter for testing
class MockAdapter implements ProviderAdapter {
  async migrateCode(
    _filePath: string,
    originalCode: string,
    _migrationType: string,
    _context?: Record<string, any>,
    _partialResult?: string
  ): Promise<MigrateCodeResult> {
    return {
      migratedCode: originalCode + ' [migrated]',
      tokenUsage: { input: 100, output: 50 },
      cost: 0.01,
    };
  }

  async reviewCode(_originalCode: string, _migratedCode: string): Promise<ReviewCodeResult> {
    return {
      approved: true,
      issues: [],
      suggestions: [],
    };
  }

  async validateKey(apiKey: string): Promise<boolean> {
    return apiKey.length > 0;
  }

  getName(): string {
    return 'mock';
  }
}

describe('ProviderAdapter', () => {
  let adapter: ProviderAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  describe('migrateCode', () => {
    it('应该返回迁移后的代码', async () => {
      const result = await adapter.migrateCode('test.ts', 'original code', 'js-to-ts');

      expect(result.migratedCode).toContain('original code');
      expect(result.migratedCode).toContain('[migrated]');
    });

    it('应该包含 token 使用信息', async () => {
      const result = await adapter.migrateCode('test.ts', 'code', 'js-to-ts');

      expect(result.tokenUsage).toBeDefined();
      expect(result.tokenUsage.input).toBeGreaterThan(0);
      expect(result.tokenUsage.output).toBeGreaterThan(0);
    });

    it('应该计算成本', async () => {
      const result = await adapter.migrateCode('test.ts', 'code', 'js-to-ts');

      expect(result.cost).toBeDefined();
      expect(result.cost).toBeGreaterThanOrEqual(0);
    });

    it('应该支持传递上下文信息', async () => {
      const context = { framework: 'vue', version: '2.0' };
      const result = await adapter.migrateCode('test.vue', 'code', 'vue2-to-vue3', context);

      expect(result.migratedCode).toBeDefined();
    });

    it('应该支持传递 AST 部分结果', async () => {
      const partialResult = '// AST transformed result';
      const result = await adapter.migrateCode('test.ts', 'code', 'js-to-ts', {}, partialResult);

      expect(result.migratedCode).toBeDefined();
    });
  });

  describe('reviewCode', () => {
    it('应该返回审查结果', async () => {
      const result = await adapter.reviewCode('original', 'migrated');

      expect(result).toBeDefined();
      expect(result.approved).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(result.suggestions).toBeDefined();
    });

    it('应该检测代码问题', async () => {
      const result = await adapter.reviewCode('original', 'migrated');

      expect(Array.isArray(result.issues)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('validateKey', () => {
    it('应该验证有效的 API key', async () => {
      const isValid = await adapter.validateKey('valid-api-key-123');

      expect(isValid).toBe(true);
    });

    it('应该拒绝空的 API key', async () => {
      const isValid = await adapter.validateKey('');

      expect(isValid).toBe(false);
    });
  });

  describe('getName', () => {
    it('应该返回适配器名称', () => {
      const name = adapter.getName();

      expect(name).toBe('mock');
    });
  });
});
