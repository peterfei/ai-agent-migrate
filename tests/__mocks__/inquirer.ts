// ============================================
// inquirer 手动 Mock (解决 ESM 兼容性问题)
// ============================================

type PromptQuestion = any;
type PromptAnswers = Record<string, any>;

let mockResponses: PromptAnswers = {};

export function prompt(questions: PromptQuestion | PromptQuestion[]): Promise<PromptAnswers> {
  const questionsArray = Array.isArray(questions) ? questions : [questions];

  const answers: PromptAnswers = {};

  for (const question of questionsArray) {
    const name = question.name || question.key;
    if (name && mockResponses[name] !== undefined) {
      answers[name] = mockResponses[name];
    } else if (question.default !== undefined) {
      answers[name] = question.default;
    }
  }

  return Promise.resolve(answers);
}

// Mock 设置函数
export function __setMockResponses(responses: PromptAnswers) {
  mockResponses = responses;
}

export function __clearMockResponses() {
  mockResponses = {};
}

// 默认导出
export default { prompt, __setMockResponses, __clearMockResponses };
