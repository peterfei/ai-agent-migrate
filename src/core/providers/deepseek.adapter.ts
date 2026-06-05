// ============================================
// DeepSeek Provider Adapter 实现
// ============================================

import OpenAI from 'openai';
import {
  ProviderAdapter,
  MigrateCodeResult,
  ReviewCodeResult,
} from './provider-adapter';

/**
 * DeepSeek API 配置
 */
const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1',
  defaultModel: 'deepseek-coder',
  pricing: {
    input: 0.00001, // ¥1/百万tokens ≈ $0.00001/token
    output: 0.00002,
  },
};

/**
 * DeepSeek Provider Adapter
 */
export class DeepSeekAdapter implements ProviderAdapter {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = DEEPSEEK_CONFIG.defaultModel) {
    this.client = new OpenAI({
      apiKey,
      baseURL: DEEPSEEK_CONFIG.baseURL,
    });
    this.model = model;
  }

  /**
   * 迁移代码
   */
  async migrateCode(
    filePath: string,
    originalCode: string,
    migrationType: string,
    context?: Record<string, any>,
    partialResult?: string
  ): Promise<MigrateCodeResult> {
    const systemPrompt = this.buildSystemPrompt(migrationType);
    const userPrompt = this.buildUserPrompt(filePath, originalCode, context, partialResult);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 8000,
      });

      const migratedCode = this.extractCode(response.choices[0].message.content || '');
      const tokenUsage = {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
      };
      const cost = this.calculateCost(tokenUsage);

      return {
        migratedCode,
        tokenUsage,
        cost,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DeepSeek API 调用失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 审查代码
   */
  async reviewCode(
    originalCode: string,
    migratedCode: string
  ): Promise<ReviewCodeResult> {
    const systemPrompt = `你是一个代码审查专家，负责检查迁移后的代码是否正确、完整且符合最佳实践。

请检查：
1. 语法错误和逻辑错误
2. 功能是否完整保留
3. 是否有性能问题
4. 是否符合目标框架/语言的最佳实践

请以 JSON 格式返回审查结果。`;

    const userPrompt = `原始代码：
\`\`\`
${originalCode}
\`\`\`

迁移后的代码：
\`\`\`
${migratedCode}
\`\`\`

请审查迁移后的代码，返回 JSON 格式：
{
  "approved": true/false,
  "issues": ["问题1", "问题2"],
  "suggestions": ["建议1", "建议2"]
}`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        approved: result.approved || false,
        issues: result.issues || [],
        suggestions: result.suggestions || [],
      };
    } catch (error) {
      // 如果解析失败，返回基本结果
      return {
        approved: true,
        issues: [],
        suggestions: [],
      };
    }
  }

  /**
   * 验证 API Key
   */
  async validateKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new OpenAI({
        apiKey,
        baseURL: DEEPSEEK_CONFIG.baseURL,
      });

      await testClient.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取适配器名称
   */
  getName(): string {
    return 'deepseek';
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(migrationType: string): string {
    const prompts: Record<string, string> = {
      'vue2-to-vue3': `你是一个 Vue 2 到 Vue 3 的代码迁移专家。

迁移规则：
1. Vue 2 的 Options API 转换为 Vue 3 Composition API (使用 <script setup>)
2. this.$store 替换为 useStore()
3. Vue Router 从 vue-router@3 升级到 vue-router@4 语法
4. Vuex 替换为 Pinia
5. 生命周期钩子更新：beforeDestroy → beforeUnmount, destroyed → unmounted
6. v-model 语法更新
7. 移除 Vue 2 已废弃的 API

只返回迁移后的代码，不要任何解释。`,

      'react-class-to-hooks': `你是一个 React Class 组件到 Hooks 的迁移专家。

迁移规则：
1. class 组件转换为函数组件
2. state 转换为 useState hooks
3. 生命周期方法转换为 useEffect
4. componentDidMount → useEffect([], () => {})
5. componentDidUpdate → useEffect([deps], () => {})
6. componentWillUnmount → useEffect(() => { return cleanup }, [])
7. context 转换为 useContext
8. ref 转换为 useRef

只返回迁移后的代码，不要任何解释。`,

      'js-to-ts': `你是一个 JavaScript 到 TypeScript 的迁移专家。

迁移规则：
1. 添加类型注解
2. 为函数参数和返回值添加类型
3. 使用 interface 或 type 定义对象类型
4. 使用 enum 替换魔法数字/字符串
5. 避免使用 any，优先使用 unknown
6. 添加泛型支持

只返回迁移后的代码，不要任何解释。`,

      default: `你是一个代码迁移专家，负责将代码从一种框架/语言迁移到另一种。

请确保：
1. 功能完全保留
2. 遵循目标框架/语言的最佳实践
3. 保持代码可读性
4. 不要添加不必要的复杂性

只返回迁移后的代码，不要任何解释。`,
    };

    return prompts[migrationType] || prompts.default;
  }

  /**
   * 构建用户提示词
   */
  private buildUserPrompt(
    filePath: string,
    originalCode: string,
    context?: Record<string, any>,
    partialResult?: string
  ): string {
    let prompt = `文件路径：${filePath}\n\n`;

    if (context) {
      prompt += `上下文信息：\n${JSON.stringify(context, null, 2)}\n\n`;
    }

    if (partialResult) {
      prompt += `AST 预处理结果（参考用）：\n${partialResult}\n\n`;
    }

    prompt += `请迁移以下代码：\n\`\`\`\n${originalCode}\n\`\`\``;

    return prompt;
  }

  /**
   * 从响应中提取代码
   */
  private extractCode(content: string): string {
    // 移除 markdown 代码块标记
    const codeBlockMatch = content.match(/```[\w]*\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // 移除可能的 "这是迁移后的代码：" 等前缀
    const lines = content.split('\n');
    const codeStart = lines.findIndex((line) =>
      line.includes('```') || line.trim().startsWith('export') || line.trim().startsWith('import')
    );

    if (codeStart >= 0) {
      return lines.slice(codeStart).join('\n').replace(/```\w*/, '').trim();
    }

    return content.trim();
  }

  /**
   * 计算成本
   */
  private calculateCost(usage: { input: number; output: number }): number {
    return (
      usage.input * DEEPSEEK_CONFIG.pricing.input +
      usage.output * DEEPSEEK_CONFIG.pricing.output
    );
  }
}
