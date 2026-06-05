// ============================================
// Init Command 实现 (TDD: Green 阶段)
// ============================================

import inquirer from 'inquirer';
import { ConfigManager } from '../utils/config-manager';
import { Logger } from '../utils/logger';
import { LLMProvider } from '../types/config';

/**
 * Init Command
 * 初始化 LLM 配置
 */
export class InitCommand {
  constructor(private configManager: ConfigManager) {}

  /**
   * 执行初始化命令
   */
  async execute(): Promise<void> {
    try {
      // 检查配置是否已存在
      const configExists = await this.configManager.configExists();

      if (configExists) {
        const existing = await this.configManager.readConfig();
        Logger.warn(`Configuration already exists: ${this.configManager.getConfigPath()}`);
        Logger.info(`Current provider: ${existing?.llm.provider || 'none'}`);

        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'Do you want to overwrite the existing configuration?',
            default: false,
          },
        ]);

        if (!overwrite) {
          Logger.info('Initialization cancelled.');
          return;
        }
      }

      // 交互式配置
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'provider',
          message: '选择 LLM 提供商 (推荐 DeepSeek - 价格最低):',
          choices: [
            { name: 'DeepSeek (国内，¥1/百万tokens)', value: LLMProvider.DEEPSEEK },
            { name: 'Kimi/Moonshot (国内，¥12/百万tokens)', value: LLMProvider.KIMI },
            { name: 'GLM/智谱 (国内，¥12/百万tokens)', value: LLMProvider.GLM },
            { name: 'Claude (国际，$3/百万tokens)', value: LLMProvider.CLAUDE },
            { name: 'OpenAI (国际，$5/百万tokens)', value: LLMProvider.OPENAI },
          ],
          default: LLMProvider.DEEPSEEK,
        },
        {
          type: 'password',
          name: 'apiKey',
          message: '请输入 API Key:',
          mask: '*',
          validate: (input: string) => {
            if (!input || input.trim().length === 0) {
              return 'API Key 不能为空';
            }
            return true;
          },
        },
      ]);

      // 保存配置
      const config = {
        llm: {
          provider: answers.provider,
          apiKey: answers.apiKey,
        },
      };

      await this.configManager.writeConfig(config);

      // 显示成功消息
      Logger.success('Configuration saved successfully!');
      Logger.info(`配置文件: ${this.configManager.getConfigPath()}`);
      Logger.info(`当前供应商: ${answers.provider}`);
      Logger.newline();
      Logger.info('下一步:');
      Logger.info('  1. 分析项目: ai-agent-migrate analyze ./your-project');
      Logger.info('  2. 计划迁移: ai-agent-migrate plan vue2 vue3 ./your-project');
      Logger.info('  3. 执行迁移: ai-agent-migrate migrate vue2 vue3 ./your-project');
    } catch (error) {
      Logger.error(`Initialization failed: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }
}
