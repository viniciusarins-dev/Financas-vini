import { createRemoteProvider } from './createRemoteProvider';
import { buildFinancePrompt } from './buildFinancePrompt';

export function createOpenAIProvider(apiKey?: string) {
  return createRemoteProvider({
    name: 'OpenAI',
    apiKey,
    async request(question, snapshot, key) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: buildFinancePrompt(question, snapshot) }],
          temperature: 0.3,
        }),
      });
      if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`);
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? 'Não consegui gerar uma resposta.';
      return { text };
    },
  });
}
