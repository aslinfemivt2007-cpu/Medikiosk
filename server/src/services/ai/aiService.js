const approvedFollowUpTopics = new Set();
const unsafeResponsePattern = /diagnos|prescri|medicat|treatment|emergency|triage|recommend|clinical conclusion|patient has/i;

export function createAiService({ enabled = false } = {}) {
  return {
    enabled,
    async generatePatientSummary() {
      return {
        enabled: false,
        summary: null,
        warnings: ['AI assistance is disabled; use the rule-based patient summary.'],
        source: 'rule-based'
      };
    },
    async suggestDocumentationFollowUps() {
      return {
        enabled: false,
        suggestions: [],
        warnings: ['AI assistance is disabled; use approved rule-based questions.'],
        source: 'rule-based'
      };
    },
    filterFollowUpTopics(topics = []) {
      return [...new Set(topics)]
        .filter((topic) => approvedFollowUpTopics.has(topic))
        .slice(0, 3);
    },
    validateAIResponse(response) {
      if (!response || typeof response !== 'object') {
        return { valid: false, reason: 'AI response must be a structured object.' };
      }

      const serialized = JSON.stringify(response);
      if (unsafeResponsePattern.test(serialized)) {
        return { valid: false, reason: 'AI response contains unsupported clinical content.' };
      }

      return { valid: true, reason: null };
    }
  };
}

export const aiService = createAiService();
