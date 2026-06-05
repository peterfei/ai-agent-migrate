// ============================================
// Logger 测试 (TDD: Red 阶段)
// ============================================

import { Logger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('彩色输出', () => {
    it('应该输出红色错误消息', () => {
      Logger.error('错误消息');
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('错误消息');
    });

    it('应该输出绿色成功消息', () => {
      Logger.success('成功消息');
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('成功消息');
    });

    it('应该输出黄色警告消息', () => {
      Logger.warn('警告消息');
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('警告消息');
    });

    it('应该输出蓝色信息消息', () => {
      Logger.info('信息消息');
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('信息消息');
    });
  });

  describe('横幅输出', () => {
    it('应该显示应用横幅', () => {
      Logger.banner();
      expect(consoleSpy).toHaveBeenCalled();
      // banner 有多个 console.log 调用，检查是否有调用包含 'ai-agent-migrate'
      const calls = consoleSpy.mock.calls.map((args: any[]) => args[0]);
      const hasBanner = calls.some((call: any) => typeof call === 'string' && call.includes('ai-agent-migrate'));
      expect(hasBanner).toBe(true);
    });
  });

  describe('调试输出', () => {
    it('应该在调试模式下输出调试消息', () => {
      Logger.debug('调试消息', true);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('应该在非调试模式下不输出调试消息', () => {
      Logger.debug('调试消息', false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('表格输出', () => {
    it('应该输出表格格式数据', () => {
      const data = [
        { name: 'Vue2→Vue3', status: 'success' },
        { name: 'React Hooks', status: 'pending' },
      ];

      Logger.table(data);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('清空和换行', () => {
    it('应该输出换行', () => {
      Logger.newline();
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('');
    });
  });
});
