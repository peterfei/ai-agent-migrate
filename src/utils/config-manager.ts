// ============================================
// Config Manager 实现 (TDD: Green 阶段)
// ============================================

import path from 'path';
import * as fs from 'fs-extra';
import { z } from 'zod';
import { MigrateConfig, MigrateConfigSchema, ValidatedMigrateConfig } from '../types/config';

/**
 * 配置管理器
 * 负责读取、写入和验证用户配置
 */
export class ConfigManager {
  private configDir: string;
  private configPath: string;

  constructor(customConfigDir?: string) {
    this.configDir = customConfigDir || this.getDefaultConfigDir();
    this.configPath = path.join(this.configDir, 'config.json');
  }

  /**
   * 获取配置目录路径
   */
  public getConfigDir(): string {
    return this.configDir;
  }

  /**
   * 获取配置文件路径
   */
  public getConfigPath(): string {
    return this.configPath;
  }

  /**
   * 获取默认配置目录
   */
  private getDefaultConfigDir(): string {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
    return path.join(homeDir, '.ai-agent-migrate');
  }

  /**
   * 读取配置文件
   */
  public async readConfig(): Promise<ValidatedMigrateConfig | null> {
    try {
      const exists = await fs.pathExists(this.configPath);
      if (!exists) {
        return null;
      }

      const configData = await fs.readJson(this.configPath);
      const config = this.applyEnvOverrides(configData);

      // 验证配置
      return MigrateConfigSchema.parse(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid configuration: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * 写入配置文件
   */
  public async writeConfig(config: MigrateConfig): Promise<void> {
    // 验证配置
    MigrateConfigSchema.parse(config);

    // 确保目录存在
    await fs.ensureDir(this.configDir);

    // 写入配置文件
    await fs.writeJson(this.configPath, config, { spaces: 2 });

    // 设置权限为 600 (owner read/write only)
    await fs.chmod(this.configPath, 0o600);
  }

  /**
   * 应用环境变量覆盖
   */
  private applyEnvOverrides(config: any): MigrateConfig {
    const overrides: Partial<MigrateConfig> = {};

    if (process.env.AI_MIGRATE_API_KEY) {
      overrides.llm = {
        ...config.llm,
        apiKey: process.env.AI_MIGRATE_API_KEY,
      };
    }

    if (process.env.AI_MIGRATE_PROVIDER) {
      overrides.llm = {
        ...(overrides.llm || config.llm),
        provider: process.env.AI_MIGRATE_PROVIDER as any,
      };
    }

    return {
      ...config,
      ...overrides,
    };
  }

  /**
   * 检查配置是否存在
   */
  public async configExists(): Promise<boolean> {
    return fs.pathExists(this.configPath);
  }

  /**
   * 删除配置文件
   */
  public async deleteConfig(): Promise<void> {
    const exists = await this.configExists();
    if (exists) {
      await fs.remove(this.configPath);
    }
  }
}
