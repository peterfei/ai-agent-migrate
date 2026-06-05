// ============================================
// Provider Registry 测试 (TDD: Red 阶段)
// ============================================

import { ProviderRegistry } from '../../src/core/providers/provider-registry';
import { ProviderAdapter, MigrateCodeResult, ReviewCodeResult } from '../../src/core/providers/provider-adapter';

// Mock adapters for testing
class MockAdapter1 implements ProviderAdapter {
  async migrateCode(): Promise<MigrateCodeResult> {
    return { migratedCode: '', tokenUsage: { input: 0, output: 0 }, cost: 0 };
  }
  async reviewCode(): Promise<ReviewCodeResult> {
    return { approved: true, issues: [], suggestions: [] };
  }
  async validateKey(): Promise<boolean> {
    return true;
  }
  getName(): string {
    return 'mock1';
  }
}

class MockAdapter2 implements ProviderAdapter {
  async migrateCode(): Promise<MigrateCodeResult> {
    return { migratedCode: '', tokenUsage: { input: 0, output: 0 }, cost: 0 };
  }
  async reviewCode(): Promise<ReviewCodeResult> {
    return { approved: true, issues: [], suggestions: [] };
  }
  async validateKey(): Promise<boolean> {
    return true;
  }
  getName(): string {
    return 'mock2';
  }
}

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
  });

  describe('注册适配器', () => {
    it('应该成功注册适配器', () => {
      const adapter = new MockAdapter1();
      registry.register('mock1', adapter);

      expect(registry.has('mock1')).toBe(true);
    });

    it('应该注册多个适配器', () => {
      registry.register('mock1', new MockAdapter1());
      registry.register('mock2', new MockAdapter2());

      expect(registry.size()).toBe(2);
    });
  });

  describe('解析适配器', () => {
    it('应该成功解析已注册的适配器', () => {
      const adapter = new MockAdapter1();
      registry.register('mock1', adapter);

      const resolved = registry.resolve('mock1');

      expect(resolved).toBe(adapter);
      expect(resolved.getName()).toBe('mock1');
    });

    it('应该在适配器不存在时抛出错误', () => {
      expect(() => registry.resolve('nonexistent')).toThrow('Provider "nonexistent" not found');
    });

    it('应该在错误消息中显示可用的适配器', () => {
      registry.register('mock1', new MockAdapter1());
      registry.register('mock2', new MockAdapter2());

      expect(() => registry.resolve('nonexistent')).toThrow('Available providers: mock1, mock2');
    });
  });

  describe('检查适配器存在', () => {
    it('应该返回 true 当适配器存在', () => {
      registry.register('mock1', new MockAdapter1());

      expect(registry.has('mock1')).toBe(true);
    });

    it('应该返回 false 当适配器不存在', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('获取已注册的名称', () => {
    it('应该返回空数组当没有适配器', () => {
      const names = registry.getRegisteredNames();

      expect(names).toEqual([]);
    });

    it('应该返回所有已注册的适配器名称', () => {
      registry.register('mock1', new MockAdapter1());
      registry.register('mock2', new MockAdapter2());

      const names = registry.getRegisteredNames();

      expect(names).toEqual(expect.arrayContaining(['mock1', 'mock2']));
      expect(names.length).toBe(2);
    });
  });

  describe('注销适配器', () => {
    it('应该成功注销已注册的适配器', () => {
      registry.register('mock1', new MockAdapter1());

      const unregistered = registry.unregister('mock1');

      expect(unregistered).toBe(true);
      expect(registry.has('mock1')).toBe(false);
    });

    it('应该返回 false 当注销不存在的适配器', () => {
      const unregistered = registry.unregister('nonexistent');

      expect(unregistered).toBe(false);
    });
  });

  describe('清空适配器', () => {
    it('应该清空所有适配器', () => {
      registry.register('mock1', new MockAdapter1());
      registry.register('mock2', new MockAdapter2());

      registry.clear();

      expect(registry.size()).toBe(0);
      expect(registry.getRegisteredNames()).toEqual([]);
    });
  });
});
