// ============================================
// Init Command 测试 (使用手动 Mock)
// ============================================

import path from 'path';
import inquirer from 'inquirer';
import { InitCommand } from '../../../src/commands/init.command';
import { ConfigManager } from '../../../src/utils/config-manager';

// 使用手动 mock
jest.mock('inquirer');

describe('InitCommand', () => {
  const testConfigDir = path.join(__dirname, '.test-config-init');

  beforeEach(async () => {
    jest.clearAllMocks();
    // 清空之前的 mock 响应
    (inquirer as any).__clearMockResponses();
  });

  afterEach(async () => {
    const fs = await import('fs-extra');
    await fs.remove(testConfigDir);
  });

  describe('执行初始化', () => {
    it('应该保存配置到文件', async () => {
      // 设置 mock 响应
      (inquirer as any).__setMockResponses({
        provider: 'kimi',
        apiKey: 'kimi-key',
      });

      const promptSpy = jest.spyOn(inquirer, 'prompt').mockResolvedValue({
        provider: 'kimi',
        apiKey: 'kimi-key',
      });

      const configManager = new ConfigManager(testConfigDir);
      const initCmd = new InitCommand(configManager);

      await initCmd.execute();

      const config = await configManager.readConfig();

      expect(config).not.toBeNull();
      expect(config?.llm.provider).toBe('kimi');
      expect(config?.llm.apiKey).toBe('kimi-key');
      expect(promptSpy).toHaveBeenCalled();

      promptSpy.mockRestore();
    });

    it('应该设置配置文件权限为 600', async () => {
      (inquirer as any).__setMockResponses({
        provider: 'openai',
        apiKey: 'openai-key',
      });

      const promptSpy = jest.spyOn(inquirer, 'prompt').mockResolvedValue({
        provider: 'openai',
        apiKey: 'openai-key',
      });

      const configManager = new ConfigManager(testConfigDir);
      const initCmd = new InitCommand(configManager);

      await initCmd.execute();

      const fs = await import('fs-extra');
      const stats = await fs.stat(path.join(testConfigDir, 'config.json'));
      const mode = stats.mode & 0o777;

      expect(mode).toBe(0o600);

      promptSpy.mockRestore();
    });
  });

  describe('配置已存在时', () => {
    it('应该提示用户覆盖', async () => {
      // 创建已存在的配置
      const fs = await import('fs-extra');
      await fs.ensureDir(testConfigDir);
      await fs.writeJson(path.join(testConfigDir, 'config.json'), {
        llm: { provider: 'claude', apiKey: 'old-key' },
      });

      const promptSpy = jest.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({
          overwrite: true,
        })
        .mockResolvedValueOnce({
          provider: 'deepseek',
          apiKey: 'new-key',
        });

      const configManager = new ConfigManager(testConfigDir);
      const initCmd = new InitCommand(configManager);

      await initCmd.execute();

      const config = await configManager.readConfig();
      expect(config?.llm.apiKey).toBe('new-key');
      expect(promptSpy).toHaveBeenCalledTimes(2);

      promptSpy.mockRestore();
    });

    it('应该取消当用户选择不覆盖', async () => {
      // 创建已存在的配置
      const fs = await import('fs-extra');
      await fs.ensureDir(testConfigDir);
      await fs.writeJson(path.join(testConfigDir, 'config.json'), {
        llm: { provider: 'claude', apiKey: 'old-key' },
      });

      const promptSpy = jest.spyOn(inquirer, 'prompt').mockResolvedValue({
        overwrite: false,
      });

      const configManager = new ConfigManager(testConfigDir);
      const initCmd = new InitCommand(configManager);

      await initCmd.execute();

      const config = await configManager.readConfig();
      expect(config?.llm.apiKey).toBe('old-key');

      promptSpy.mockRestore();
    });
  });
});
