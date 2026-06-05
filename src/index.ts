// ============================================
// ai-agent-migrate CLI 主入口
// ============================================

import { Command } from 'commander';
import { InitCommand } from './commands/init.command';
import { ConfigManager } from './utils/config-manager';
import { Logger } from './utils/logger';
import path from 'path';
import os from 'os';

const program = new Command();

// 获取配置目录
const getConfigDir = () => {
  const homeDir = os.homedir();
  return path.join(homeDir, '.ai-agent-migrate');
};

// 获取配置管理器
const getConfigManager = () => {
  const configDir = getConfigDir();
  return new ConfigManager(configDir);
};

// ============================================
// CLI 程序配置
// ============================================

program
  .name('ai-agent-migrate')
  .description('AI驱动的代码迁移CLI工具，支持Vue2→Vue3、React Class→Hooks、JS→TS等迁移场景')
  .version('0.1.0');

// ============================================
// 通用选项
// ============================================

program
  .option('-d, --dry-run', '模拟运行，不修改文件')
  .option('-y, --yes', '跳过所有确认提示')
  .option('-v, --verbose', '显示详细日志')
  .option('-f, --format <type>', '输出格式 (json|markdown|html)', 'markdown')
  .option('-e, --exclude <patterns...>', '排除的文件模式')
  .option('-p, --parallel <num>', '并行处理文件数量', '4');

// ============================================
// init 命令
// ============================================

program
  .command('init')
  .description('初始化 LLM 配置')
  .action(async () => {
    try {
      const configManager = getConfigManager();
      const initCmd = new InitCommand(configManager);
      await initCmd.execute();
    } catch (error) {
      Logger.error(`初始化失败: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// ============================================
// analyze 命令 (待实现)
// ============================================

program
  .command('analyze <projectPath>')
  .description('分析项目，推荐迁移方案')
  .option('-o, --output <file>', '输出报告到文件')
  .action(async (projectPath, options) => {
    Logger.warn('analyze 命令尚未实现');
    Logger.info(`项目路径: ${projectPath}`);
    if (options.output) {
      Logger.info(`输出文件: ${options.output}`);
    }
  });

// ============================================
// plan 命令 (待实现)
// ============================================

program
  .command('plan <source> <target> <projectPath>')
  .description('生成迁移计划（不执行）')
  .option('-o, --output <file>', '保存计划到文件')
  .action(async (source, target, projectPath, options) => {
    Logger.warn('plan 命令尚未实现');
    Logger.info(`迁移类型: ${source} → ${target}`);
    Logger.info(`项目路径: ${projectPath}`);
    if (options.output) {
      Logger.info(`输出文件: ${options.output}`);
    }
  });

// ============================================
// migrate 命令 (待实现)
// ============================================

program
  .command('migrate <source> <target> <projectPath>')
  .description('执行迁移')
  .option('-p, --plan <file>', '使用指定的迁移计划文件')
  .option('--no-backup', '不创建备份')
  .action(async (source, target, projectPath, options) => {
    Logger.warn('migrate 命令尚未实现');
    Logger.info(`迁移类型: ${source} → ${target}`);
    Logger.info(`项目路径: ${projectPath}`);
    Logger.info(`创建备份: ${!options.noBackup}`);
    if (options.plan) {
      Logger.info(`使用计划: ${options.plan}`);
    }
  });

// ============================================
// upgrade 命令 (待实现)
// ============================================

program
  .command('upgrade <package>')
  .description('升级依赖')
  .option('-t, --type <type>', '包管理器类型 (npm|yarn|pnpm)', 'npm')
  .action(async (pkg, options) => {
    Logger.warn('upgrade 命令尚未实现');
    Logger.info(`升级包: ${pkg}`);
    Logger.info(`包管理器: ${options.type}`);
  });

// ============================================
// report 命令 (待实现)
// ============================================

program
  .command('report [migrationId]')
  .description('查看迁移报告')
  .option('-f, --format <type>', '报告格式 (json|markdown|html)', 'markdown')
  .action(async (migrationId, options) => {
    Logger.warn('report 命令尚未实现');
    if (migrationId) {
      Logger.info(`迁移ID: ${migrationId}`);
    } else {
      Logger.info('显示最新的迁移报告');
    }
    Logger.info(`格式: ${options.format}`);
  });

// ============================================
// rollback 命令 (待实现)
// ============================================

program
  .command('rollback [migrationId]')
  .description('回滚迁移')
  .action(async (migrationId) => {
    Logger.warn('rollback 命令尚未实现');
    if (migrationId) {
      Logger.info(`回滚迁移: ${migrationId}`);
    } else {
      Logger.info('回滚最新的迁移');
    }
  });

// ============================================
// 错误处理
// ============================================

program.configureOutput({
  writeErr: (str) => {
    Logger.error(str);
  },
});

// ============================================
// 解析命令行参数
// ============================================

program.parseAsync(process.argv).catch((error) => {
  Logger.error(`命令执行失败: ${error.message}`);
  process.exit(1);
});

// ============================================
// 导出供测试使用
// ============================================

export { program };
