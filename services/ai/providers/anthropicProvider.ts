import { createRemoteProvider } from './createRemoteProvider';
import { buildFinancePrompt } from './buildFinancePrompt';

export function createAnthropicProvider(apiKey?: string) {
  return createRemoteProvider({
    name: 'Anthropic',
    apiKey,
    async request(question, snapshot, key) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          messages: [{ role: 'user', content: buildFinancePrompt(question, snapshot) }],
        }),
      });
      if (!response.ok) throw new Error(`Anthropic request failed (${response.status})`);
      const data = await response.json();
      const text = data.content?.[0]?.text ?? 'Não consegui gerar uma resposta.';
      return { text };
    },
  });
}
