// ============================================
// Config Manager 测试 (TDD: Red-Green-Refactor)
// ============================================

import path from 'path';
import { ConfigManager } from '../../src/utils/config-manager';
import { MigrateConfig, LLMProvider } from '../../src/types/config';

describe('ConfigManager', () => {
  const testConfigDir = path.join(__dirname, '.test-config');
  const testConfigPath = path.join(testConfigDir, 'config.json');

  beforeEach(() => {
    // 清理测试环境
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // 清理测试文件
    const fs = await import('fs-extra');
    await fs.remove(testConfigDir);
  });

  describe('配置文件路径', () => {
    it('应该返回正确的配置目录路径', () => {
      const manager = new ConfigManager();
      const configDir = manager.getConfigDir();

      expect(configDir).toContain('.ai-agent-migrate');
    });

    it('应该返回正确的配置文件路径', () => {
      const manager = new ConfigManager();
      const configPath = manager.getConfigPath();

      expect(configPath).toContain('config.json');
    });
  });

  describe('读取配置', () => {
    it('应该返回 null 当配置文件不存在', async () => {
      const manager = new ConfigManager();
      const config = await manager.readConfig();

      expect(config).toBeNull();
    });

    it('应该读取并验证配置文件', async () => {
      const validConfig: MigrateConfig = {
        llm: {
          provider: LLMProvider.CLAUDE,
          apiKey: 'test-key-123',
        },
      };

      const fs = await import('fs-extra');
      await fs.ensureDir(testConfigDir);
      await fs.writeJson(testConfigPath, validConfig);

      const manager = new ConfigManager(testConfigDir);
      const config = await manager.readConfig();

      expect(config).not.toBeNull();
      expect(config?.llm.provider).toBe(LLMProvider.CLAUDE);
      expect(config?.llm.apiKey).toBe('test-key-123');
    });

    it('应该拒绝无效的配置', async () => {
      const invalidConfig = {
        llm: {
          provider: 'invalid-provider',
          apiKey: '',
        },
      };

      const fs = await import('fs-extra');
      await fs.ensureDir(testConfigDir);
      await fs.writeJson(testConfigPath, invalidConfig);

      const manager = new ConfigManager(testConfigDir);

      await expect(manager.readConfig()).rejects.toThrow();
    });
  });

  describe('写入配置', () => {
    it('应该写入配置文件', async () => {
      const config: MigrateConfig = {
        llm: {
          provider: LLMProvider.DEEPSEEK,
          apiKey: 'deepseek-key',
        },
      };

      const manager = new ConfigManager(testConfigDir);
      await manager.writeConfig(config);

      const fs = await import('fs-extra');
      const exists = await fs.pathExists(testConfigPath);

      expect(exists).toBe(true);
    });

    it('应该设置配置文件权限为 600', async () => {
      const config: MigrateConfig = {
        llm: {
          provider: LLMProvider.KIMI,
          apiKey: 'kimi-key',
        },
      };

      const manager = new ConfigManager(testConfigDir);
      await manager.writeConfig(config);

      const fs = await import('fs-extra');
      const stats = await fs.stat(testConfigPath);

      // 检查权限 (600 = rw-------)
      const mode = stats.mode & 0o777;
      expect(mode).toBe(0o600);
    });
  });

  describe('环境变量覆盖', () => {
    beforeEach(() => {
      process.env.AI_MIGRATE_API_KEY = 'env-api-key';
      process.env.AI_MIGRATE_PROVIDER = 'openai';
    });

    afterEach(() => {
      delete process.env.AI_MIGRATE_API_KEY;
      delete process.env.AI_MIGRATE_PROVIDER;
    });

    it('应该使用环境变量覆盖配置', async () => {
      const config: MigrateConfig = {
        llm: {
          provider: LLMProvider.CLAUDE,
          apiKey: 'file-api-key',
        },
      };

      const fs = await import('fs-extra');
      await fs.ensureDir(testConfigDir);
      await fs.writeJson(testConfigPath, config);

      const manager = new ConfigManager(testConfigDir);
      const mergedConfig = await manager.readConfig();

      expect(mergedConfig?.llm.apiKey).toBe('env-api-key');
      expect(mergedConfig?.llm.provider).toBe('openai');
    });
  });
});
