const supportedOperators = new Set(['equals', 'notEquals', 'includes', 'isAnswered', 'isNotAnswered']);

function responseValue(response) {
  if (response && typeof response === 'object' && 'value' in response) {
    return response.value;
  }

  return response;
}

function hasAnswer(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function evaluateDependency(dependency, answers = {}) {
  if (!dependency) {
    return true;
  }

  const { questionId, operator, value: expectedValue } = dependency;
  if (!questionId || !supportedOperators.has(operator)) {
    return false;
  }

  const actualValue = responseValue(answers[questionId]);
  const answered = hasAnswer(actualValue);

  switch (operator) {
    case 'equals':
      return answered && actualValue === expectedValue;
    case 'notEquals':
      return !answered || actualValue !== expectedValue;
    case 'includes':
      return Array.isArray(actualValue)
        ? actualValue.includes(expectedValue)
        : typeof actualValue === 'string' && actualValue.includes(String(expectedValue));
    case 'isAnswered':
      return answered;
    case 'isNotAnswered':
      return !answered;
    default:
      return false;
  }
}

export function getActiveQuestions(questions, answers = []) {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions.filter((question) => evaluateDependency(question.dependency, answers));
}
