import { createRemoteProvider } from './createRemoteProvider';
import { buildFinancePrompt } from './buildFinancePrompt';

export function createGeminiProvider(apiKey?: string) {
  return createRemoteProvider({
    name: 'Gemini',
    apiKey,
    async request(question, snapshot, key) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildFinancePrompt(question, snapshot) }] }],
          }),
        },
      );
      if (!response.ok) throw new Error(`Gemini request failed (${response.status})`);
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Não consegui gerar uma resposta.';
      return { text };
    },
  });
}
